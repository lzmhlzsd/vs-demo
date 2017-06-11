var express = require( 'express' );
var path = require( 'path' );
var app = express();
var server = require( 'http' ).Server( app );
// var io = require('socket.io')(server);
var request = require( 'request' );
var _ = require( 'underscore' );
var rf = require( "fs" );

app.use( express.static( path.join( __dirname, 'web' ) ) );
server.listen( 5000, function () {
    console.log( 'server staring..., port: 5000' );
} );

app.get( '/demo', function ( req, res ) {
    res.sendFile( __dirname + '/web/demo.html' );
} );
app.get( '/test', function ( req, res ) {
    res.sendFile( __dirname + '/web/test.html' );
} );
app.get( '/demosrc', function ( req, res ) {
    res.sendFile( __dirname + '/web/demo_src.html' );
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
        var name = 'A' + numformate( ra1 )
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
            runRatio: parseFloat((Math.round( Math.random() * 10 + 50 ) / 100).toFixed(2)),
            alarmRatio: parseFloat((Math.round( Math.random() * 10 + 10 ) / 100).toFixed(2)),
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
