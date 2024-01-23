export default {
  appEnv: process.env.APP_ENV || 'development',
  appName: process.env.APP_NAME || 'cms',
  accessDeniedException: process.env.AWS_ACCESS_DENIED_EXCEPTION,
};
