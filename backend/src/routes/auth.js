const router = require('express').Router();
const { checkLogin } = require('../controllers/auth')

// 校验当前用户是否存在
router.route('/auth/checkLogin').post(() => { }, checkLogin);

module.exports = router;