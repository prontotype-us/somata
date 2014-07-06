// Generated by CoffeeScript 1.7.1
(function() {
  var Connection, HEARTBEAT_INTERVAL, RegistryConnection, VERBOSE, log, os, util, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  util = require('util');

  os = require('os');

  log = require('./helpers').log;

  Connection = require('./connection');

  VERBOSE = false;

  HEARTBEAT_INTERVAL = 1000;

  module.exports = RegistryConnection = (function(_super) {
    __extends(RegistryConnection, _super);

    function RegistryConnection() {
      return RegistryConnection.__super__.constructor.apply(this, arguments);
    }

    RegistryConnection.prototype.heartbeat_interval = HEARTBEAT_INTERVAL;

    RegistryConnection.prototype.register = function(service) {
      this.sendRegister(service);
      return this.startHeartbeats();
    };

    RegistryConnection.prototype.handleMessage = function(message) {
      if (VERBOSE) {
        return log(">: " + (util.inspect(message)));
      }
    };

    RegistryConnection.prototype.sendRegister = function(service) {
      return this.send({
        type: 'register',
        args: _.extend(service, {
          id: this.id
        })
      });
    };

    RegistryConnection.prototype.sendUnregister = function() {
      return this.send({
        type: 'unregister'
      });
    };

    RegistryConnection.prototype.sendHeartbeat = function() {
      return this.send({
        type: 'heartbeat',
        args: {
          id: this.id,
          name: this.name,
          health: 'ok',
          memory: process.memoryUsage(),
          loads: os.loadavg(),
          uptime: process.uptime()
        }
      });
    };

    RegistryConnection.prototype.startHeartbeats = function() {
      clearInterval(this.heartbeat_interval);
      return this.heartbeat_interval = setInterval(this.sendHeartbeat.bind(this), this.heartbeat_interval);
    };

    return RegistryConnection;

  })(Connection);

  RegistryConnection.prototype.connect = function() {
    RegistryConnection.__super__.connect.apply(this, arguments);
    return process.on('SIGINT', (function(_this) {
      return function() {
        _this.sendUnregister();
        return process.exit();
      };
    })(this));
  };

}).call(this);