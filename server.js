var express = require('express');
var libpath = require('path');

var app = express();

// Because you're the type of developer who cares about this sort of thing!
app.enable('strict routing');

// Create the router using the same routing options as the app.
var router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict       : app.get('strict routing')
});

app.use(router);

var STATIC_REGISTRY = libpath.join(__dirname, 'static-registry');
var SYNTHETIC_REGISTRY = libpath.join(__dirname, 'synthetic-registry');

router.use(function (req, res, next) {
    console.log('NPM Path: ', req.url);
    next();
});

router.use(function (req, res, next) {
    if (req.url !== '/' && req.url.split('/').length === 2) {
        req.url += '/';
        req.originalUrl += '/';
    }
    if (req.url.charAt(req.url.length - 1) === '/') {
        req.url += 'index.json';
        req.originalUrl += 'index.json';
    }
    console.log('Normalized Path: ', req.url);
    next();
});

router.use(function (req, res, next) {
    if (/^.+\.(?:tgz)$/.test(req.url)) {
        res.header('maxAge', '30d');
    }
    if (req.url === '/index.json') {
        res.header('maxAge', 0);
    }
    next();
});

router.use(express.static(SYNTHETIC_REGISTRY));
router.use(express.static(STATIC_REGISTRY));

router.get('/', function (req, res, next) {
    console.log('ops, something went really wrong!');
    res.send({
        "error": "not_found",
        "reason": "document not found"
    }, 'json');
});

app.listen(80, function () {
    console.log('NPM registry running on: http://my.registry.com/');
    console.log('\nStatic Registry Folder: ' + STATIC_REGISTRY);
    console.log('\nSynthetic Registry Folder: ' + SYNTHETIC_REGISTRY);
    console.log('\nHow to use it: ');
    console.log('$ npm i express --registry http://my.registry.com/ --verbose');
    console.log('\nLogs:');
});
