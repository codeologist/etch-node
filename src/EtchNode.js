
    "use strict";

    function EtchNode( observerCallback ) {
        this.eventListeners = [];
        Object.observe( this, this.triggerEvent.bind( this, "change", null ) );
    }

    function EventObject() {

    }

    EventObject.prototype.preventDefault = function () {
    }
    EtchNode.prototype = {
        createEventObject: function(){
            return {
                preventDefault: function () {

                }
            };
        },
        addEventListener: function (repeat, type, callback, defaultSwitch) {
            this.eventListeners.push({
                type:type,
                repeat:repeat,
                callback: callback,
                default: defaultSwitch
            });
        },
        removeDefaultEventListener: function (type) {
            this.eventListeners.forEach(function (event, i) {

                if (event.type === type && event.default) {
                    delete this.eventListeners[i];
                }

                if (type === undefined && event.default) {
                    delete this.eventListeners[i];
                }
            }, this);
        },
        removeEventListener:function( type, callback ){
            this.eventListeners.forEach( function( event, i ){

                if ( typeof callback === "function" && event.callback === callback && event.type === type ){
                    delete this.eventListeners[i];
                }

                if (callback === undefined && event.type === type && !event.default) {
                    delete this.eventListeners[i];
                }

                if (type === undefined && !event.default) {
                    delete this.eventListeners[i];
                }
            }, this );
        },
        triggerEvent:function( type, eventObject ){

            var evschedule = [];

            this.eventListeners.forEach( function( event ){
                if ( event.repeat && event.type === type ){
                    evschedule.push(event);
                }
            });

            evschedule.sort(function (a, b) {
                return a.default ? 1 : -1;
            });

            evschedule.forEach(function (event) {
                    process.nextTick( event.callback.bind( this, eventObject ) );
                    event.repeat--;

            }, this );
        }
    };

    Object.defineProperty(EtchNode, "extend", {

        value:function(){

            var constructors = Array.prototype.slice.call( arguments, 0 );

            function ext(){
                var args = arguments;
                constructors.forEach( function( constructor ){
                    constructor.apply( this, args );
                }, this);
            }

            function FauxNode(){
                EtchNode.apply( this, arguments );
                ext.apply( this, arguments );
            }

            FauxNode.prototype = EtchNode.prototype;

            constructors.forEach( function( constructor ){
                Object.keys( constructor.prototype ).forEach( function( meth ){
                    FauxNode.prototype[meth]= constructor.prototype[meth];
                });
            }, this);

            return FauxNode;
        }
    });


    module.exports = EtchNode;