import { v4 as uuidv4 } from 'uuid';
import prisma from './prisma';

export const createSession = async () => {
  const sessionId = uuidv4();
  await prisma.user.create({
    data: { isUser: false, sessionId },
  });

  return sessionId;
};
