import { Router } from 'express';
import RoleController from '../controllers/role.controller';

const router: Router = Router();

router.post('/', RoleController.create);

export default router;
