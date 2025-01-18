import express from "express";
import { eventCreateValidate, eventUpdateValidate } from "./event.validation";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
// import { auth } from "../../../middleware/auth";
import eventController from "./event.controller";
import { setUserInBody } from "../../middleware/setUserInBody";

const eventRouter = express.Router();

eventRouter.post("/", validatorMiddleware(eventCreateValidate), setUserInBody, eventController.create);

eventRouter.get("/", eventController.getAll);

eventRouter.get("/:id", eventController.getSingle);
eventRouter.put("/:id", validatorMiddleware(eventUpdateValidate), eventController.update);
eventRouter.delete("/:id", eventController.remove);

export default eventRouter;
