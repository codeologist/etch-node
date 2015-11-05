

    function EtchNode() {

    }

    EtchNode.extend = function(){

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

        constructors.forEach( function( constructor ){
            Object.keys( constructor.prototype ).forEach( function( meth ){
                FauxNode.prototype[meth]= constructor.prototype[meth];
            });
        }, this);


        return FauxNode;
    };

    module.exports = EtchNode;