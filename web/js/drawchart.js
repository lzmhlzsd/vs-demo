drawRunRatio = function ( options ) {
    var default_options = {
        id: ''
    }
    this.default_options = $.extend( default_options, options )
    this._init();
    this.config = {
        tooltip: {
            show: false
        },
        // grid: {
        //     top: 10
        // },
        legend: {
            //show: false
        },
        series: [{
            name: '',
            type: 'pie',
            clockWise: true,
            hoverAnimation: false,
            radius: ['50%', '75%'],
            center: ['50%', '50%'],
            label: {
                normal: {
                    show: false,
                    formatter: function ( params ) {
                        return params.name + ':' + params.value + '%'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 0,
                name: '运行率',
                label: {
                    normal: {
                        show: false,
                        formatter: function ( params ) {
                            return params.percent + '%'
                        },
                        textStyle: {
                            color: _.where( status_list, { status_id: 2 } )[0].color,
                            fontFamily: 'MyNewFont'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: _.where( status_list, { status_id: 2 } )[0].color
                    }
                }
            }, {
                value: 0,
                name: '报警率',
                label: {
                    normal: {
                        show: false,
                        formatter: function ( params ) {
                            return params.percent + '%'
                        },
                        textStyle: {
                            color: _.where( status_list, { status_id: 3 } )[0].color,
                            fontFamily: 'MyNewFont'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: _.where( status_list, { status_id: 3 } )[0].color
                    }
                }
            }, {
                value: 6,
                name: '其他',
                label: {
                    normal: {
                        show: false,
                        formatter: function ( params ) {
                            return params.percent + '%'
                        },
                        textStyle: {
                            color: '#42516e',
                            fontFamily: 'MyNewFont'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#42516e'
                    }
                }
            }]
        }, {
            name: '白',
            type: 'pie',
            clockWise: true,
            hoverAnimation: false,
            radius: ['50%', '50%'],
            label: {
                normal: {
                    position: 'center'
                }
            },
            data: [{
                value: 1,
                label: {
                    normal: {
                        formatter: '运行率',
                        textStyle: {
                            color: '#ffffff',
                            fontSize: 18,
                            fontFamily: 'MyNewFont'
                        }
                    }
                }
            }, {
                tooltip: {
                    show: false
                },
                label: {
                    normal: {
                        formatter: '\n70%',
                        textStyle: {
                            color: '#ffffff',
                            fontSize: 18,
                            fontFamily: 'MyNewFont'
                        }
                    }
                }
            }]
        }]
    }
    this.Chart = echarts.init( document.getElementById( this.default_options.id ), 'dark' );
    this.Chart.setOption( this.config );
}
drawRunRatio.prototype._init = function () {
    var ww = $( '#' + this.default_options.id ).width()
    $( '#' + this.default_options.id ).height( ww );
    $( '.ratio-tool' ).append( '<li>' +
        '<span class="status-flag" style="background:' + _.where( status_list, { status_id: 2 } )[0].color + '"></span>' +
        '<span>运行</span>' +
        '<span id="run-ratio-value">-- --</span>' +
        '</li>' +
        '<li>' +
        '<span class="status-flag" style="background:' + _.where( status_list, { status_id: 3 } )[0].color + '"></span>' +
        '<span>报警</span>' +
        '<span id="alarm-ratio-value">-- --</span>' +
        '</li>' )
    
}
drawRunRatio.prototype.setValue = function ( data ) {
    var run = data.runRatio;
    var alarm = data.alarmRatio;
    this.config.series[0].data[0].value = parseInt(( run * 100 ).toFixed( 0 ) )
    this.config.series[0].data[1].value = parseInt(( alarm * 100 ).toFixed( 0 ) )
    this.config.series[1].data[1].label.normal.formatter = '\n' + parseInt(( run * 100 ).toFixed( 0 ) ) + '%'
    this.Chart.setOption( this.config );
    $( '#run-ratio-value' ).html(( run * 100 ).toFixed( 0 ) + '%' )
    $( '#alarm-ratio-value' ).html(( alarm * 100 ).toFixed( 0 ) + '%' )

    $( '.run-top' ).empty()
    var htmlrun = ''
    var runTop = _.sortBy( data.runTop, 'value' ).reverse()
    for ( i = 0; i < runTop.length; i++ ) {
        htmlrun += '<li>' +
            '<span class="s1 name">' + runTop[i].name + '</span>' +
            '<span class="s2 top-map">' +
            '<span class="top-map-value" style="width:' + ( runTop[i].value * 100 ).toFixed( 1 ) + '%;background:' + _.where( status_list, { status_id: 2 } )[0].color + '"></span>' +
            '</span>' +
            '<span class="s3 top-value">' + ( runTop[i].value * 100 ).toFixed( 1 ) + '%</span>' +
            '</li>'
    }
    $( '.run-top' ).append( htmlrun )

    $( '.alarm-top' ).empty()
    var htmlalarm = ''
    var alarmTop = _.sortBy( data.alarmTop, 'value' ).reverse()
    for ( i = 0; i < alarmTop.length; i++ ) {
        htmlalarm += '<li>' +
            '<span class="s1 name">' + alarmTop[i].name + '</span>' +
            '<span class="s2 top-map">' +
            '<span class="top-map-value" style="width:' + ( alarmTop[i].value * 100 ).toFixed( 1 ) + '%;background:' + _.where( status_list, { status_id: 3 } )[0].color + '"></span>' +
            '</span>' +
            '<span class="s3 top-value">' + ( alarmTop[i].value * 100 ).toFixed( 1 ) + '%</span>' +
            '</li>'
    }
    $( '.alarm-top' ).append( htmlalarm )
}

if ( typeof module != 'undefined' ) {
    module.exports = drawRunRatio;
}


