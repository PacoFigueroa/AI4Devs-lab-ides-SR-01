import { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { upload } from '../middleware/upload.middleware';
import { validateCandidate, handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();
const candidateController = new CandidateController();

/**
 * GET /api/candidates/autocomplete/institutions
 * Get institution suggestions for autocomplete
 * Note: This must come before /:id route
 */
router.get(
  '/autocomplete/institutions',
  (req, res) => candidateController.getInstitutionSuggestions(req, res)
);

/**
 * GET /api/candidates/autocomplete/companies
 * Get company suggestions for autocomplete
 * Note: This must come before /:id route
 */
router.get(
  '/autocomplete/companies',
  (req, res) => candidateController.getCompanySuggestions(req, res)
);

/**
 * POST /api/candidates
 * Create a new candidate
 */
router.post(
  '/',
  upload.array('documents', 3), // Allow up to 3 files
  (req, res, next) => {
    // Parse candidateData and attach to body for validation
    try {
      if (req.body.candidateData) {
        const parsedData = JSON.parse(req.body.candidateData);
        Object.assign(req.body, parsedData);
      }
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Invalid candidate data format'
      });
    }
  },
  validateCandidate,
  handleValidationErrors,
  (req, res) => candidateController.createCandidate(req, res)
);

/**
 * GET /api/candidates
 * Get all candidates with pagination
 */
router.get(
  '/',
  (req, res) => candidateController.getCandidates(req, res)
);

/**
 * GET /api/candidates/:id
 * Get a single candidate by ID
 */
router.get(
  '/:id',
  (req, res) => candidateController.getCandidateById(req, res)
);

export default router;

