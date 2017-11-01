function MusicBar(loader) {
	
	var scope = this;
	
	THREE.Object3D.call(this);
	
	var texture = new THREE.Texture(loader.getResult('point'));
	texture.needsUpdate = true;
	
	var point = new THREE.Mesh(
		new THREE.CircleGeometry(2,64),
		new THREE.MeshBasicMaterial({map : texture, transparent : true})
	);
	
	this.add(point);			
	
	var r = 3;
	
	var num = 46;
	
	var deg = 2 * Math.PI / num; 
	
	this.bars = [];
	
	this.barGroup = new THREE.Object3D();
	
	for(var i = 0; i < num; i++) {
		
		var bool = false;
		
		var bar = new THREE.Mesh(
			new THREE.CircleGeometry(0.8,64),
			new THREE.MeshBasicMaterial({color:0xFFFFFF,wireframe:bool,transparent:true,opacity:Math.random()})
		);
		
		bar.scale.y = 0.001;
		
		var ra = r + 0.3 * r * Math.random();
		
		var posX = ra * Math.sin(deg * i);
		var posY = ra * Math.cos(deg * i);
		var posZ = 0;
		
		bar.position.set( posX, -posY, posZ);
		
		bar.rotation.z = deg * i;
		
		this.bars.push(bar);
		this.barGroup.add(bar);
		
	}
	this.barGroup.scale.set(2,2,2);
	this.add(this.barGroup);
	
	this.update = function(data) {
		
		scope.children[0].rotation.z += Math.PI/200;
		
		scope.barGroup.rotation.z -= Math.PI/600;
		
		if(data[0] !== 0) {
			
			for(var i = 0; i < num; i++) {
			
				var bar = scope.bars[i];
			
				var d = data[i];
				
				var s = THREE.Math.mapLinear(d, 0, 210, 0.05, 0.7);
				
				bar.scale.set(s,s,s);
				
			}
			
		}
		
	}
	
}

MusicBar.prototype = Object.create(THREE.Object3D.prototype);
MusicBar.prototype.constructor = MusicBar;
Object.defineProperty(MusicBar.prototype, 'color', {
  get: function () {
    return this.bars[0].material.color.getHexString();
  },
  set: function (color) {
    for(var i = 0; i < this.bars.length; i++) {
    	
    	TweenMax.to(this.bars[i].material.color, 2, {
    		r : color.r,
    		g : color.g,
    		b : color.b
    	});
    }
    
  }
});
