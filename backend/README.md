# 后端项目

> MongoDB + Express + Node.js

## node.js框架 —— express

```bash
pnpm add express
```

作用

1. 管理路由接口
2. 处理中间件
3. 处理HTTP请求和响应

## 接口管理

### 1. 项目结构设计

backend/
├── src/
│   ├── app.js              # 主应用
│   ├── routes/             # 路由模块
│   │   ├── user.js         # 用户相关接口
│   │   ├── product.js      # 商品相关接口
│   │   └── index.js        # 路由入口
│   ├── configs/            # 配置文件, 处理接口通用配置
│   ├── controllers/        # 控制器, 处理请求，并调用服务层完成具体的业务逻辑
│   ├── middlewares/        # 中间件, 处理通用逻辑，比如身份验证、错误处理等
│   ├── models/             # 数据模型, 定义与数据库的表结构对应的对象，使用 Mongoose
│   ├── services/           # 服务模块, 封装了核心业务逻辑，可以被多个控制器调用
│   ├── utils/              # 通用的工具函数或辅助功能
├── public/                 # 静态文件
├── package.json
└── README.md
└── server.js               # 主入口文件

### 2. 路由管理

示例：

```js title=路由文件 (routes/user.js)
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/profile', userController.getProfile);
router.post('/login', userController.login);

module.exports = router;
```

```js title=主路由入口 (routes/index.js)
const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const productRoutes = require('./product');

router.use('/users', userRoutes);
router.use('/products', productRoutes);

module.exports = router;
```

```js title=应用主入口 (app.js)
const express = require('express');
const app = express();

const routes = require('./routes');

app.use(express.json()); // 解析 JSON 请求体
app.use('/api', routes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

### 3. 中间件管理

#### 日志记录

morgan —— 记录每个请求的详细信息，便于调试和监控应用的运行情况

file-stream-rotator —— 用于日志文件轮转（log rotation）的 Node.js 库。它帮助开发者管理日志文件，当日志文件大小达到指定限制时，自动生成新的日志文件并对旧的日志文件进行归档或删除。

#### 参数校验，转义用户输入防止xss

validator —— 用于验证和清理字符串。它提供了许多实用的方法来检查输入的有效性，比如验证电子邮件、URL、数字、日期等，还能对字符串进行清理处理，比如去除多余空格或转义 HTML

#### 安全与性能

##### 防止CSRF攻击

1. 接口跨域权限控制
cors —— 解决跨域问题，哪些域名可以访问当前域名下的 API 接口

2. 静态资源跨域权限控制
helmet —— 控制其他域名是否可以访问当前域名下的静态资源（例如图片、脚本、样式等）

##### 防止SQL攻击

```js title=限制查询条件
const sanitizeQuery = (query) => {
  const forbiddenKeys = ['$where', '$regex', '$expr'];
  for (const key in query) {
    if (forbiddenKeys.includes(key)) {
      delete query[key];
    }
  }
  return query;
};

const safeQuery = sanitizeQuery(req.query);
const users = await User.find(safeQuery);
```

##### 身份验证和授权

```bash
pnpm add jsonwebtoken
```

注册登陆时生成Token

```js
const jwt = require('jsonwebtoken');

const payload = { id: 123, username: 'john_doe' };
const secretKey = 'your_secret_key';
const options = { expiresIn: '1h' }; // Token 1 小时后过期

const token = jwt.sign(payload, secretKey, options);

console.log('Generated Token:', token);
```

保护路由验证Token

```js
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // 示例 Token

try {
  const decoded = jwt.verify(token, secretKey);
  console.log('Decoded Payload:', decoded);
} catch (error) {
  console.error('Token verification failed:', error.message);
}
```

##### 限流，防止恶意攻击

[express-rate-limit](https://express-rate-limit.mintlify.app/reference/configuration) —— 限制请求频率，防止恶意攻击

#### 缓存

1. 静态资源

- serve-favicon —— /favicon.ico缓存路径
- express.static() —— express的static方法，处理静态文件缓存

2. 接口缓存

- apicache —— 轻量级的缓存中间件，支持缓存时间设置和基于请求的缓存
- express-cache-control —— HTTP请求头缓存

#### 文件上传

multer —— 用于处理 multipart/form-data 类型的中间件，主要用于在 Node.js 中处理文件上传。multipart/form-data 是一种常见的 HTML 表单编码类型，通常用于上传文件。

#### cookie解析

cookie-parser —— 自动解析Cookie并附加到 req.cookies 上，方便后续的访问

#### 请求主体解析

body-parser —— 解析 HTTP 请求的主体（Body），将请求体中的数据解析成 JavaScript 对象，方便在路由处理函数中访问。

#### 数据加密

1. crypto —— 支持常见的加密算法，如哈希、加密解密、签名等。crypto 适用于处理低级别的加密和解密任务。用于token加密等；crypto 是 Node.js 内置模块，无需安装
2. bcrypt —— 专门用于加密密码的库

#### 压缩响应

compression —— 压缩响应返回，减少响应时间

#### 数据分页与过滤

```js
const { page = 1, limit = 10 } = req.query;
const results = await db.find().skip((page - 1) * limit).limit(limit);
res.json(results);
```

#### 错误处理

Express 提供内置的错误处理中间件

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

## 数据库的CRUD操作

1. mongoose —— mongodb ODM建模工具，用于数据库操作
2. mongodb —— mongodb驱动程序，也可用于数据库操作

## 其他库

1. winston —— 日志工具，支持控制台、文件、网络等多种输出
2. app-root-path —— 获取项目根目录
3. [dotenv](https://github.com/motdotla/dotenv?tab=readme-ov-file#-documentation) —— 环境变量工具
4. @sendgrid/mail —— 集成电子邮件发送功能

## 开发环境依赖

1. babel

```bash
pnpm add -D @babel/core @babel/preset-env
```

```js title=babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ]
};

```

2. eslint

```bash
pnpm add -D eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-node
```

```json title=.eslintrc.json
{
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": ["airbnb-base", "eslint:recommended", "plugin:node/recommended"],
  "overrides": [],
  "parserOptions": {
    // Only ESLint 6.2.0 and later support ES2020.
    "ecmaVersion": 2020
  },
  "rules": {
    "node/prefer-global/url-search-params": ["error", "always"],
    "node/file-extension-in-import": ["error", "always"],
    "node/no-unsupported-features/node-builtins": "off",
    "node/prefer-global/console": ["error", "always"],
    "node/prefer-global/process": ["error", "always"],
    "node/prefer-global/buffer": ["error", "always"],
    "node/no-unsupported-features/es-syntax": "off",
    "node/prefer-global/url": ["error", "always"],
    "max-len": ["error", { "code": 400 }],
    "no-unsafe-optional-chaining": "off",
    "node/prefer-promises/dns": "error",
    "comma-dangle": ["error", "never"],
    "node/prefer-promises/fs": "off",
    "no-underscore-dangle": "off",
    "no-restricted-syntax": "off",
    "node/exports-style": "off",
    "consistent-return": "off",
    "linebreak-style": "off",
    "func-names": "off",
    "camelcase": "off"
  }
}
```

3. jest

```bash
pnpm add -D jest babel-jest
```
