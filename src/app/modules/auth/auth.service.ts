import { Role, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../shared/jwtHelpers';
import { generatePassword } from '../../../shared/otpService';
import prisma from '../../../shared/prisma';
import { sendEmail } from '../../../shared/sendEmail';
import { resetTemplate } from '../../../utils/resettemplate';
import { ICheckoutLogin, ISignInData } from './auth.interface';

// register account
const register = async (userData: Partial<User | any>): Promise<any> => {
  delete userData.confirmPassword;
  const { password, sessionId, phone } = userData;

  if (userData?.email) {
    userData.email = userData?.email.toLowerCase();
  }

  const isUserExist = await prisma.user.findFirst({
    where: {
      phone,
    },
  });

  if (isUserExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Phone already exists. Please login!',
    );
  }

  if (userData?.email) {
    const isEmailExist = await prisma.user.findFirst({
      where: {
        email: userData.email,
      },
    });

    if (isEmailExist) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Email already exists. Please login!',
      );
    }
  }

  if (!sessionId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not created!');
  }

  const newUser = await prisma.user.findFirst({
    where: {
      sessionId,
    },
  });

  if (!newUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (!password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password is required');
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  userData.password = hashedPassword;
  userData.isUser = true;
  userData.role = Role.USER;

  const updateUser = await prisma.user.update({
    where: {
      sessionId: newUser.sessionId as string,
    },
    data: userData,
  });

  const { id: userId, role } = updateUser;

  const accessToken = jwtHelpers.createToken(
    { userId, sessionId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, sessionId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return { accessToken, refreshToken, result: updateUser, sessionId };
};

// login
const login = async (payload: ISignInData) => {
  let { email } = payload;
  const { password } = payload;

  if (email) {
    email = email.toLowerCase();
  }

  const isUserExist = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone: email }],
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }

  const isPasswordMatched = async (
    givenPassword: string,
    savedPassword: string,
  ) => {
    return await bcrypt.compare(givenPassword, savedPassword);
  };

  if (
    isUserExist.password &&
    !(await isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect');
  }

  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      loginCount: {
        increment: 1,
      },
    },
  });

  const { id: userId, sessionId, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId, sessionId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, sessionId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    sessionId,
  };
};

// login
const checkoutLogin = async (payload: ICheckoutLogin) => {
  if (payload.email) {
    payload.email = payload.email.toLowerCase();
  }

  const isUserExist = await prisma.user.findFirst({
    where: { email: payload.email, sessionId: payload.sessionId },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }

  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      loginCount: {
        increment: 1,
      },
    },
  });

  const { id: userId, sessionId, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId, sessionId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, sessionId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    sessionId,
  };
};

// Function to register an admin
const registerAdmin = async (adminData: Partial<User | any>) => {
  const { password, ...userData } = adminData;
  let { email } = adminData;

  if (email) {
    email = email.toLowerCase();
  }

  const isUserExist = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Email already exists. Please login!',
    );
  }

  // const sendPassword = generatePassword();

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const sessionId = uuidv4();

  const admin = await prisma.user.create({
    data: {
      ...userData,
      sessionId,
      email,
      password: hashedPassword,
      isUser: true,
    },
  });

  // send email
  await sendEmail(
    email,
    'Admin Registration Successful',
    `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px;">
        <h1 style="color: #ff6f61;">Welcome to Our Team, ${admin.firstName}!</h1>
        <p style="color: #555;">We are thrilled to have you on board. Your account has been created successfully.</p>
        <div style="margin-top: 20px; background-color: #ffe6e6; padding: 15px; border-radius: 8px;">
          <p style="font-weight: bold;">Your temporary password is:</p>
          // <p style="color: #ff6f61; font-size: 18px;">12345678</p>
        </div>
        <p style="color: #555;">Please use this password to login to your account and make sure to change it after your first login for security purposes.</p>
        <p style="margin-top: 20px;">Thank you,</p>
        <p style="font-weight: bold; color: #ff6f61;">The Team</p>
      </div>
    </div>
  `,
  );

  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not created!');
  }

  return admin;
};

