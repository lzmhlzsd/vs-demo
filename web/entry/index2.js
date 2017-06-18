import $ from 'jquery'
import THREE from 'three'
import OrbitControls from 'OrbitControls'
import ColladaLoader from 'ColladaLoader'
import Projector from 'Projector'
import model from 'model'
import status from 'status'
import sun from 'sun'
import moment from 'moment'
import _ from 'underscore'
import swiper from 'swiper'
import echarts from 'echarts'
import drawRunRatio from 'drawRunRatio'

var sun = new Sun( {
    //maclist: data,
    config: './json/data1.json',
    complete: function ( e ) {
        var self = this;
        var runRatio = new drawRunRatio( {
            id: 'runratio'
        } )
        var socket = io( 'http://' + window.location.host );
        socket.on( 'getMacStatus', function ( res ) {
            console.log( res );
            if ( res.status == 0 ) {
                $( '#run-num' ).html( _.where( res.data, {
                    status_id: 2
                } ).length )
                $( '#alarm-num' ).html( _.where( res.data, {
                    status_id: 3
                } ).length )
                self.updateDisplay( res.data );
            }
        } );
        socket.on( 'getAlarmInfo', function ( res ) {
            console.log( res );
            if ( res.status == 0 ) {
                $( '#alarm-times' ).html( res.data.total )
                var html = ''
                for ( var i = 0; i < res.data.list.length; i++ ) {
                    html += '<tr><td>' + res.data.list[i].name +
                        '</td><td>' + res.data.list[i].alarm +
                        '</td><td>' + moment( res.data.list[i].time ).format(
                            'HH:mm' ) +
                        '</td></tr>'
                }
                $( '.alarm-list tbody' ).html( html )
            }
        } );
        socket.on( 'getStatusRatio', function ( res ) {
            console.log( res );
            if ( res.status == 0 ) {
                runRatio.setValue( res.data )
            }
        } );
    }
} );

