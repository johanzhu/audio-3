THREE.FXAAShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        resolution: {
            type: "v2",
            value: new THREE.Vector2(1/1024, 1/512)
        }
    },
    vertexShader: ["void main() {", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
    fragmentShader: ["uniform sampler2D tDiffuse;", "uniform vec2 resolution;", "#define FXAA_REDUCE_MIN   (1.0/128.0)", "#define FXAA_REDUCE_MUL   (1.0/8.0)", "#define FXAA_SPAN_MAX     8.0", "void main() {", "vec3 rgbNW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) / resolution ).xyz;", "vec3 rgbNE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) / resolution ).xyz;", "vec3 rgbSW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) / resolution ).xyz;", "vec3 rgbSE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) / resolution ).xyz;", "vec4 rgbaM  = texture2D( tDiffuse,  gl_FragCoord.xy  / resolution );", "vec3 rgbM  = rgbaM.xyz;", "vec3 luma = vec3( 0.299, 0.587, 0.114 );", "float lumaNW = dot( rgbNW, luma );", "float lumaNE = dot( rgbNE, luma );", "float lumaSW = dot( rgbSW, luma );", "float lumaSE = dot( rgbSE, luma );", "float lumaM  = dot( rgbM,  luma );", "float lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );", "float lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );", "vec2 dir;", "dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));", "dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));", "float dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );", "float rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );", "dir = min( vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),", "max( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),", "dir * rcpDirMin)) / resolution;", "vec4 rgbA = (1.0/2.0) * (", "texture2D(tDiffuse,  gl_FragCoord.xy  / resolution + dir * (1.0/3.0 - 0.5)) +", "texture2D(tDiffuse,  gl_FragCoord.xy  / resolution + dir * (2.0/3.0 - 0.5)));", "vec4 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (", "texture2D(tDiffuse,  gl_FragCoord.xy  / resolution + dir * (0.0/3.0 - 0.5)) +", "texture2D(tDiffuse,  gl_FragCoord.xy  / resolution + dir * (3.0/3.0 - 0.5)));", "float lumaB = dot(rgbB, vec4(luma, 0.0));", "if ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) ) {", "gl_FragColor = rgbA;", "} else {", "gl_FragColor = rgbB;", "}", "}"].join("\n")
};

THREE.FXAAPass = function(world,a) {
    var c, d, e, b = new THREE.ShaderMaterial({
        uniforms: THREE.FXAAShader.uniforms,
        vertexShader: THREE.FXAAShader.vertexShader,
        fragmentShader: THREE.FXAAShader.fragmentShader
    });
    b.uniforms.tDiffuse.value = a, c = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), d = new THREE.Scene, e = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), b), d.add(e), d.autoUpdate = !1, this.render = function(a, b) {
        world.renderer.render(d, c, a, b);
    }, this.setResolution = function(a, c) {
        b.uniforms.resolution.value.set(a, c);
    }
};

function World(){
    
    var scope = this;
    
    this.defaultScene;
    
    this.defaultCamera;
    
    this.scene;
    
    this.camera;
    
    var w = window.innerWidth;
    
    var h = window.innerHeight;
    
    var fxaaPass,
    
	fxaaBuffer = new THREE.WebGLRenderTarget(1,1,{
		format: THREE.RGBAFormat
	});
	
	fxaaBuffer.setSize(w * 1.5, h * 1.5);
    
    this.init = function(scene,camera){
    	
		var domElement = document.createElement('div');
		domElement.setAttribute('id','world');
		document.body.appendChild(domElement);
	
		scope.defaultScene = new THREE.Scene();
		scope.defaultScene.name = 'default scene';
		
   		scope.defaultCamera = new THREE.PerspectiveCamera(45, w/h, 0.1, 2000);
   		scope.defaultCamera.name = 'defauldt camera';
   		scope.defaultCamera.position.set(0,0,200);
		
        if(!scene) {
			scope.scene = scope.defaultScene;
		}else{
			scope.scene = scene;
		}
		if(!camera) {
			this.camera = this.defaultCamera;
		}else{
			this.camera = camera;
		}
		
		scope.renderer = new THREE.WebGLRenderer({alpha:true,antialias:false});
		scope.renderer.setSize(w, h);
		scope.renderer.setPixelRatio(1.5);
		scope.renderer.shadowMap.enabled = true;
		
		fxaaPass = new THREE.FXAAPass(scope, fxaaBuffer.texture);
				
		fxaaPass.setResolution(w * 1.5, h * 1.5);
	
		var container =  document.getElementById('world');
		container.appendChild(this.renderer.domElement);
	
		scope.axesHelper = new THREE.AxisHelper(10);
		scope.scene.add(this.axesHelper);
		
		window.addEventListener('resize',onWindowResize,false);
	
		function onWindowResize() {
			
      		scope.renderer.setSize(w, h);
      		
      		scope.camera.aspect = w / h;
      		
      		scope.camera.updateProjectionMatrix();
      		
      		fxaaBuffer.setSize(w * 1.5, h * 1.5);
      		
      		fxaaPass.setResolution(w * 1.5, h * 1.5);
      		
    	}
    
    };
    
    this.render = function() {
    	
    	scope.renderer.render(scope.scene, scope.camera, fxaaBuffer, true);
				
		fxaaPass.render(null,false);
    	
    };
    
    this.removeAxes = function(){
    	
		scope.scene.remove(this.axesHelper);
		
	};
	
	this.changeScene = function(scene,camera){
		scope.scene = scene;
		scope.camera = camera;
      	scope.renderer.setSize(w, h);
      	scope.camera.aspect = w / h;
      	scope.camera.updateProjectionMatrix();
	};
    
}	
