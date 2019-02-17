module.exports = function( min, max ) {
    min = parseInt( min, 10 );
    max = parseInt( max, 10 );
    if ( min > max ){
        var tmp = min;
        min = max;
        max = tmp;
    }
    return Math.floor( Math.random() * ( max - min + 1 ) + min );
}
