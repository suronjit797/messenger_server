import { RequestHandler } from "express";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../ApiError";

const globalController = (
  service: Record<string, Function>,
  name: string
): { create: RequestHandler; getSingle: RequestHandler; update: RequestHandler; remove: RequestHandler } => {
  return {
    create: async (req, res, next) => {
      try {
        const data = await service.create(req.body);

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
    },

    getSingle: async (req, res, next) => {
      try {
        const data = await service.getSingle(req.params.id);
        const payload = {
          success: true,
          message: `${name} fetched successfully`,
          data,
        };
        return sendResponse(res, httpStatus.OK, payload);
      } catch (error) {
        next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        const data = await service.update(req.params.id, req.body);

        if (!data) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
        }

        const payload = {
          success: true,
          message: `${name} updated successfully`,
          data,
        };
        return sendResponse(res, httpStatus.OK, payload);
      } catch (error) {
        next(error);
      }
    },

    remove: async (req, res, next) => {
      try {
        const data = await service.remove(req.params.id);

        const payload = {
          success: true,
          message: `${name} deleted successfully`,
          data,
        };
        return sendResponse(res, httpStatus.OK, payload);
      } catch (error) {
        next(error);
      }
    },
  };
};

export default globalController;
