var BaseApp = require('../lib/base_app')
var test = require('./testutils.js')
var spy = require('sinon').spy
var Model = require('backbone').Model
var stub = require('sinon').stub
var EventEmitter = require('events').EventEmitter
var expect = test.expect

describe('BaseApp', function(){
    var socket, app, runner1, runner2, server

    beforeEach(function(){
        socket = new EventEmitter
        server = {
            emit: test.spy()
            , cleanUpConnections: test.spy()
            , removeBrowser: test.spy()
        }

        app = new BaseApp(new Model({ port: 3000 }))
        app.server = server

        runner1 = new Model({ results: new Model({ all: false }) })
        runner2 = new Model({ results: new Model({ all: false }) })

        app.runners.add([runner1, runner2])
    })

    it('runs the postprocessors once all runners have reported all test results', function(){
        app.runPostprocessors = test.spy()

        runner1.get('results').set('all', true)
        app.emit('all-test-results')
        expect(app.runPostprocessors.called).not.to.be.ok

        runner2.get('results').set('all', true)
        app.emit('all-test-results')
        expect(app.runPostprocessors.called).to.be.ok
    })

    it('runs the postprocessors at exit', function(){
        app.runExitHook = test.spy()

        app.emit('exit')
        expect(app.runExitHook.called).to.be.ok
    })
})