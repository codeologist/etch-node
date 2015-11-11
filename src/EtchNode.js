
    "use strict";

    function EtchNode( observerCallback ) {
        this.eventListeners = [];
        Object.observe( this, this.triggerEvent.bind( this, "change", null ) );
    }

    function EtchEventObject(){
        this.isDefaultPrevented = false;
    }

    EtchEventObject.prototype.preventDefault = function(){
        this.isDefaultPrevented = true;
    };

    EtchNode.prototype = {
        createEventObject: function(){
            return new EtchEventObject();
        },
        addEventListener:function( repeat, type, callback, defaultSwitch ){
            this.eventListeners.push({
                type:type,
                repeat:repeat,
                callback:callback,
                default: defaultSwitch
            });
        },
        removeDefaultEventListener:function( type ){
            this.eventListeners.forEach( function( event, i ){

                if ( event.type === type && event.default ){
                    delete this.eventListeners[i];
                }

                if ( type === undefined && event.default ){
                    delete this.eventListeners[i];
                }
            }, this );
        },
        removeEventListener:function( type, callback ){
            this.eventListeners.forEach( function( event, i ){

                if ( typeof callback === "function" && event.callback === callback && event.type === type ){
                    delete this.eventListeners[i];
                }

                if ( callback === undefined && event.type === type && !event.default ){
                    delete this.eventListeners[i];
                }

                if ( type === undefined && !event.default ){
                    delete this.eventListeners[i];
                }
            }, this );
        },
        triggerEvent:function( type, eventObject ){

            var userEventSchedule = [];
            var defaultEventSchedule = [];

            if ( !eventObject ){
                eventObject = new EtchEventObject();
            }

            this.eventListeners.forEach( function( event ){
                if ( event.repeat && event.type === type ) {
                    if (event.default) {
                        defaultEventSchedule.push(event);
                    } else {
                        userEventSchedule.push(event);
                    }
                }
            });

            userEventSchedule.forEach( function( event ){
                process.nextTick( event.callback.bind( this, eventObject ) );
                event.repeat--;

            }, this );


            defaultEventSchedule.forEach( function( event ){
                process.nextTick( function( eventObject, callback ) {

                    if ( eventObject.isDefaultPrevented === false ){
                        callback.call( this, eventObject );
                    }

                }.bind( this, eventObject, event.callback ));
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