import { Router } from "express";

import { logout, refreshToken, signIn, signUp } from "./controller";

import { validateZod } from "../../middlewares/validateZod";

import { signInSchema } from "./dto/signIn";
import { signUpSchema } from "./dto/signUp";

const router = Router();

/*
 * -------------------- SIGN UP --------------------
 */

router.post(
  "/sign-up",
  validateZod({
    body: signUpSchema,
  }),
  signUp,
);

/*
 * -------------------- SIGN IN --------------------
 */

router.post(
  "/sign-in",
  validateZod({
    body: signInSchema,
  }),
  signIn,
);

/*
 * -------------------- LOGOUT --------------------
 */

router.post("/logout", logout);

/*
 * -------------------- REFRESH TOKEN --------------------
 */

router.post("/refresh-token", refreshToken);

export default router;
