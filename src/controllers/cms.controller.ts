import { Request, Response } from 'express';

import logger from '../config/logger';
import { Constants } from '../constants/constants';
import {
  ICmsQueryParams,
  ICreateCmsData,
  IUpdateCmsData,
} from '../db/entity/Cms';
import cmsService from '../services/cms.service';
import apiHandler from '../utils/apiHandler';

class CmsController {
  async getCms(req: Request, res: Response) {
    try {
      logger.info(
        `Cms Controller : getCms, request-query : ${JSON.stringify(
          req.query,
        )} `,
      );
      const reqQuery: ICmsQueryParams = {
        page: Constants.Pagination.DEFAULT_PAGE,
        pageSize: Constants.Pagination.DEFAULT_LIMIT,
        language: '',
      };
      if (req.query?.language) {
        const language = req.query?.language as string;
        reqQuery.language = language.toLowerCase();
      }
      if (req.query?.page) {
        const page = Number(req.query.page);
        reqQuery.page = page;
      }
      if (req.query?.limit) {
        const pageSize = Number(req.query.limit);
        reqQuery.pageSize = pageSize;
      }
      const response = await cmsService.getCms(reqQuery);
      return apiHandler.responseHandler(
        response,
        Constants.CmsMessage.CONTENTS_FETCHED_SUCCESSFULLY,
        Constants.Http.OK,
        res,
      );
    } catch (err) {
      logger.error(err);
      return apiHandler.errorHandler(err, res);
    }
  }

  async getContentTypes(req: Request, res: Response) {
    try {
      logger.info(`Cms Controller : getContentTypes`);
      const response = await cmsService.getContentTypes();
      return apiHandler.responseHandler(
        response,
        Constants.CmsMessage.CONTENT_TYPE_FOUND,
        Constants.Http.OK,
        res,
      );
    } catch (err) {
      logger.error(err);
      return apiHandler.errorHandler(err, res);
    }
  }

  async getContentData(req: Request, res: Response) {
    try {
      logger.info(
        `Cms Controller : getContentData, request-params : ${JSON.stringify(
          req.params,
        )}, request-headers : ${JSON.stringify(req.headers)}`,
      );
      const slug = req.params.slug as string;
      let language = req.headers?.language as string;
      if (!language) {
        language = Constants.Language.EN;
      }
      const response = await cmsService.getContentData(
        slug.toLowerCase(),
        language.toLowerCase(),
      );
      if (!response) {
        return apiHandler.errorHandler(
          {
            message: Constants.CmsMessage.CMS_DATA_NOT_FOUND,
            statusCode: Constants.Http.NOT_FOUND,
          },
          res,
        );
      }
      return apiHandler.responseHandler(
        response,
        Constants.CmsMessage.CMS_DATA_FOUND,
        Constants.Http.OK,
        res,
      );
    } catch (err) {
      logger.error(err);
      return apiHandler.errorHandler(err, res);
    }
  }

  async createCms(req: Request, res: Response) {
    try {
      logger.info(
        `Cms Controller : createCms, request-body: ${JSON.stringify(
          req.body,
        )}, request-headers: ${JSON.stringify(req.headers)}`,
      );
      const { contentType, contentData } = req.body;
      let language = req.headers?.language as string;
      if (!language) {
        language = Constants.Language.EN;
      }
      const { id } = req.body.jwtDecodedUser;
      const data: ICreateCmsData = {
        language: language.toLowerCase(),
        contentType: contentType.toLowerCase(),
        contentData,
        createdBy: id,
        updatedBy: id,
      };
      const response = await cmsService.createCms(data);
      if (response === Constants.ErrorMessage.CONTENT_ALREADY_EXIST) {
        return apiHandler.errorHandler(
          {
            message: response,
            statusCode: Constants.Http.CONFLICT,
          },
          res,
        );
      }
      return apiHandler.responseHandler(
        {},
        Constants.CmsMessage.CONTENT_CREATED_SUCCESSFULLY,
        Constants.Http.CREATED,
        res,
      );
    } catch (err) {
      logger.error(err);
      return apiHandler.errorHandler(err, res);
    }
  }

  async updateCms(req: Request, res: Response) {
    try {
      logger.info(
        `Cms Controller : updateCms, request-body: ${JSON.stringify(
          req.body,
        )}, request-params: ${JSON.stringify(req.params)}`,
      );
      const contentType: string = req.params.slug as string;
      const contentData = req.body.contentData;
      const { id } = req.body.jwtDecodedUser;
      let language = req.headers?.language as string;
      if (!language) {
        language = Constants.Language.EN;
      }
      const data: IUpdateCmsData = {
        contentData,
        updatedBy: id,
      };
      const response = await cmsService.updateCms(
        contentType.toLowerCase(),
        language,
        data,
      );
      if (!response) {
        return apiHandler.errorHandler(
          {
            message: Constants.CmsMessage.CMS_DATA_NOT_FOUND,
            statusCode: Constants.Http.NOT_FOUND,
          },
          res,
        );
      }
      return apiHandler.responseHandler(
        {},
        Constants.CmsMessage.CONTENT_UPDATED_SUCCESSFULLY,
        Constants.Http.OK,
        res,
      );
    } catch (err) {
      logger.error(err);
      return apiHandler.errorHandler(err, res);
    }
  }

  async deleteContent(req: Request, res: Response) {
    try {
      logger.info(
        `Cms Controller : deleteContent, request-params: ${JSON.stringify(
          req.params,
        )}, request-headers : ${JSON.stringify(req.headers)}`,
      );
      const slug = req.params.slug.toLowerCase() as string;
      let language = req.headers?.language as string;
      if (!language) {
        language = Constants.Language.EN;
      }
      const response = await cmsService.deleteContent(
        slug,
        language.toLowerCase(),
      );
      if (!response) {
        return apiHandler.errorHandler(
          {
            message: Constants.CmsMessage.CMS_DATA_NOT_FOUND,
            statusCode: Constants.Http.NOT_FOUND,
          },
          res,
        );
      }
      return apiHandler.responseHandler(
        {},
        Constants.CmsMessage.CONTENT_DELETED_SUCCESSFULLY,
        Constants.Http.OK,
        res,
      );
    } catch (err) {
      logger.error(err);
      return apiHandler.errorHandler(err, res);
    }
  }
}

const cmsController: CmsController = new CmsController();
export default cmsController;
