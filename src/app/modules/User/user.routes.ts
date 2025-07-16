import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';

const router = Router();

//customer routes
router.get('/', UserController.getAllData);
router.get('/current/:id', UserController.getUserBySessionId);
router.get('/get-me', UserController.getMe);
// admin routes
router.get(
  '/admin-profile',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EMPLOYEE,
    ENUM_USER_ROLE.MANAGER,
  ),
  UserController.adminProfile,
);
router.get(
  '/all-admin',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.MANAGER,
  ),
  UserController.allAdmin,
);
router.get(
  '/admin/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.MANAGER,
  ),
  UserController.getAdminById,
);
router.get('/:id', UserController.getUserById);

router.post('/', UserController.insertIntoDb);
router.patch('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.delete('/delete-admin/:id', UserController.deleteAllAdmin);
router.delete('/delete-guest', UserController.deleteAllAdmin);
router.delete('/delete-register', UserController.deleteAllAdmin);

export const UserRoutes = router;