// admin login
const adminLogin = async (payload: User) => {
  const { password } = payload;
  let { email } = payload;

  if (email) {
    email = email.toLowerCase();
  }

  const isPasswordMatched = async (
    givenPassword: string,
    savedPassword: string,
  ) => {
    return await bcrypt.compare(givenPassword, savedPassword);
  };

  const isUserExist = await prisma.user.findFirst({
    where: { email },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Admin not found');
  }

  if (isUserExist.role === Role.USER || isUserExist.role === Role.GUEST) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You don't have permission to login as admin",
    );
  }

  if (
    isUserExist.password &&
    !(await isPasswordMatched(password!, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  await prisma.user.update({
    where: { id: isUserExist.id },
    data: {
      loginCount: {
        increment: 1,
      },
      lastLogin: new Date(),
    },
  });

  const { id: userId, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    sessionId: isUserExist.sessionId,
  };
};

const forgotPassword = async (email: string) => {
  if (email) {
    email = email.toLowerCase();
  }

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role !== Role.GUEST && user.role !== Role.USER) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not a valid user!');
  }
  // Generate new OTP and update OTP secret and creation time
  const password = generatePassword();

  await sendEmail(email, 'Your Password Reset', resetTemplate(password));

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  // send otp

  // const token = jwtHelpers.createToken(
  //   { userId: user.id, role: user.role, email: user.email },
  //   config.jwt.secret as Secret,
  //   config.jwt.expires_in as string,
  // );

  // const resetPasswordLink = `${config.frontendUrlResetPasswordLink}/reset-password?token=${token}`;

  // // send email
  // await sendEmail(
  //   email,
  //   'Password Reset Request',
  //   `
  //   <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
  //     <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px;">
  //       <h1 style="color: #ff6f61;">Password Reset Request</h1>
  //       <p style="color: #555;">Hi ${user.firstName},</p>
  //       <p style="color: #555;">We received a request to reset your password. Click the button below to reset it:</p>
  //       <div style="margin-top: 20px; text-align: center;">
  //         <a
  //           href="${resetPasswordLink}"
  //           style="display: inline-block; padding: 10px 20px; color: white; background-color: #ff6f61; border-radius: 5px; text-decoration: none; font-weight: bold;"
  //         >
  //           Reset Password
  //         </a>
  //       </div>
  //       <p style="margin-top: 20px; color: #555;">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
  //       <p style="margin-top: 20px;">Thank you,</p>
  //       <p style="font-weight: bold; color: #ff6f61;">The Team</p>
  //     </div>
  //   </div>
  // `,
  // );

  return { message: 'Please check your email!' };
};

const adminForgotPassword = async (email: string) => {
  if (email) {
    email = email.toLowerCase();
  }

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (
    user.role !== Role.ADMIN &&
    user.role !== Role.EMPLOYEE &&
    user.role !== Role.MANAGER &&
    user.role !== Role.SUPER_ADMIN
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not a valid user!');
  }
  // Generate new password
  const password = generatePassword();

  await sendEmail(email, 'Your Password Reset', resetTemplate(password));

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });

  return { message: 'Please check your email!' };
};

const changePassword = async (payload: any) => {
  const { userId, currentPassword, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }

  const isPasswordMatched = async (
    givenPassword: string,
    savedPassword: string,
  ) => {
    return await bcrypt.compare(givenPassword, savedPassword);
  };

  if (
    isUserExist.password &&
    !(await isPasswordMatched(currentPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Current Password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

const setPassword = async (payload: any) => {
  const { userId, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      password: hashedPassword,
      setPassword: false,
    },
  });
};

const mailTest = async () => {
  await sendEmail(
    'f4faysals@gmail.com',
    'Password Reset',
    `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px;">
        <h1 style="color: #ff6f61;">Welcome to Our Team, Faysal Hossain!</h1>
        <p style="color: #555;">We are thrilled to have you on board. Your account has been created successfully.</p>
        <div style="margin-top: 20px; background-color: #ffe6e6; padding: 15px; border-radius: 8px;">
          <p style="font-weight: bold;">Your temporary password is:</p>
          <p style="color: #ff6f61; font-size: 18px;">12345678</p>
        </div>
        <p style="color: #555;">Please use this password to login to your account and make sure to change it after your first login for security purposes.</p>
        <p style="margin-top: 20px;">Thank you,</p>
        <p style="font-weight: bold; color: #ff6f61;">The Team</p>
      </div>
    </div>
  `,
  );

  return { message: 'Mail sent successfully!' };
};

export const AuthService = {
  mailTest,
  registerAdmin,
  adminLogin,
  forgotPassword,
  login,
  register,
  changePassword,
  checkoutLogin,
  adminForgotPassword,
  setPassword,
};
