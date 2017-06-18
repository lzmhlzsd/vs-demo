var express = require( 'express' );
var path = require( 'path' );
var app = express();
var server = require( 'http' ).Server( app );
// var io = require('socket.io')(server);
var request = require( 'request' );
var _ = require( 'underscore' );
var rf = require( "fs" );
var io = require( 'socket.io' )( server );
var rooms = {
    1: 'a',
    2: 'b'
}

app.use( express.static( path.join( __dirname, 'web' ) ) );
server.listen( 5000, function () {
    console.log( 'server staring..., port: 5000' );
} );

app.get( '/test', function ( req, res ) {
    res.sendFile( __dirname + '/web/test.html' );
} );
app.get( '/room', function ( req, res ) {
    if ( req.query.v == 1 ) {
        res.sendFile( __dirname + '/web/demo1.html' );
    }
    else {
        res.sendFile( __dirname + '/web/demo2.html' );
    }
} );
app.get( '/roomsrc', function ( req, res ) {
    if ( req.query.v == 1 ) {
        res.sendFile( __dirname + '/web/demo_src.html' );
    }
    else {
        res.sendFile( __dirname + '/web/demo2_src.html' );
    }
} );

io.on( 'connection', function ( socket ) {
    var roomid = getParam( socket.request.headers.referer.split( '?' )[1], "v" )
    if ( typeof rooms[roomid] != 'undefined' ) {
        socket.join( roomid );    // 加入房间
    }
    //socket.emit('news', { port: port });
    // socket.on('my other event', function(data) {
    //     console.log(data);
    // });
    socket.on( 'disconnect', function () {
        io.emit( 'user disconnected' );
    } );//
} );

app.post( '/getMacStatus', function ( req, res ) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if ( month < 10 ) {
        month = '0' + month;
    }
    if ( day < 10 ) {
        day = '0' + day;
    }
    var datestring = year + month + day;
    var person = [
        '李峰', '张明', '王二小', '张晓', '李爱国', '李伟峰', '王杰', '迟中铭', '陆云', '刘三国', '刘永', '李国涛'
    ]
    var result = {
        status: 0,
        data: []
    }

    for ( var i = 0; i < 23; i++ ) {
        var name = 'A';
        var key = i + 1;
        if ( key < 10 ) {
            name = name + '00' + key
        }
        else {
            name = name + '0' + key
        }
        result.data.push( {
            mac_id: i + 1,
            mac_no: name,
            mac_name: name,
            status_id: Math.round( Math.random() * 4 + 1 ),
            order_no: datestring + name,
            person: person[Math.round( Math.random() * 4 + 1 )],
            yield: Math.round( Math.random() * 900 + 100 )
        } )
    }
    res.send( result )
} )

app.post( '/getAlarmInfo', function ( req, res ) {
    var result = {
        status: 0,
        data: {
            total: 0,
            list: []
        }
    }
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    result.data.total = parseInt(( h * 3600 + 60 * m + s ) / 80 )

    for ( var i = 0; i < parseInt( req.query.num ); i++ ) {
        var ra1 = Math.round( Math.random() * 22 + 1 )
        var ra2 = Math.round( Math.random() * 99 + 1 )
        var name = 'A0' + numformate( ra1 )
        var alarm = 'AR' + numformate( ra2 )
        var time = date.getTime() - i * Math.round( Math.random() * 5 + 1 ) * 60 * 1000
        result.data.list.push( {
            name: name,
            alarm: alarm,
            time: time
        } )
    }
    res.send( result )
} )

app.post( '/getStatusRatio', function ( req, res ) {
    var result = {
        status: 0,
        data: {
            runRatio: parseFloat(( Math.round( Math.random() * 10 + 50 ) / 100 ).toFixed( 2 ) ),
            alarmRatio: parseFloat(( Math.round( Math.random() * 10 + 10 ) / 100 ).toFixed( 2 ) ),
            runTop: [],
            alarmTop: []
        }
    }
    for ( var i = 0; i < parseInt( req.query.num ); i++ ) {
        var name1 = 'A0' + numformate( i + 1 )
        var value1 = parseFloat(( Math.round( Math.random() * 30 + 40 ) / 100 ).toFixed( 3 ) )

        var name2 = 'A0' + numformate( i + 1 )
        var value2 = parseFloat(( Math.round( Math.random() * 20 + 1 ) / 100 ).toFixed( 3 ) )

        result.data.runTop.push( {
            name: name1,
            value: value1
        } )

        result.data.alarmTop.push( {
            name: name2,
            value: value2
        } )
    }

    res.send( result )
} )

function numformate( n ) {
    if ( n < 10 ) {
        return '0' + n;
    }
    else {
        return n;
    }
}
function getParam( url, name ) {
    var reg = new RegExp( "(^|&)" + name + "=([^&]*)(&|$)", "i" );
    var r = url.match( reg );
    if ( r != null ) return unescape( r[2] );
    return null;
}

