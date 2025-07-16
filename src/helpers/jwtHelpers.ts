import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string,
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

const decoded = (token: string): JwtPayload => {
  return jwt.decode(token, { complete: true }) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
  decoded,
};
