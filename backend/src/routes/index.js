const router = require("express").Router();
const defaultController = require("../controllers/default");
const authRoute = require('./auth');

// 首页接口默认返回
router.get("/", defaultController);

// 其他接口配置 - 引入router，以/api开头；/v1作为版本号，便于之后升级扩展
router.use('/api/v1', authRoute);

module.exports = router;
