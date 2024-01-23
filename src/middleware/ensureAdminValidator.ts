import { NextFunction, Request, Response } from 'express';

import logger from '../config/logger';
import { Constants } from '../constants/constants';
import apiHandler from '../utils/apiHandler';

export const ensureAdminValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info(`middleware: ensureAdminValidator start`);
  if (req.body.jwtDecodedUser?.role !== Constants.UserRole.ADMIN) {
    return apiHandler.errorHandler(
      {
        message: Constants.ErrorMessage.INVALID_USER,
        statusCode: Constants.Http.FORBIDDEN,
      },
      res,
    );
  }
  logger.info(`middleware: ensureAdminValidator passed`);
  next();
};
