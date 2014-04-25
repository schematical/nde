var async = require('async');
var _ = require('underscore');

var njax = require('njax');
var njaxBootstrap = require('njax-bootstrap');
var models = require('./lib/model');
var config = require('./config');

var app = njax(config);
models(app);
njaxBootstrap(app);
app.locals.partials._navbar = '_navbar';
app.locals.partials._meta = '_meta';

app.locals.partials._meta_footer = '_meta_footer';
app.locals.partials._modal = '_modal';

var routes = require(__dirname + '/lib/routes');
routes(app);

app.start(function(err, _app, server){
    var socketio = require('socket.io');
    socketio
});