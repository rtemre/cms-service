import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import logger from '../config/logger';
import { Constants } from '../constants/constants';
import { SSMService } from '../services/ssm.service';
import apiHandler from '../utils/apiHandler';

export const jwtValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secret = SSMService.secret;
  logger.info(`Middelware : performing jwtValidator`);
  try {
    const header = req.headers?.authorization;
    if (!header) {
      logger.error(`Middelware : jwt validator failed`);
      return apiHandler.errorHandler(
        {
          message: Constants.ErrorMessage.HEADER_AUTHORIZATION_NOT_passed,
          statusCode: Constants.Http.UNAUTHORIZED,
        },
        res,
      );
    }
    const parts = header.split(' ');
    if (parts.length !== 2) {
      logger.error(`Middelware : jwt validator failed`);
      return apiHandler.errorHandler(
        {
          message: Constants.ErrorMessage.INVALID_TOKEN,
          statusCode: Constants.Http.UNAUTHORIZED,
        },
        res,
      );
    }
    const scheme = parts[0];
    const token = parts[1];

    if (!/^Bearer$/i.test(scheme)) {
      logger.error(`Middelware : jwt validator failed`);
      return apiHandler.errorHandler(
        {
          message: Constants.ErrorMessage.INVALID_TOKEN,
          statusCode: Constants.Http.UNAUTHORIZED,
        },
        res,
      );
    }
    const decoded = jwt.verify(token, secret?.JWT_SECRET);
    if (!decoded.id || !decoded.role) {
      logger.error(`Middelware : jwt validator failed`);
      return apiHandler.errorHandler(
        {
          message: Constants.ErrorMessage.TOKEN_DOES_NOT_CONTAIN_ID_OR_ROLE,
          statusCode: Constants.Http.UNAUTHORIZED,
        },
        res,
      );
    }
    req.body.jwtDecodedUser = decoded;
    logger.info(`Middelware : jwt validator passed`);
    next();
  } catch (err) {
    logger.error(`Middelware : jwt validator failed`);
    return apiHandler.errorHandler(
      {
        message: Constants.ErrorMessage.INTERNAL_SERVER_ERROR,
        statusCode: Constants.Http.INTERNAL_SERVER_ERROR,
      },
      res,
    );
  }
};
