export const resetPassword = async (
  username: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new Error("User not found");
  }
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { username },
    data: { password_hash: newPasswordHash },
  });
};
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

export const login = async (
  username: string,
  password: string
): Promise<Object> => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error("Invalid username or password");
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("FATAL: JWT_SECRET is not defined in the .env file.");
    // Throw a generic error to the user to avoid exposing internal details
    throw new Error("Authentication configuration error.");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role_id }, // Payload
    jwtSecret as Secret, // Use the validated secret
    {
      expiresIn: "1h", // Default to 1 hour if not set
    }
  );

  const { password_hash, ...userWithoutPassword } = user;

  return token;
};

export const changePassword = async (
  username: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isPasswordValid) {
    throw new Error("Old password is incorrect");
  }
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { username },
    data: { password_hash: newPasswordHash },
  });
};

export const me = async (token: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("Authentication configuration error.");
  }
  const decoded = jwt.verify(token, jwtSecret) as { userId: number };
  const user = await prisma.user.findUnique(
    { where: { id: decoded.userId }, 
    include: 
    { 
      role: {
        include: {
            permissions: true,
          },
    },
  },
});
  if (!user) {
    throw new Error("User not found");
  }
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};