import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import fs from 'fs';

export const validateCandidate = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/)
    .withMessage('First name contains invalid characters'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/)
    .withMessage('Last name contains invalid characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    )
    .withMessage('Please provide a valid phone number'),

  body('address')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address must not exceed 200 characters'),

  body('linkedIn')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),

  body('portfolio')
    .optional({ values: 'falsy' })
    .trim()
    .isURL()
    .withMessage('Please provide a valid portfolio URL'),

  body('educations')
    .isArray({ min: 0 })
    .withMessage('Educations must be an array'),

  body('educations.*.institution')
    .trim()
    .notEmpty()
    .withMessage('Institution name is required'),

  body('educations.*.degree')
    .trim()
    .notEmpty()
    .withMessage('Degree is required'),

  body('educations.*.fieldOfStudy')
    .trim()
    .notEmpty()
    .withMessage('Field of study is required'),

  body('educations.*.startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid start date format'),

  body('educations.*.endDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Invalid end date format'),

  body('educations.*.current')
    .isBoolean()
    .withMessage('Current field must be boolean'),

  body('experiences')
    .isArray({ min: 0 })
    .withMessage('Experiences must be an array'),

  body('experiences.*.company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),

  body('experiences.*.position')
    .trim()
    .notEmpty()
    .withMessage('Position is required'),

  body('experiences.*.startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid start date format'),

  body('experiences.*.endDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Invalid end date format'),

  body('experiences.*.current')
    .isBoolean()
    .withMessage('Current field must be boolean'),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Clean up uploaded files if validation fails
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: Express.Multer.File) => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error('Error deleting file:', file.path, err);
          }
        });
      });
    }

    const formattedErrors = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: formattedErrors,
    });
  }

  next();
};
