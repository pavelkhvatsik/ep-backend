import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router: Router = Router();

router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.post('/refresh-tokens', authController.refreshTokens);

export default router;
