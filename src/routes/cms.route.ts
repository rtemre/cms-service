import express from 'express';

import cmsController from '../controllers/cms.controller';
import { ensureAdminValidator } from '../middleware/ensureAdminValidator';
import { jwtValidator } from '../middleware/jwtValidator';
import { requestValidator } from '../middleware/requestValidator';
import cmsValidatorSchema from '../validation/cms.validator';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cms
 *     description: API endpoints for cms
 */

/**
 * @swagger
 * /cms:
 *   get:
 *     summary: Get all contents
 *     description: This api is for user as well as admin using which we get all the contents present in our cms.
 *     tags: [Cms]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: language
 *         value: en
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contents fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       contentData:
 *                         type: string
 *                         example: <div> Data <div>
 *                       contentType:
 *                         type: string
 *                         example: aboutus
 *                       language:
 *                         type: string
 *                         example: en
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  requestValidator(cmsValidatorSchema.getCmsSchema, 'query'),
  cmsController.getCms,
);

/**
 * @swagger
 * /cms/content-types:
 *   get:
 *     summary: Get all contentType present in our cms
 *     description: This api is for user as well as admin using which we get all the content types present in our cms.
 *     tags: [Cms]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Content types fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       contentType:
 *                         type: string
 *                         example: aboutus
 *                       language:
 *                         type: string
 *                         example: en
 *                 status:
 *                   type: integer
 *                   example: 200
 *       500:
 *         description: Internal server error
 */
router.get('/content-types', cmsController.getContentTypes);

/**
 * @swagger
 * /cms/{slug}:
 *   get:
 *     summary: Get single content data
 *     description: This api is for user as well as admin to get single content data based on given slug (content type)
 *     tags: [Cms]
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Content type
 *         required: true
 *         schema:
 *           type: string
 *           description: Content type
 *           example: aboutus
 *       - name: language
 *         in: header
 *         description: language code
 *         schema:
 *           type: string
 *           example: en
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cms data fetched successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                       contentData:
 *                         type: string
 *                         example: <h1>We're Trustpilot</h1><p>Trustpilot was founded in 2007 with a vision to create an independent currency of trust. We're a digital platform that brings businesses and consumers together to foster trust and inspire collaboration. We're free to use, open to everybody, and built on transparency.</p><p>Trustpilot hosts reviews to help consumers shop with confidence, and deliver rich insights to help businesses improve the experiences they offer. The more consumers use our platform and share their own opinions, the richer the insights we offer businesses, and the more opportunities they have to earn the trust of consumers from all around the world.</p>
 *                       contentType:
 *                         type: string
 *                         example: aboutus
 *                       language:
 *                         type: string
 *                         example: en
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

router.get(
  '/:slug',
  requestValidator(
    cmsValidatorSchema.languageValidationInHeaderSchema,
    'headers',
  ),
  cmsController.getContentData,
);

/**
 * @swagger
 * /cms:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Insert single contentType data
 *     description: This api is used by admin only to insert data for a content type.
 *     tags: [Cms]
 *     parameters:
 *       - name: language
 *         in: header
 *         description: language of that content
 *         schema:
 *           type: string
 *           example: en
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentType:
 *                 type: string
 *                 description: Type of content
 *                 example: aboutus
 *               contentData:
 *                 type: string
 *                 description: Data for content type
 *                 example: <div> create data </div>
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Content created successfully
 *                 data:
 *                   type: object
 *                   example: {}
 *                 status:
 *                   type: integer
 *                   example: 201
 *       400:
 *         description: Bad Request ( joi validation error )
 *       401:
 *         description: Unauthorized User
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 */

router.post(
  '/',
  jwtValidator,
  ensureAdminValidator,
  requestValidator(cmsValidatorSchema.createCmsDataSchema, 'body'),
  requestValidator(
    cmsValidatorSchema.languageValidationInHeaderSchema,
    'headers',
  ),
  cmsController.createCms,
);

/**
 * @swagger
 * /cms/{slug}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update single contentType data
 *     description: This api is used by admin only to update data for given slug(contentType).
 *     tags: [Cms]
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Content type
 *         required: true
 *         schema:
 *           type: string
 *           description: Content type
 *           example: aboutus
 *       - name: language
 *         in: header
 *         description: language code
 *         schema:
 *           type: string
 *           example: en
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentData:
 *                 required: true
 *                 type: string
 *                 description: Data for content type
 *                 example: <div> Updated <div>
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Content updated succesfully
 *                 data:
 *                   type: object
 *                   example: {}
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad Request ( joi validation error )
 *       401:
 *         description: Unauthorized User
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal server error
 */

router.put(
  '/:slug',
  jwtValidator,
  ensureAdminValidator,
  requestValidator(cmsValidatorSchema.updateCmsDataSchema, 'body'),
  requestValidator(
    cmsValidatorSchema.languageValidationInHeaderSchema,
    'headers',
  ),
  cmsController.updateCms,
);

/**
 * @swagger
 * /cms/{slug}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete content
 *     description: This api is used by admin to delete a content by slug(contentType)
 *     tags: [Cms]
 *     parameters:
 *       - name: slug
 *         in: path
 *         description: Content type
 *         required: true
 *         schema:
 *           type: string
 *           description: Content type
 *           example: aboutus
 *       - name: language
 *         in: header
 *         description: language code
 *         schema:
 *           type: string
 *           example: en
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Content deleted successfully
 *                 data:
 *                   type: object
 *                   example: {}
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */

router.delete(
  '/:slug',
  jwtValidator,
  ensureAdminValidator,
  requestValidator(
    cmsValidatorSchema.languageValidationInHeaderSchema,
    'headers',
  ),
  cmsController.deleteContent,
);

export default router;
