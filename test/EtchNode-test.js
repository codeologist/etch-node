
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

            var ExtendedNode = EtchNode.extend( Extendable,Extendable2 );

            assert( typeof ExtendedNode === "function");
            var extended = new ExtendedNode();

            assert.equal( extended.a, 1);
            assert.equal( extended.meth1(), 1);
            assert.equal( extended.b, 2);
            assert.equal( extended.meth2(), 2);

            done();
        });
    });



