import { Router } from 'express';

import authRouter from './auth.router';
import roleRouter from './role.router';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/role', roleRouter);

export default router;
