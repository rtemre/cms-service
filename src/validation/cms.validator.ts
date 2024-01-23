import Joi from 'joi';

class CmsValidator {
  getCmsSchema = Joi.object({
    page: Joi.number().positive().optional(),
    limit: Joi.number().positive().optional(),
    language: Joi.string().max(5).optional(),
  });
  getContentTypesSchema = Joi.object({
    cmsType: Joi.string().optional(),
  });

  getCmsDataSchema = Joi.object({
    slug: Joi.string().required(),
  });

  createCmsDataSchema = Joi.object({
    contentData: Joi.string().required(),
    contentType: Joi.string().required(),
    jwtDecodedUser: Joi.object(),
  });

  languageValidationInHeaderSchema = Joi.object({
    language: Joi.string().max(5).optional(),
  }).unknown();

  updateCmsDataSchema = Joi.object({
    contentData: Joi.string().required(),
    jwtDecodedUser: Joi.object(),
  });
}

const cmsValidatorSchema: CmsValidator = new CmsValidator();
export default cmsValidatorSchema;