var room = ["a", "b"]
setInterval( function () {
    getMacStatus( 'A', function ( res ) {
        io.to( 1 ).emit( 'getMacStatus', res )
    } )
    getMacStatus( 'B', function ( res ) {
        io.to( 2 ).emit( 'getMacStatus', res )
    } )
}, 5000 )

setInterval( function () {
    getAlarmInfo( 'A', function ( res ) {
        io.to( 1 ).emit( 'getAlarmInfo', res )
    } )
    getAlarmInfo( 'B', function ( res ) {
        io.to( 2 ).emit( 'getAlarmInfo', res )
    } )
    getStatusRatio( 'A', function ( res ) {
        io.to( 1 ).emit( 'getStatusRatio', res )
    } )
    getStatusRatio( 'B', function ( res ) {
        io.to( 2 ).emit( 'getStatusRatio', res )
    } )
}, 10000 )

function getMacStatus( room, callback ) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if ( month < 10 ) {
        month = '0' + month;
    }
    if ( day < 10 ) {
        day = '0' + day;
    }
    var datestring = year + month + day;
    var person = [
        '李峰', '张明', '王二小', '张晓', '李爱国', '李伟峰', '王杰', '迟中铭', '陆云', '刘三国', '刘永', '李国涛'
    ]
    var result = {
        status: 0,
        data: []
    }

    for ( var i = 0; i < 23; i++ ) {
        var name = room;
        var key = i + 1;
        if ( key < 10 ) {
            name = name + '00' + key
        }
        else {
            name = name + '0' + key
        }
        result.data.push( {
            mac_id: i + 1,
            mac_no: name,
            mac_name: name,
            status_id: Math.round( Math.random() * 4 + 1 ),
            order_no: datestring + name,
            person: person[Math.round( Math.random() * 4 + 1 )],
            yield: Math.round( Math.random() * 900 + 100 )
        } )
    }
    callback( result )
}

function getAlarmInfo( room, callback ) {
    var result = {
        status: 0,
        data: {
            total: 0,
            list: []
        }
    }
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    result.data.total = parseInt(( h * 3600 + 60 * m + s ) / 80 )

    for ( var i = 0; i < parseInt( 8 ); i++ ) {
        var ra1 = Math.round( Math.random() * 22 + 1 )
        var ra2 = Math.round( Math.random() * 99 + 1 )
        var name = room + '0' + numformate( ra1 )
        var alarm = room + 'R' + numformate( ra2 )
        var time = date.getTime() - i * Math.round( Math.random() * 5 + 1 ) * 60 * 1000
        result.data.list.push( {
            name: name,
            alarm: alarm,
            time: time
        } )
    }
    callback( result )
}

function getStatusRatio( room, callback ) {
    var result = {
        status: 0,
        data: {
            runRatio: parseFloat(( Math.round( Math.random() * 10 + 50 ) / 100 ).toFixed( 2 ) ),
            alarmRatio: parseFloat(( Math.round( Math.random() * 10 + 10 ) / 100 ).toFixed( 2 ) ),
            runTop: [],
            alarmTop: []
        }
    }
    for ( var i = 0; i < parseInt( 8 ); i++ ) {
        var name1 = room + '0' + numformate( i + 1 )
        var value1 = parseFloat(( Math.round( Math.random() * 30 + 40 ) / 100 ).toFixed( 3 ) )

        var name2 = room + '0' + numformate( i + 1 )
        var value2 = parseFloat(( Math.round( Math.random() * 20 + 1 ) / 100 ).toFixed( 3 ) )

        result.data.runTop.push( {
            name: name1,
            value: value1
        } )

        result.data.alarmTop.push( {
            name: name2,
            value: value2
        } )
    }
    callback( result )
}
// app.get('/test', function(req, res) {
//     res.sendFile(__dirname + '/web/test.html');
//     //res.render('')
// });

// app.get('/youjia', function(req, res) {
//     res.sendFile(__dirname + '/web/youjia.html');
//     //res.render('')
// });

// var socketcount = 0;
// io.on('connection', function(socket) {
//     socketcount++;
//     console.log('客户端连接数： ' + socketcount);



//     socket.on('my other event', function(data) {
//         console.log(data);
//     });
// });

// setInterval(function() {
//     //交易总金额TOP10榜
//     //
//     //
//     request.post({
//         url: 'http://192.168.121.48/lookingfor1111'
//     }, function(error,response,result) {
//         console.log(result);

//         io.sockets.emit('AmountStep', {
//             data: result
//         });
//     })

// }, 2000);


// setInterval(function() {
//     //交易总金额TOP10榜
//     io.sockets.emit('datetime', {
//         data: new Date()
//     });
// }, 1000);
