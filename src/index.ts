import logger from './config/logger';
import { DatabaseInitialization } from './db/dbConnection';
import { SSMService } from './services/ssm.service';

/* eslint-disable */

(async function () {
  const secret = await SSMService.getSecretManagerValue();
  await DatabaseInitialization.dbCreateConnection();
  require('./app').listen(secret.PORT, () => {
    logger.info(`listening on port : ${secret.PORT}`);
    logger.info(`swagger url : http://localhost:${secret.PORT}/api-docs`);
  });
})();
/* eslint-enable */
