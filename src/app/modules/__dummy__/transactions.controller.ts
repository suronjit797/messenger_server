import { RequestHandler } from "express";
import transactionServices from "./transactions.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import TransactionsModel from "./transactions.model";
import globalController from "../../global/global.controller";

// variables
const name = "Transaction";
// global
const globalControllers = globalController(transactionServices, name);

// custom
export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const pagination = paginationHelper(req.query);
    const filter = filterHelper(req, new TransactionsModel(), ["title", "type"]);

    const { data, meta } = await transactionServices.getAll(pagination, filter);

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

const create: RequestHandler = async (req, res, next) => {
  try {
    const body = { ...req.body, user: req.user.userId };
    const data = await transactionServices.create(body);

    const payload = {
      success: true,
      message: `${name} created successfully`,
      data,
    };
    return sendResponse(res, httpStatus.CREATED, payload);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const summary: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = await transactionServices.summary(userId);

    const payload = {
      success: true,
      message: `${name} summary get successfully`,
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const overall: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = await transactionServices.overall(userId);

    const payload = {
      success: true,
      message: `${name} overall get successfully`,
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const transactionsController: any = { ...globalControllers, getAll, create, summary, overall };
export default transactionsController;
