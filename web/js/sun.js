var Sun = function ( options ) {
    this.a = 1;
    this.default_options = {
        complete: $.noop
    };
    for ( var op in options ) {
        this.default_options[op] = options[op];
    }

    //
    this._windowSize();
    this._init();

    this._createRender();
    this._createControls();
    this.createGround();
    //._createGrid();
    //this._createAxis();

    var factoryGround = [
        [-Math.PI / 2, 0, 0, 50, 0.1, 250, 800],
        [-Math.PI / 2, 0, 0, 50, 0.1, -250, 800],
        [-Math.PI / 2, 0, -Math.PI / 2, -340, 0.1, -0, 520],
        [-Math.PI / 2, 0, -Math.PI / 2, 440, 0.1, -0, 520]
        // [-Math.PI / 2, 0.1, -110]
    ];
    for ( var i = 0; i < factoryGround.length; i++ ) {
        this.createFactoryGround( factoryGround[i][0], factoryGround[i][1], factoryGround[i][2],
            factoryGround[i][3], factoryGround[i][4], factoryGround[i][5], factoryGround[i][6] );
    }
    //this.createWall();

    // this.loader = new THREE.ColladaLoader();
    // this.loader.options.convertUpAxis = true;
    // this.loader1 = new THREE.ColladaLoader();
    // this.loader1.options.convertUpAxis = true;
    //this.createMazak();
    //注册传输带
    this.createTransmission();
    //注册机床
    this.createCNC();
    this.createLight();



    this.render( this.scene, this.camera );


    this.projector = new THREE.Projector();
    var self = this;
    // when the mouse moves, call the given function
    document.getElementById( '3d' ).addEventListener( 'mousedown', function ( e ) {
        self.onDocumentMouseMove( e, self );
    }, false );
    //document.addEventListener('touchstart', this.onDocumentTouchStart, false);
    this.targetList = [];

    //this.run();
};

