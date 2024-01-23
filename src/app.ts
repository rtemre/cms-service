import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import config from './config/config';
import { morganErrorHandler, morganSuccessHandler } from './config/morgan';
import { Constants } from './constants/constants';
import { SSMService } from './services/ssm.service';
import ApiError from './utils/ApiError';
import router from './routes';

const app = express();
app.use(express.json());

app.use(cors());
app.get('/', (req, res) => res.send('healthy'));
app.use(morganSuccessHandler);
app.use(morganErrorHandler);
app.use(helmet());
app.use(Constants.config.PrefixPath, router);
const secret = SSMService.secret;
const swaggerOptions = {
  definition: {
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
    openapi: '3.0.0',
    info: {
      title: config.appName,
      version: '1.0.0',
      description: 'Content management system',
    },
    servers: [
      {
        name: 'local',
        url: `http://localhost:${secret?.PORT}`,
        description: 'local server',
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.{js,ts}')],
};
// Initialize Swagger-jsdocls
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(
    new ApiError(Constants.Http.NOT_FOUND, Constants.ErrorMessage.NOT_FOUND),
  );
});

module.exports = app;
