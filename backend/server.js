/**
 * 主入口文件：包含express服务、服务监控、控制台输出
 */
const app = require('./src/app');
const logger = require('./src/middleware/winston.logger');

app.listen(process.env.APP_PORT, () => {
  logger.info(`App server running on: ${process.env.APP_BASE_URL}`);
});