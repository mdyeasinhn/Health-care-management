import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFileds } from "./admin.constent";
import sendResponse from "../../../shared/sendResponse";



const getAllAdminFromDB = async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterAbleFileds);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  try {
    const result = await adminService.getAllAdminFromDB(filters, options);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrieving All Admin Data from the Database",
      meta: result.meta,
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err?.message || "Something went wrong!",
      data: null,
    });
  }
};

const getByIdFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await adminService.getByIdFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data fetched by ID!",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err?.message || "Something went wrong!",
      data: null,
    });
  }
};

const updatedIntoDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const result = await adminService.updatedIntoDB(id, data);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data updated!",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err?.message || "Something went wrong!",
      data: null,
    });
  }
};

const deleteIntoDB = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await adminService.deleteFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data deleted!",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err?.message || "Something went wrong!",
      data: null,
    });
  }
};

const softDeleteIntoDB = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await adminService.softDeleteFromDB(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data soft-deleted!",
      data: result,
    });
  } catch (err: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: err?.message || "Something went wrong!",
      data: null,
    });
  }
};

export const adminController = {
  getAllAdminFromDB,
  getByIdFromDB,
  updatedIntoDB,
  deleteIntoDB,
  softDeleteIntoDB,
};
