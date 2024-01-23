/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import dotenv from "dotenv";
dotenv.config();
import config from "../config/config";
import { SSMRequiredKeys } from "../interfaces/ssm.interface";

const client = new SecretsManagerClient({
  region: process.env?.AWS_REGION,
});

export class SSMService {
  public static secret: any;

  static async getSecretManagerValue() {
    let response;

    if (!this.secret) {
      try {
        response = await client
          .send(
            new GetSecretValueCommand({
              SecretId: `${config.appEnv}/${config.appName}`,
              VersionStage: "AWSCURRENT",
            })
          )
          .catch((error) => {
            const json = JSON.stringify(error);
            if (JSON.parse(json).name != config.accessDeniedException) {
              //   throw error;
            }
          });
        const secret = response
          ? JSON.parse(response.SecretString as string)
          : {};

        const requiredSecretKey: SSMRequiredKeys = {
          PORT: null,
          DB_HOST: null,
          DB_PORT: null,
          DB_DIALECT: null,
          DB_USER: null,
          DB_PASSWORD: null,
          DB_NAME: null,
          JWT_SECRET: null,
        };
        this.secret = secret;

        for (const key in requiredSecretKey) {
          this.secret[key] = process.env[key] ? process.env[key] : secret[key];
        }
        return this.secret;
      } catch (error) {
        throw error;
      }
    }

    return this.secret;
  }
}
