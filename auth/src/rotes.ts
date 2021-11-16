import { Router } from "express";
import { login, logout, register, user } from "./controllers/authController";
import { forgot, reset } from "./controllers/forgotController";

export const routes = (router: Router) => {
  router.post("/api/register", register);

  router.post("/api/login", login);

  router.get("/api/user", user);
  router.post("/api/logout", logout);

  router.post("/api/forgot", forgot);
  router.post("/api/reset", reset);
};
