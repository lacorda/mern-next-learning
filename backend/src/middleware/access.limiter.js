const rateLimit = require("express-rate-limit");
const { currentDateTime, createLogStream } = require("../utils");
const { errorResponse } = require("../utils/response");

const limiter = rateLimit({
  // 当前窗口时长（以毫秒为单位）默认为60000毫秒（= 1 分钟）
  windowMs: 10 * 60 * 1000,

  // 在对客户端进行速率限制之前的window期间允许的最大连接数，默认为5
  limit: 1000,

  // 当客户端受到速率限制时发回的响应正文
  message: {
    errorMsg:
      "Too many login attempts from this IP, please try again after a 60 second pause",
  },

  // 是否在所有响应上发送限制 ( X-RateLimit-Limit )、当前使用情况 ( X-RateLimit-Remaining ) 和重置时间（如果商店提供） ( X-RateLimit-Reset ) 的旧速率限制标头。如果设置为 true ，中间件还会针对所有被阻止的请求发送Retry-After标头。默认为true 。

  legacyHeaders: false,

  // 启用X-Rate-Limit响应头
  standardHeaders: true,

  // 当客户端受到速率限制时：发回响应的快速请求处理程序 + 写入错误日志文件
  handler: (req, res, next, options) => {
    try {
      const logStream = createLogStream({
        dir: "/logs/access",
        filename: "app-limiter-%DATE%.log",
      });

      const logMessage = `[${currentDateTime()}]\tTITLE: TOO MANY REQUEST\tMETHOD: ${
        req.method
      }\tURL: ${req.url}\tCLIENT: ${req.headers["user-agent"]}\n`;

      logStream.write(logMessage, "utf8");
    } catch (err) {
      logger.error("API limiter error: ", err);
    }

    res
      .status(options.statusCode)
      .send(errorResponse(29, "TOO MANY REQUEST", options.message.message));
  },
});

module.exports = { limiter };
