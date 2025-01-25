/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-user',

  fileUploadHandler(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the body if it contains data in stringified JSON format
      let validatedData;
      if (req.body.data) {
        validatedData = UserValidation.createUserSchema.parse(
          JSON.parse(req.body.data),
        );
      }

      // Handle image updates if files are uploaded
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Assuming `fileUploadHandler` stores files in req.files
        const uploadedFiles = req.files.map((file: any) => file.path);
        validatedData = {
          ...validatedData,
          image: uploadedFiles[0], // Update the specific image field
        };
      }

      // Pass the validated data to the controller
      req.body = validatedData;
      await UserController.createUser(req, res, next);
    } catch (error) {
      next(error);
    }
  },
);

// router.get('/all-user', auth(USER_ROLES.ADMIN), UserController.getAllUser);

/*
router.post(
  '/update-profile',
  fileUploadHandler(),
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the body if it contains data in stringified JSON format
      let validatedData;
      if (req.body.data) {
        validatedData = UserValidation.updateUserProfileSchema.parse(
          JSON.parse(req.body.data),
        );
      }

      // Handle image updates if files are uploaded
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Assuming `fileUploadHandler` stores files in req.files
        const uploadedFiles = req.files.map((file: any) => file.path);
        validatedData = {
          ...validatedData,
          image: uploadedFiles[0], // Update the specific image field
        };
      }

      // Pass the validated data to the controller
      req.body = validatedData;
      await UserController.updateProfile(req, res, next);
    } catch (error) {
      next(error);
    }
  },
);

*/

// router.post(
//   '/update-profile',
//   fileUploadHandler(),
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       let validatedData = {};

//       // Parse and validate JSON data from the body
//       if (req.body.data) {
//         try {
//           validatedData = JSON.parse(req.body.data);
//         } catch (error) {
//           return next(
//             new ApiError(StatusCodes.BAD_REQUEST, 'Invalid JSON data'),
//           );
//         }
//       }

//       // Process uploaded files
//       if (req.files) {
//         const files = req.files as Record<string, Express.Multer.File[]>;
//         const filePaths: Record<string, string> = {};

//         for (const key in files) {
//           if (files[key] && files[key].length > 0) {
//             filePaths[key] = files[key][0].path; // Store the first file's path for each field
//           }
//         }

//         // Merge uploaded file paths into validated data
//         validatedData = { ...validatedData, ...filePaths };
//       }

//       // Pass the validated data to the controller
//       req.body = validatedData;
//       await UserController.updateProfile(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// router.get(
//   '/user',
//   auth(USER_ROLES.ADMIN, USER_ROLES.USER),
//   UserController.getUserProfile,
// );

// router.get('/get-all-users', auth(USER_ROLES.ADMIN), UserController.getAllUser);

// router.get(
//   '/get-single-user/:id',
//   auth(USER_ROLES.ADMIN),
//   UserController.getSingleUser,
// );

// // get user by search by phone
// router.get(
//   '/user-search',
//   auth(USER_ROLES.ADMIN, USER_ROLES.USER),
//   UserController.searchByPhone,
// );

// router.get(
//   '/profile',
//   auth(USER_ROLES.ADMIN, USER_ROLES.USER),
//   UserController.getUserProfile,
// );

export const UserRoutes = router;
