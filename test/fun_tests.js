
var test = require('tap').test
  , fanboy_http = require('../')
  ;

test('constructor', function (t) {
  var f = fanboy_http
  t.plan(2)
  t.ok(f() instanceof fanboy_http.FanboyService)
  t.is(f().port, 8383)
  t.end()
})

test('defaults', function (t) {
  var f = fanboy_http.defaults
    , nop = fanboy_http.nop
    , log = function () {}
    ;

  var wanted = [
    { location: '/tmp/fanboy-http'
    , port: 8383
    , log: { info:nop, warn:nop, debug:nop, error:nop }
    , ttl: 86400
    , cacheSize: 8388608
    }
  , { location: '/tmp/fanboy-http'
    , port: 80
    , log: { info:nop, warn:nop, debug:nop, error:nop }
    , ttl: 86400
    , cacheSize: 8388608
    }
  , { location: '/tmp/fanboy-http'
    , port: 80
    , log: log
    , ttl: 86400
    , cacheSize: 8388608
    }
  ]
  ;[
    f(null)
  , f({ port:80 })
  , f({ port:80, log:log })
  ].forEach(function (found, i) {
    t.deepEqual(found, wanted[i])
  })
  t.end()
})

test('parse', function (t) {
  var f = fanboy_http.parse
  t.is(typeof(f), 'function')
  var wanted = [
    undefined
  , undefined
  , undefined
  , undefined
  , 'abc'
  , 'abc def'
  , 'überlänge'
  , 'abc'
  , 'abc'
  , 'abc'
  , 'abc'
  ]
  ;[
    f(null)
  , f(undefined)
  , f('')
  , f('abc')
  , f('?q=abc')
  , f('?q=abc+def')
  , f('?q=überlänge')
  , f('?q= abc')
  , f('?q=abc ')
  , f('?q= abc ')
  , f('?q=abc+abc')
  ].forEach(function (found, i) {
    t.deepEqual(found, wanted[i])
  })
  t.end()
})

test('route', function (t) {
  var f = new fanboy_http()
  t.is(f.route({url: '/'}).route, '/*')
  t.end()
})
