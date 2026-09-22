import bcrypt from "bcrypt";

import { prisma } from "../../config/prisma";
import { AppError } from "../../core/error";
import { generateTokens } from "../../services/jwt";

import type { SignUpDto } from "./dto/signUp";
import type { SignInDto } from "./dto/signIn";

const SALT_ROUNDS = 10;

/*
 * -------------------- SIGN UP --------------------
 */

export const signUp = async (data: SignUpDto) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw AppError.conflict("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      role: "USER",
    },

    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

/*
 * -------------------- SIGN IN --------------------
 */

export const signIn = async (data: SignInDto) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw AppError.unauthorized("Invalid email or password");
  }

  /*
   * Generate access token + refresh token
   */

  const { accessToken, refreshToken } = generateTokens({
    id: user.id,
    role: user.role,
  });

  return {
    accessToken,
    refreshToken,

    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};
