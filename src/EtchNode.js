
    "use strict";

    function EtchNode( observerCallback ) {
        this.eventListeners = [];
        Object.observe( this, this.triggerEvent.bind( this, "change", null ) );
    }

    EtchNode.prototype = {
        createEventObject: function(){
            return {};
        },
        addEventListener:function( repeat, type, callback ){
            this.eventListeners.push({
                type:type,
                repeat:repeat,
                callback:callback
            });
        },
        removeEventListener:function( type, callback ){
            this.eventListeners.forEach( function( event, i ){
                if ( typeof callback === "function" && event.callback === callback && event.type === type ){
                    delete this.eventListeners[i];
                }

                if ( callback === undefined && event.type === type ){
                    delete this.eventListeners[i];
                }

                if ( type === undefined ){
                    delete this.eventListeners[i];
                }
            }, this );
        },
        triggerEvent:function( type, eventObject ){
            this.eventListeners.forEach( function( event ){
                if ( event.repeat && event.type === type ){
                    process.nextTick( event.callback.bind( this, eventObject ) );
                    event.repeat--;
                }
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