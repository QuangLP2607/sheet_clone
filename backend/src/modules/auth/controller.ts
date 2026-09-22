import type { NextFunction, Request, Response } from "express";
import ms, { type StringValue } from "ms";

import { sendResponse } from "../../core/response";
import { refreshAccessToken } from "../../services/jwt";

import * as authService from "./service";

/*
 * -------------------- SIGN UP --------------------
 */

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const user = await authService.signUp(req.body);

    return sendResponse(res, 201, {
      message: "Sign up successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- SIGN IN --------------------
 */

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const result = await authService.signIn(req.body);

    const { accessToken, refreshToken, user } = result;

    /*
     * Refresh token cookie
     */

    const refreshTokenExpires = process.env.JWT_REFRESH_TOKEN_EXPIRES ?? "7d";

    const maxAgeMs = ms(refreshTokenExpires as StringValue);

    if (maxAgeMs <= 0) {
      throw new Error(
        `Invalid time format for JWT_REFRESH_TOKEN_EXPIRES: ${refreshTokenExpires}`,
      );
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: maxAgeMs,
    });

    /*
     * Response
     */

    return sendResponse(res, 200, {
      message: "Sign in successfully",
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- LOGOUT --------------------
 */

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return sendResponse(res, 200, {
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/*
 * -------------------- REFRESH TOKEN --------------------
 */

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    /*
     * Missing refresh token
     */

    if (!refreshToken) {
      return sendResponse(res, 401, {
        message: "Missing refresh token",
      });
    }

    /*
     * Verify refresh token
     */

    const newAccessToken = refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      return sendResponse(res, 403, {
        message: "Invalid or expired refresh token",
      });
    }

    return sendResponse(res, 200, {
      message: "Access token refreshed successfully",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
