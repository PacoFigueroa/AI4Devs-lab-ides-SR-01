import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CandidateInput, ApiResponse } from '../types/candidate.types';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

/**
 * Helper function to delete uploaded files
 */
const deleteUploadedFiles = (files: Express.Multer.File[]) => {
  if (files && files.length > 0) {
    files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error('Error deleting file:', file.path, err);
        }
      });
    });
  }
};

export class CandidateController {
  /**
   * Create a new candidate with education, experience, and documents
   */
  async createCandidate(req: Request, res: Response): Promise<void> {
    try {
      const candidateData: CandidateInput = JSON.parse(
        req.body.candidateData || '{}',
      );
      const files = req.files as Express.Multer.File[];

      // Check if candidate with email already exists
      const existingCandidate = await prisma.candidate.findUnique({
        where: { email: candidateData.email },
      });

      if (existingCandidate) {
        // Delete uploaded files since we won't create the candidate
        deleteUploadedFiles(files);

        res.status(409).json({
          success: false,
          error: 'A candidate with this email already exists',
        } as ApiResponse<null>);
        return;
      }

      // Create candidate with related data in a transaction
      const candidate = await prisma.$transaction(async (tx) => {
        // Create candidate
        const newCandidate = await tx.candidate.create({
          data: {
            firstName: candidateData.firstName,
            lastName: candidateData.lastName,
            email: candidateData.email,
            phone: candidateData.phone,
            address: candidateData.address,
            linkedIn: candidateData.linkedIn,
            portfolio: candidateData.portfolio,
          },
        });

        // Create educations if provided
        if (candidateData.educations && candidateData.educations.length > 0) {
          await tx.education.createMany({
            data: candidateData.educations.map((edu) => ({
              candidateId: newCandidate.id,
              institution: edu.institution,
              degree: edu.degree,
              fieldOfStudy: edu.fieldOfStudy,
              startDate: new Date(edu.startDate),
              endDate: edu.endDate ? new Date(edu.endDate) : null,
              current: edu.current,
              description: edu.description,
            })),
          });
        }

        // Create experiences if provided
        if (candidateData.experiences && candidateData.experiences.length > 0) {
          await tx.experience.createMany({
            data: candidateData.experiences.map((exp) => ({
              candidateId: newCandidate.id,
              company: exp.company,
              position: exp.position,
              description: exp.description,
              startDate: new Date(exp.startDate),
              endDate: exp.endDate ? new Date(exp.endDate) : null,
              current: exp.current,
            })),
          });
        }

        // Create document records if files were uploaded
        if (files && files.length > 0) {
          await tx.document.createMany({
            data: files.map((file) => ({
              candidateId: newCandidate.id,
              fileName: file.filename,
              originalName: file.originalname,
              fileType: file.mimetype,
              fileSize: file.size,
              filePath: file.path,
              documentType: 'resume',
            })),
          });
        }

        // Fetch complete candidate with relations
        return await tx.candidate.findUnique({
          where: { id: newCandidate.id },
          include: {
            educations: true,
            experiences: true,
            documents: true,
          },
        });
      });

      res.status(201).json({
        success: true,
        data: candidate,
      } as ApiResponse<typeof candidate>);
    } catch (error: any) {
      console.error('Error creating candidate:', error);

      // Delete uploaded files if database operation failed
      const files = req.files as Express.Multer.File[];
      deleteUploadedFiles(files);

      res.status(500).json({
        success: false,
        error:
          error.message || 'An error occurred while creating the candidate',
      } as ApiResponse<null>);
    }
  }

  /**
   * Get all candidates with pagination
   */
  async getCandidates(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [candidates, total] = await Promise.all([
        prisma.candidate.findMany({
          skip,
          take: limit,
          include: {
            educations: true,
            experiences: true,
            documents: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.candidate.count(),
      ]);

      res.status(200).json({
        success: true,
        data: {
          candidates,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error: any) {
      console.error('Error fetching candidates:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching candidates',
      } as ApiResponse<null>);
    }
  }

  /**
   * Get a single candidate by ID
   */
  async getCandidateById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const candidate = await prisma.candidate.findUnique({
        where: { id: parseInt(id) },
        include: {
          educations: true,
          experiences: true,
          documents: true,
        },
      });

      if (!candidate) {
        res.status(404).json({
          success: false,
          error: 'Candidate not found',
        } as ApiResponse<null>);
        return;
      }

      res.status(200).json({
        success: true,
        data: candidate,
      } as ApiResponse<typeof candidate>);
    } catch (error: any) {
      console.error('Error fetching candidate:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching the candidate',
      } as ApiResponse<null>);
    }
  }

  /**
   * Get autocomplete suggestions for institutions
   */
  async getInstitutionSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Query parameter is required',
        });
        return;
      }

      const institutions = await prisma.education.findMany({
        where: {
          institution: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          institution: true,
        },
        distinct: ['institution'],
        take: 10,
      });

      const suggestions = institutions.map((edu) => edu.institution);

      res.status(200).json({
        success: true,
        data: suggestions,
      });
    } catch (error: any) {
      console.error('Error fetching institution suggestions:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching suggestions',
      });
    }
  }

  /**
   * Get autocomplete suggestions for companies
   */
  async getCompanySuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Query parameter is required',
        });
        return;
      }

      const companies = await prisma.experience.findMany({
        where: {
          company: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          company: true,
        },
        distinct: ['company'],
        take: 10,
      });

      const suggestions = companies.map((exp) => exp.company);

      res.status(200).json({
        success: true,
        data: suggestions,
      });
    } catch (error: any) {
      console.error('Error fetching company suggestions:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching suggestions',
      });
    }
  }
}
