import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

router.get('/mail', AuthController.mailTest);

router.post('/login', AuthController.login);
router.post('/checkout-login', AuthController.checkoutLogin);
router.post('/admin-login', AuthController.adminLogin);
router.post('/register', AuthController.register);
// admin create
router.post(
  '/register-admin',
  AuthController.registerAdmin,
);
router.post('/logout', AuthController.logout);

router.patch('/change-password', AuthController.changePassword);
router.patch('/set-password', AuthController.setPassword);
router.patch('/forgot-password', AuthController.forgotPassword);
router.patch('/admin-forgot-password', AuthController.adminForgotPassword);

export const AuthRoutes = router;
