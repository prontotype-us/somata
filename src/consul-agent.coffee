request = require 'request'
util = require 'util'
{log} = require './helpers'

VERBOSE = false
DEFAULT_BASE_URL = 'http://localhost:8500/v1'

ConsulAgent = (@options={}) ->
    @setDefaults()
    return @

ConsulAgent::setDefaults = ->
    @options.base_url = DEFAULT_BASE_URL if !@options.base_url?

# Generalized request to the Consul HTTP API

ConsulAgent::apiRequest = (method, path, data, cb) ->
    if !cb?
        cb = data
        data = null

    request_options =
        url: @options.base_url + path
        method: method
        json: true
        body: data

    request request_options, (err, res, data) ->
        log.d '[apiRequest] Response status: ' + res.statusCode if VERBOSE
        cb(err, data) if cb?

# Core API requests

ConsulAgent::getNodes = (cb) ->
    @apiRequest 'GET', '/catalog/nodes', cb

ConsulAgent::getServices = (cb) ->
    @apiRequest 'GET', '/catalog/services', cb

ConsulAgent::getServiceNodes = (service_id, cb) ->
    @apiRequest 'GET', '/catalog/service/' + service_id, cb

ConsulAgent::registerService = (service, cb) ->
    @apiRequest 'PUT', '/agent/service/register', service, cb

ConsulAgent::deregisterService = (service_id, cb) ->
    @apiRequest 'DELETE', '/agent/service/deregister/' + service_id, cb

module.exports = ConsulAgent