Sun.prototype = {
    _windowSize: function () {

        w = $( window ).width() < 1920 ? $( window ).width() : 1920;
        h = $( window ).height() < 1080 ? $( window ).height() : 1080;
        $( '.container' ).width( w )
        $( '.container' ).height( h )
        //alert(w+';'+h)
        $( '.header' ).height( 0.07 * h )
        $( '.title-header' ).height( 0.04 * h )
        $( '.area1' ).height( 0.42 * ( h ) )
        $( '.area2' ).height( 0.42 * ( h ) )
        $( '.area3' ).height( 0.88 * ( h ) )
        $( '.area4' ).height( 0.42 * ( h ) )
        $( '.area5' ).height( 0.42 * ( h ) )

        //状态图例
        $( '#status-tooltip' ).empty();
        var status_html = '';
        for ( var i = 0; i < status_list.length; i++ ) {
            status_html += '<li><span class="status-flag" style="background:' + status_list[i].color + '"></span><span>' + status_list[i].name + '</span></li>'
        }
        $( '#status-tooltip' ).append( status_html );

        //swiper
        //drawRanked()
        var mySwiper = new Swiper( '.swiper-container', {
            loop: true,
            autoplay: 8000,
            pagination: '.swiper-pagination'
        } )
    },
    _init: function () {
        //$( 'body' ).append( '<div class="loading"><div>加载中...<div></div>' );
        this.container = document.createElement( 'div' );
        //document.body.appendChild( this.container );
        document.getElementById( '3d' ).appendChild( this.container )
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 1,
            10000 );
        //this.camera.position.set( 600, 400, 1100 );
        this.camera.position.set( -600, 300, 1000 );
        this.scene.add( this.camera );
    },
    _createRender: function () {
        this.renderer = new THREE.WebGLRenderer( {
            antialias: true, //是否开启反锯齿
            precision: "highp",
            alpha: true //是否可以设置背景透明
        } );
        //this.renderer.setClearColor( 0x13364b );
        //this.renderer.setClearColor( 0x13364b, 0.5 );
        this.renderer.setClearColor( 0xFFFFFF, 0 );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        //this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setSize( $( '#3d' ).width(), $( '#3d' ).height() );
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild( this.renderer.domElement );
    },
    _createControls: function () {
        var self = this;
        self.controls = new THREE.OrbitControls( self.camera, self.renderer.domElement );
        self.controls.damping = 0.2;
        self.controls.addEventListener( 'change', function ( e, b ) {
            //console.log(this.object.rotation.x, this.object.rotation.y, this.object.rotation.z);

            for ( var item in self.displays1 ) {
                //console.log(this.object.rotation.y)
                self.displays1[item].meshtext.rotation.y = this.object.rotation.z;
            }
            self.render( self.scene, self.camera );
        }, true );
    },
    _createGrid: function () {
        var helper = new THREE.GridHelper( 500, 50 );
        helper.position.y = 0;
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        this.scene.add( helper );
    },
    _createAxis: function () {
        // 坐标轴  
        var axis = new THREE.AxisHelper( 100 );
        // 在场景中添加坐标轴  
        this.scene.add( axis );
    },

    onDocumentMouseMove: function ( event, that ) {
        var mouse = {
            x: 0,
            y: 0
        };
        //old
        // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        // mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
        console.log( event )
        mouse.x = ( event.layerX / $( '#3d' ).width() ) * 2 - 1;
        mouse.y = -( event.layerY / $( '#3d' ).height() ) * 2 + 1;

        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        projector = new THREE.Projector();
        projector.unprojectVector( vector, that.camera );
        var ray = new THREE.Raycaster( that.camera.position, vector.sub( that.camera.position ).normalize() );

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects( that.targetList );
        if ( intersects.length > 0 ) {
            console.log( intersects[0].object.mac_id );
            that.showDisplay( intersects[0].object.mac_id );
        } else {
            that.resetDisplay();
        }
    },
    //创建地面
    createGround: function () {
        var self = this;
        var texture = new THREE.TextureLoader().load( "img/caodi.jpg", function () {
            self.render( self.scene, self.camera );
        } );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 20, 2 );
        var material = new THREE.MeshBasicMaterial( {
            //map: texture,
            color: '#24304f',
            transparent: false,
            side: THREE.DoubleSide,
            opacity: 1
        } );
        var geometry = new THREE.PlaneGeometry( 800, 520, 1, 1 );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.x = 50;
        mesh.position.y = -0.1;
        // mesh.position.z = -300;
        this.scene.add( mesh );
    },
    //墙
    createWall: function () {
        var self = this;
        var texture_wall = new THREE.TextureLoader().load( "img/wall03_3d.png", function () {
            self.render( self.scene, self.camera );
        } );
        texture_wall.wrapS = THREE.RepeatWrapping;
        texture_wall.wrapT = THREE.RepeatWrapping;
        texture_wall.repeat.set( 20, 2 );
        var material_wall = new THREE.MeshBasicMaterial( {
            map: texture_wall,
            transparent: false,
            side: THREE.DoubleSide,
            opacity: 1
        } );
        var geometry_wall = new THREE.CubeGeometry( 500, 5, 20 );
        var mesh_wall = new THREE.Mesh( geometry_wall, material_wall );
        mesh_wall.rotation.x = -Math.PI / 2;
        mesh_wall.position.y = 10;
        mesh_wall.position.z = 150;
        this.scene.add( mesh_wall );

        //3面墙

        var geometry1 = new THREE.CubeGeometry( 300, 5, 50 );
        var mesh = new THREE.Mesh( geometry1, material_wall );
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = -Math.PI / 2;
        mesh.position.x = -250;
        mesh.position.y = 25;
        mesh.position.z = 0;
        this.scene.add( mesh );
        var geometry2 = new THREE.CubeGeometry( 300, 5, 50 );
        var mesh = new THREE.Mesh( geometry2, material_wall );
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = -Math.PI / 2;
        mesh.position.x = 250;
        mesh.position.y = 25;
        mesh.position.z = 0;
        this.scene.add( mesh );
        var geometry3 = new THREE.CubeGeometry( 500, 5, 50 );
        var mesh = new THREE.Mesh( geometry3, material_wall );
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.x = 0;
        mesh.position.y = 25;
        mesh.position.z = -150;
        this.scene.add( mesh );
    },
    //工厂地面      
    createFactoryGround: function ( rx, ry, rz, x, y, z, l ) {
        var self = this;
        var texture_chejian = new THREE.TextureLoader().load( "img/xian1.jpg", function () {
            self.render( self.scene, self.camera );
        } );
        texture_chejian.wrapS = THREE.RepeatWrapping;
        texture_chejian.wrapT = THREE.RepeatWrapping;
        texture_chejian.repeat.set( 5, 1 );
        var material_chejian = new THREE.MeshBasicMaterial( {
            map: texture_chejian,
            transparent: false,
            side: THREE.DoubleSide,
            opacity: 1
        } );
        var geometry = new THREE.PlaneGeometry( l, 20, 1, 1 );
        var mesh_chejian = new THREE.Mesh( geometry, material_chejian );
        mesh_chejian.rotation.x = rx;
        mesh_chejian.rotation.y = ry;
        mesh_chejian.rotation.z = rz;
        mesh_chejian.position.x = x;
        mesh_chejian.position.y = y;
        mesh_chejian.position.z = z;
        self.scene.add( mesh_chejian );
    },



    render: function ( scene, camera ) {
        this.renderer.render( scene, camera );
        //console.log(12)
    },


    //注册传送带
    createTransmission: function () {
        var self = this;
        var loaders = new THREE.ColladaLoader();
        loaders.options.convertUpAxis = true;
        loaders.load( 'model/daogui/daogui.dae', function ( collada ) {
            var scene = collada.scene;
            scene.scale.x = 0.3;
            scene.scale.y = 0.3;
            scene.scale.z = 0.3;
            scene.position.x = -280;
            scene.position.y = 0;
            scene.position.z = 120;
            self.scene.add( scene );
            //$( '.loading' ).hide();
        } );
    },
    createCNC: function () {
        var self = this;
        self.machines = {};
        self.displays1 = {};

        //b 线
        $.getJSON( './json/data.json', function ( data ) {
            //console.log(result)
            //
            function digui1( result, i ) {
                var loaders = new THREE.ColladaLoader();
                loaders.options.convertUpAxis = true;
                loaders.load( result[i].url, function ( collada ) {
                    self.machines[result[i].id] = collada.scene;
                    self.machines[result[i].id].scale.x = result[i].scale.x;
                    self.machines[result[i].id].scale.y = result[i].scale.y;
                    self.machines[result[i].id].scale.z = result[i].scale.z;
                    self.machines[result[i].id].position.x = result[i].position.x;
                    self.machines[result[i].id].position.y = result[i].position.y;
                    self.machines[result[i].id].position.z = result[i].position.z;
                    self.machines[result[i].id].rotation.x = Math.PI / 180 * result[i].rotation.x;
                    self.machines[result[i].id].rotation.y = Math.PI / 180 * result[i].rotation.y;
                    self.machines[result[i].id].rotation.z = Math.PI / 180 * result[i].rotation.z;
                    var cnc = {
                        id: result[i].id,
                        data: []
                    };
                    collada.scene.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            child['mac_id'] = result[i].id;
                            self.targetList.push( child );
                        }
                    } );
                    //self.targetList.push(cnc);
                    self.scene.add( self.machines[result[i].id] );
                    //self.render(self.scene, self.camera);
                    self.createDisplay1( result[i] );
                    if ( i < result.length - 1 ) {
                        var k = i + 1;
                        digui1( result, k );
                    }
                    if ( i == result.length - 1 ) {
                        //setTimeout(function() {
                        self.render( self.scene, self.camera );
                        $( '.loading' ).hide();
                        $( '#3d' ).show();
                        $( '.status_list_count' ).show();
                        $( '.status_list' ).show();

                        self.default_options.complete.call( self );

                        //}, 3000);
                    }
                } );
            }
            digui1( data, 0 );
        } )
    },
    createDisplay1: function ( obj ) {
        if ( !model[obj.id].enable ) {
            return;
        }
        var self = this;
        var canvas = document.createElement( 'canvas' );
        canvas.width = 500;
        canvas.height = 300;
        var context = canvas.getContext( '2d' );
        context.lineWidth = 1;
        context.strokeStyle = "rgba(0,0,0, 1)";
        self._roundRect( 0, 0, 500, 285, 15, context );
        context.stroke();
        context.fillStyle = 'rgba(0,0,0, 1)';
        context.fill();


        context.fillStyle = '#ffffff'; // CHANGED
        context.textAlign = 'left';
        context.font = '30px Arial';
        context.fillText( "设备编号：" + model[obj.id].mac_no, 20, 40 );
        //context.fillText( "设备名称：" + self._findMacById( model[obj.id].mac_id ), 20, 95 );
        context.fillText( "设备名称：" + '-- --', 20, 95 );
        context.fillText( "工单号：" + '-- --', 50, 150 );
        context.fillText( "工单名称：" + '-- --', 20, 205 );
        context.fillText( "工单状态：" + '-- --', 20, 250 );


        // canvas contents will be used for a texture
        var texture = new THREE.Texture( canvas );
        texture.needsUpdate = true;
        var geometry_text = new THREE.PlaneGeometry( 100, 60, 1, 1 );
        var material_text = new THREE.MeshBasicMaterial( {
            //color: 0xcdcdcd,
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 0.8,
            visible: false,
            map: texture
        } );
        var mesh_text = new THREE.Mesh( geometry_text, material_text );
        mesh_text.position.set( obj.display1.position[0], obj.display1.position[1] + 15, obj.display1.position[2] );
        mesh_text.rotation.y = 0;//Math.PI / 8;
        self.scene.add( mesh_text );

        self.displays1[obj.id] = {
            mac_id: model[obj.id].mac_id,
            mac_no: model[obj.id].mac_no,
            context: context,
            texture: texture,
            meshtext: mesh_text,
            materialtext: material_text
        };
    },
    createLight: function () {
        var light = new THREE.HemisphereLight( 0xffffff, 0x111122 );
        this.scene.add( light );


    },
    _roundRect: function ( x, y, w, h, r, that ) {
        // if (w < 2 * r) r = w / 2;
        // if (h < 2 * r) r = h / 2;
        that.beginPath();
        that.moveTo( x + r, y );
        that.arcTo( x + w, y, x + w, y + h, r );
        that.arcTo( x + w, y + h, x, y + h, r );
        //console.log(y + h)
        that.lineTo( w / 2 + 8, y + h );
        that.lineTo( w / 2, y + h + 8 );
        that.lineTo( w / 2 - 8, y + h );
        that.arcTo( x, y + h, x, y, r );
        that.arcTo( x, y, x + w, y, r );
        //that.strokeStyle="#0000ff";
        that.closePath();
        return that;
    },
    _colorRgb: function ( sHex ) {
        var sColor = sHex.toLowerCase();
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if ( sColor && reg.test( sColor ) ) {
            if ( sColor.length === 4 ) {
                var sColorNew = "#";
                for ( var i = 1; i < 4; i += 1 ) {
                    sColorNew += sColor.slice( i, i + 1 ).concat( sColor.slice( i, i + 1 ) );
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值  
            var sColorChange = [];
            for ( var i = 1; i < 7; i += 2 ) {
                sColorChange.push( parseInt( "0x" + sColor.slice( i, i + 2 ) ) );
            }
            return "RGB(" + sColorChange.join( "," ) + ")";
        } else {
            return sColor;
        }
    },
    run: function () {

    },
    updateDisplay: function ( data ) {
        //文本信息
        var self = this;
        _.each( self.displays1, function ( value, key ) {
            var mac_id = value.mac_id;
            var mac_data = self._findMacDataById( mac_id, data );


            value.context.clearRect( 0, 0, 500, 300 );
            value.context.lineWidth = 1;
            value.context.strokeStyle = "rgba(0,0,0, 1)";
            self._roundRect( 0, 0, 500, 285, 15, value.context );
            value.context.stroke();
            value.context.fillStyle = "rgba(0,0,0, 1)"; //'rgba(255, 0, 0, 0.5)';
            value.context.fill();


            value.context.fillStyle = '#ffffff'; // CHANGED
            value.context.textAlign = 'left';
            value.context.font = '30px Arial';
            value.context.fillText( "设备编号：" + ( mac_data == null ? '-- --' : mac_data.mac_no ), 20, 40 );
            value.context.fillText( "设备名称：" + ( mac_data == null ? '-- --' : mac_data.mac_name ), 20, 95 );
            value.context.fillText( "加工工单：" + ( mac_data == null ? '-- --' : mac_data.order_no ), 20, 150 );
            value.context.fillText( "操作人员：" + ( mac_data == null ? '-- --' : mac_data.person ), 20, 205 );
            value.context.fillText( "加工产量：" + ( mac_data == null ? '-- --' : mac_data.yield ), 20, 250 );

            value.texture.needsUpdate = true;

            var statusobj = _.where( status_list, { status_id: ( mac_data == null ? 0 : mac_data.status_id ) } )
            var s_color = ''
            if ( statusobj.length == 1 ) {
                s_color = statusobj[0].color
            }
            else {
                s_color = '#000000'
            }
            //更新模型
            switch ( model[key].model_id ) {
                case 'jiagongzhongxin':
                    self._jiagongzhongxin( self.machines[key], s_color );
                    break;
                case 'avg':
                    self._avg( self.machines[key], s_color );
                    break;
                case 'mazak':
                    self._mazak( self.machines[key], s_color );
                    break;
                case 'qinxiji':
                    self._qinxiji( self.machines[key], s_color );
                case 'cangku':
                    self._cangku( self.machines[key], s_color );
                case 'guanjiejiqiren':
                    self._guanjiejiqiren( self.machines[key], s_color );
            }


        } );
        self.render( self.scene, self.camera );
    },
    _jiagongzhongxin: function ( mac, status_color ) {
        mac.traverse( function ( child ) {
            if ( child.children.length == 17 ) {
                for ( var i = 0; i < child.children.length; i++ ) {
                    child.children[i].material = new THREE.MeshLambertMaterial( {
                        color: status_color,
                        transparent: true,
                        opacity: 1
                    } );
                }

            } else if ( child.children.length == 26 ) {
                var filter = [20, 21, 22];
                for ( var i = 0; i < child.children.length; i++ ) {
                    if ( _.indexOf( filter, i ) < 0 ) {
                        child.children[i].material = new THREE.MeshLambertMaterial( {
                            color: status_color,
                            transparent: true,
                            opacity: 1
                        } );
                    }
                }

            }
        } )
    },
    _avg: function ( mac, status_color ) {
        mac.traverse( function ( child ) {
            if ( child.children.length == 3 ) {
                var filter = [];
                for ( var i = 0; i < child.children.length; i++ ) {
                    if ( _.indexOf( filter, i ) < 0 ) {
                        child.children[i].material = new THREE.MeshLambertMaterial( {
                            color: status_color,
                            transparent: true,
                            opacity: 1
                        } );
                    }
                }
            }
        } )
    },
    _mazak: function ( mac, status_color ) {
        mac.traverse( function ( child ) {
            if ( child.children.length == 23 ) {
                var filter = [3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
                for ( var i = 0; i < child.children.length; i++ ) {
                    if ( _.indexOf( filter, i ) < 0 ) {
                        child.children[i].material = new THREE.MeshLambertMaterial( {
                            color: status_color,
                            transparent: true,
                            opacity: 1
                        } );
                    }
                }
            }
        } )
    },
    _qinxiji: function ( mac, status_color ) {
        mac.traverse( function ( child ) {
            if ( child.children.length == 16 ) {
                var filter = [0, 16];
                //var filter = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22,23,24,25,26,27,28,29,30,31];
                for ( var i = 0; i < child.children.length; i++ ) {
                    if ( _.indexOf( filter, i ) > -1 ) {
                        child.children[i].material = new THREE.MeshLambertMaterial( {
                            color: status_color,
                            transparent: true,
                            opacity: 1
                        } );
                    }
                }
            }
        } )
    },
    _cangku: function ( mac, status_color ) {
        mac.traverse( function ( child ) {
            if ( child.children.length == 2 || child.children.length == 5 ) {
                var filter = [0, 1];
                for ( var i = 0; i < child.children.length; i++ ) {
                    if ( _.indexOf( filter, i ) >= 0 ) {
                        child.children[i].material = new THREE.MeshLambertMaterial( {
                            color: status_color,
                            transparent: true,
                            opacity: 1
                        } );
                    }
                }
            }
        } );
    },
    _guanjiejiqiren: function ( mac, status_color ) {
        mac.traverse( function ( child ) {
            if ( child.children.length == 11 ) {
                var filter = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                for ( var i = 0; i < child.children.length; i++ ) {
                    if ( _.indexOf( filter, i ) >= 0 ) {
                        child.children[i].material = new THREE.MeshLambertMaterial( {
                            color: status_color,
                            transparent: true,
                            opacity: 1
                        } );
                    }
                }
            }
        } );
    },
    showDisplay: function ( k ) {
        //文本信息
        if ( !model[k].enable ) {
            return;
        };
        var self = this;
        self.resetDisplay();
        self.displays1[k].materialtext.setValues( {
            visible: true
        } );
        self.render( self.scene, self.camera );
    },
    _findMacDataById: function ( id, data ) {
        var mac = _.where( data, { mac_id: id } );
        if ( mac.length == 1 ) {
            return mac[0];
        }
        else {
            return null;
        }
    },
    _findMacById: function ( k ) {
        for ( var i = 0; i < this.default_options.maclist.length; i++ ) {
            if ( this.default_options.maclist[i].mac_id == k ) {
                return this.default_options.maclist[i].mac_name;

            }
        }
    },
    _findOrderByMacId: function ( k, data ) {
        for ( var i = 0; i < data.length; i++ ) {
            if ( data[i].MO_key[0] == k ) {
                return {
                    WO_key: data[i].WO_Key[0],
                    WO_name: data[i].WO_name[0],
                    Jobstatus: data[i].Jobstatus[0]
                };
            }
        }
    },
    resetDisplay: function () {
        for ( var item in this.displays1 ) {
            this.displays1[item].materialtext.setValues( {
                visible: false
            } )
        }
    }
}

if ( typeof module != 'undefined' ) {
    module.exports = Sun;
}