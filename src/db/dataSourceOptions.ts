import path from 'path';
import { DataSourceOptions } from 'typeorm';

import { SSMService } from '../services/ssm.service';

async function getConfig() {
  let secret = SSMService.secret;

  if (!secret) {
    secret = await SSMService.getSecretManagerValue();
  }

  return {
    type: secret?.DB_DIALECT,
    host: secret?.DB_HOST,
    port: secret?.DB_PORT,
    username: secret?.DB_USER,
    password: secret?.DB_PASSWORD,
    database: secret?.DB_NAME,
    entities: [path.join(__dirname, '/entity/**/*.{ts,js}')],
    migrations: [path.join(__dirname, '/migration/**/*.{ts,js}')],
    synchronize: false,
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    }, // Add ssl to fix error: connection is insecure (try using `sslmode=require`)
  } as DataSourceOptions;
}

export = getConfig;
