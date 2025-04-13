import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFileds } from "./admin.constent";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from 'http-status-codes';

// Get all admin data with filtering, pagination, and sorting
const getAllAdminFromDB = async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterAbleFileds);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  try {
    const result = await adminService.getAllAdminFromDB(filters, options);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Retrieving all admin data from the database",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: err?.message || "Something went wrong!",
      data: null,
    });
  }
};

// Get a single admin by ID
const getByIdFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await adminService.getByIdFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data fetched by ID!",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: err?.message || "Something went wrong!",
      data: null,
    });
  }
};

// Update admin data by ID
const updatedIntoDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const result = await adminService.updatedIntoDB(id, data);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data updated!",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: err?.message || "Something went wrong!",
      data: null,
    });
  }
};

// Permanently delete admin data by ID
const deleteIntoDB = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await adminService.deleteFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data deleted!",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: err?.message || "Something went wrong!",
      data: null,
    });
  }
};

// Soft delete admin data by ID (mark as deleted without removing)
const softDeleteIntoDB = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await adminService.softDeleteFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin data soft-deleted!",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: err?.message || "Something went wrong!",
      data: null,
    });
  }
};

// Export all admin controller methods
export const adminController = {
  getAllAdminFromDB,
  getByIdFromDB,
  updatedIntoDB,
  deleteIntoDB,
  softDeleteIntoDB,
};
