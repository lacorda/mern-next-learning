/**
 * express服务
 */

const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const crossOrigin = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const appRoot = require("app-root-path");

const { limiter } = require("./middleware/access.limiter");
const morganLogger = require("./middleware/morgan.logger");

const corsOptions = require("./config/cors");

const routes = require("./routes");
const { notFoundRoute, errorHandler } = require("./controllers/error");

// 1. 启动服务之前，必须先设置环境变量
dotenv.config();

const app = express();

// 2. 接口管理

// 2-1. 限制请求频率，防止恶意攻击
app.use(limiter);

// 2-2. 开始请求 - 记录请求日志并写入文件 (生产不使用这个日志文件，防止过多影响性能，需要额外使用其他平台的日志，比如 Elastic)
if (process.env.APP_NODE_ENV !== "production") {
  app.use(morganLogger());
}

// 2-3. 跨域问题
// 控制其他域名是否可以访问当前域名下的静态资源（例如图片、脚本、样式等）
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// 解决跨域问题，哪些域名可以访问当前域名下的 API 接口
app.use(crossOrigin(corsOptions));

// 2-4. cookie解析
app.use(cookieParser());

// 2-5. 请求主体解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2-6. json格式解析、application/x-www-form-urlencoded 格式的请求体（通常用于表单提交）
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2-7. 静态资源缓存处理
if (process.env.APP_NODE_ENV !== "production") {
  app.use(favicon(`${appRoot}/public/favicon.ico`));
}
app.use(express.static("public"));

// 3. 路由配置
app.use("/", routes);

// 4. 404 ~ not found error handler
app.use(notFoundRoute);

// 5. 500 ~ internal server error handler
app.use(errorHandler);

module.exports = app;
