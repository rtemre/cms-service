import express from 'express';

import cmsRoute from './cms.route';

const router = express.Router();

router.use('/cms', cmsRoute);

export default router;
