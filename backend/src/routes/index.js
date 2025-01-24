const router = require("express").Router();
const defaultController = require("../controllers/default");

// 首页接口默认返回
router.get("/", defaultController);

// 其他接口配置 - 引入router

module.exports = router;
