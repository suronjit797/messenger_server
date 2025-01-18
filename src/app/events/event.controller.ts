import { RequestHandler } from "express";
import eventServices from "./event.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import EventModel from "./event.model";
import globalController from "../../global/global.controller";

// variables
const name = "Event";
// global
const globalControllers = globalController(eventServices, name);

// custom
export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const pagination = paginationHelper(req.query);
    const filter = filterHelper(req, new EventModel(), ["title", "type"]);

    const { data, meta } = await eventServices.getAll(pagination, filter);

    const payload = {
      success: true,
      message: `${name}s fetched successfully`,
      meta,
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

const eventController: any = { ...globalControllers, getAll };
export default eventController;
