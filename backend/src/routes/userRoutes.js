import express from "express";
import { handlerGetUser } from "../handlers/handlerGetUser.js";
import { handlerMakeUser } from "../handlers/handlerCreateUser.js";
import { handlerDeleteUser } from "../handlers/handlerDeleteUser.js";
import { handlerUpdateUser } from "../handlers/handlerUpdateUser.js";
import { authRoute } from "../middleware/authenticatedRouteMiddleware.js";
import { handlerLogIn } from "../handlers/handlerLogIn.js";
const router = express.Router();

router.post("/", handlerMakeUser);

router.post("/login", handlerLogIn);

// Authenticated Routes

router.get("/", authRoute, handlerGetUser);

router.put("/", authRoute, handlerUpdateUser);

router.delete("/", authRoute, handlerDeleteUser);

export default router;
