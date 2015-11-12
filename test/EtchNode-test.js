
    "use strict";

    var assert = require('assert');
    var EtchNode = require("../src/EtchNode");


    describe('EtchNode Basic Functionality Tests', function(){

        it('should be extendable by providing an object constructor', function(done){

            function Extendable(){
                this.a = 1;
            }

            Extendable.prototype.meth1 = function(){
                return 1;
            };

            function Extendable2(){
                this.b = 2;
            }

            Extendable2.prototype.meth2 = function(){
                return 2;
            };

            var ExtendedNode = EtchNode.extend( Extendable, Extendable2 );

            assert( typeof ExtendedNode === "function");
            var extended = new ExtendedNode();

            assert.equal( extended.a, 1);
            assert.equal( extended.meth1(), 1);
            assert.equal( extended.b, 2);
            assert.equal( extended.meth2(), 2);

            done();
        });
        it('should override existing methods', function(done) {

            function AAA(){

            }

            AAA.prototype.createEventObject = function(){

                var obj = this.___createEventObject___();

                obj.extended = 99;

                return obj;
            };


            function BBB(){

            }

            BBB.prototype.createEventObject = function(){

                var obj = this.___createEventObject___();

                obj.extended = 99;

                return obj;
            };

            var ExtendedNode = EtchNode.extend( AAA, BBB );

            assert( ExtendedNode.prototype.createEventObject );
            assert( ExtendedNode.prototype.___createEventObject___ );

            var node = new ExtendedNode();

            assert.equal( node.createEventObject().extended, 99 );

            done();
        });



        it('should saftey check any method overrides for recursion', function(done) {

            function AAA(){

            }

            AAA.prototype.createEventObject = function(){

                var obj = this.___createEventObject___();

                obj.extended = 99;

                return obj;
            };


            function CCC(){

            }

            CCC.prototype.createEventObject = function(){
                var obj = this.___createEventObject___();
                obj.extended = 99;
                return obj;
            };

            try {
                EtchNode.extend( AAA, CCC );
            } catch ( e ){
                assert( e.message == "Recursion errror whilst overriding constructor methods" );
            } finally{
                done();
            }
        });



        it('should have basic event system', function(done){

            var node = new EtchNode();

            node.addEventListener( 1, "custom", function(){
                done();
            });

            node.triggerEvent("custom");

        });


        it('should only trigger the requested event', function(done){

            var node = new EtchNode();

            node.addEventListener( 1, "custom", function(){
                assert( false );
            });

            node.addEventListener( 1, "custom2", function(){
                done();
            });

            node.triggerEvent("custom2");

        });


        it('should only trigger an event the repeat number of times', function(done){

            var node = new EtchNode();

            var count = 0;
            node.addEventListener( 1, "custom", function(){
                count++;
            });

            node.triggerEvent("custom");
            node.triggerEvent("custom");

            setTimeout( function(){
                assert.equal( count, 1 );
                done();
            }, 0 );
        });


        it('should trigger default events last, no matter the order they were added', function (done) {

            var node = new EtchNode();
            var count = 0;

            node.addEventListener(1, "custom", function () {
                if (count === 1) {
                    assert(false, "count was 1, meaning this triggered last");
                }
                count++;
            });

            node.addEventListener(1, "custom", function () {
                count++;
            }, true);


            node.triggerEvent("custom");

            setTimeout(function () {
                assert.equal(count, 2);
                done();
            }, 0);
        });

        it('should prevent default event from triggering', function(done){

            var node = new EtchNode();
            var count = 0;

            node.addEventListener( 1, "custom", function( e ){
                count++;
                e.preventDefault();
            });

            node.addEventListener( 1, "custom", function(){
                assert(false);
            }, true );


            node.triggerEvent("custom", node.createEventObject() );

            setTimeout( function(){
                assert.equal( count, 1 );
                done();
            }, 0 );

        });


        it('should trigger the same event multiple times if it is added multiple times', function(done){

            var node = new EtchNode();

            var count = 0;
            node.addEventListener( 1, "custom", function(){
                count++;
            });
            node.addEventListener( 1, "custom", function(){
                count++;
            });
            node.addEventListener(1, "custom", function () {
                count++;
            }, true);

            node.triggerEvent("custom");

            setTimeout( function(){
                assert.equal(count, 3);
                done();
            }, 0 );
        });

        it('should remove a specific event', function (done) {

            var node = new EtchNode();
            var func = function(){
                assert(false);
            };

            node.addEventListener( 1, "custom", func);
            node.addEventListener( 1, "custom", function(){
                done();
            });

            node.removeEventListener( "custom", func );
            node.triggerEvent("custom");

        });

        it('should remove a group of events', function(done){

            var node = new EtchNode();

            node.addEventListener( 1, "custom",  function(){
                assert(false);
            });

            node.addEventListener( 1, "custom", function(){
                assert(false);
            });

            node.removeEventListener( "custom" );
            node.triggerEvent("custom");

            setTimeout( function(){
                done();
            }, 0 );
        });

        it('should remove all events that are not default events', function (done) {

            var node = new EtchNode();

            node.addEventListener( 1, "custom",  function(){
                assert(false);
            });

            node.addEventListener( 1, "custom",  function(){
                assert(false);
            });

            node.addEventListener( 1, "custom2", function(){
                assert(false);
            });

            node.removeEventListener();
            node.triggerEvent("custom");
            node.triggerEvent("custom2");

            setTimeout( function(){
                done();
            }, 0 );
        });

        it("should not remove default events", function (done) {

            var node = new EtchNode();

            node.addEventListener( 1, "default",  function(){
                done();
            }, true);

            node.removeEventListener();
            node.triggerEvent("default");

        });

        it("should remove a specific default event", function (done) {

            var node = new EtchNode();


            node.addEventListener(1, "default", function () {
                assert(false);
            }, true);

            node.removeDefaultEventListener("default");
            node.triggerEvent("default");
            setTimeout(function () {
                done();
            }, 0);
        });

        it("should remove all default events", function (done) {

            var node = new EtchNode();


            node.addEventListener(1, "default", function () {
                assert(false);
            }, true);

            node.addEventListener(1, "onclick", function () {
                assert(false);
            }, true);

            node.removeDefaultEventListener();
            node.triggerEvent("default");
            node.triggerEvent("onclick");

            setTimeout(function () {
                done();
            }, 0);
        });
    });



