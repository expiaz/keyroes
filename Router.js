var express = require('express');
var api = require('./api/Api');
var middleware = require('./Middleware');

var router = express.Router();

router.post('/auth', api.authencitation);
router.get('/',api.index);

module.exports = router;