
import {
  createSchedule as createScheduleModel,
  getUserSchedules,
  scheduleByID,
  updateSchedule as updateScheduleModel,
  deleteSchedule as deleteScheduleModel
} from "../models/scheduleModel.js";

import { ApiError } from "../middleware/errorHandler.js";

// 1. Create a schedule
export const createSchedule = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      medicine_name,
      dosage_instructions,
      reminder_times,
      start_date,
      end_date
    } = req.body;

    const schedule = await createScheduleModel(
      userId,
      medicine_name,
      dosage_instructions,
      reminder_times,
      start_date,
      end_date
    );

    return res.status(201).json({
      success: true,
      message: "Medication schedule created successfully.",
      schedule
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get all schedules belonging to the logged-in user
export const getMySchedules = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const schedules = await getUserSchedules(userId);

    return res.status(200).json({
      success: true,
      count: schedules.length,
      schedules
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get one schedule by ID
export const getScheduleById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const scheduleId = Number(req.params.id);

    if (!Number.isSafeInteger(scheduleId) || scheduleId <= 0) {
      return next(new ApiError(400, "Invalid schedule ID."));
    }

    const schedule = await scheduleByID(scheduleId, userId);

    if (!schedule) {
      return next(
        new ApiError(
          404,
          "Schedule not found or you do not have permission to view it."
        )
      );
    }
//     if (!schedule) {
//   return res.status(404).json({
//     success: false,
//     message: "Schedule not found"
//   });
// }

    return res.status(200).json({
      success: true,
      schedule
    });
  } catch (error) {
    next(error);
  }
};

// 4. Update one schedule
export const updateSchedule = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const scheduleId = Number(req.params.id);

    if (!Number.isSafeInteger(scheduleId) || scheduleId <= 0) {
      return next(new ApiError(400, "Invalid schedule ID."));
    }

    const {
      medicine_name,
      dosage_instructions,
      reminder_times,
      start_date,
      end_date
    } = req.body;

    const schedule = await updateScheduleModel(
      scheduleId,
      userId,
      {
        medicine_name,
        dosage_instructions,
        reminder_times,
        start_date,
        end_date
      }
    );

    if (!schedule) {
      return next(
        new ApiError(
          404,
          "Schedule not found or you do not have permission to update it."
        )
      );
    }

    return res.status(200).json({
      success: true,
      message: "Medication schedule updated successfully.",
      schedule
    });
  } catch (error) {
    next(error);
  }
};

// 5. Delete one schedule
export const deleteSchedule = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const scheduleId = Number(req.params.id);

    if (!Number.isSafeInteger(scheduleId) || scheduleId <= 0) {
      return next(new ApiError(400, "Invalid schedule ID."));
    }

    const deleted = await deleteScheduleModel(scheduleId, userId);

    if (!deleted) {
      return next(
        new ApiError(
          404,
          "Schedule not found or you do not have permission to delete it."
        )
      );
    }

    return res.status(200).json({
      success: true,
      message: "Medication schedule deleted successfully.",
      deletedScheduleId: deleted.schedule_id
    });
  } catch (error) {
    next(error);
  }
};
