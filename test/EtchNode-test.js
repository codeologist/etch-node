
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

        it('should trigger the same event multiple times if it is added multiple times', function(done){

            var node = new EtchNode();

            var count = 0;
            node.addEventListener( 1, "custom", function(){
                count++;
            });
            node.addEventListener( 1, "custom", function(){
                count++;
            });

            node.triggerEvent("custom");

            setTimeout( function(){
                assert.equal( count, 2 );
                done();
            }, 0 );
        });

        it('should remove an individual event', function(done){

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

        it('should remove all events', function(done){

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

        it("shouldn't remove default events", function(done){

            var node = new EtchNode();

            node.addEventListener( 1, "default",  function(){
                done();
            }, true);

            node.removeEventListener();
            node.triggerEvent("default");

        });
    });



