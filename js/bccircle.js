function BcCircle() {
	
	THREE.Object3D.call(this);
	
	var colors = [
		'#56B9D0',
		'#ED8C2B',
		'#FBBA42',
		'#F24C27',
		'#C2F2EB',
		'#B54A35',
		'#F37381',
		'#88A825',
		'#03A694'
	];
	
	var gap = 8;
	
	var r = 3;
	
	var loc = [
		{x : -gap, y : gap},
		{x : 0, y : gap},
		{x : gap, y : gap},
		{x : -gap, y : 0},
		{x : 0, y : 0},
		{x : gap, y : 0},
		{x : -gap, y : -gap},
		{x : 0, y : -gap},
		{x : gap, y : -gap}
	]
	
	for(var i = 0; i < colors.length; i++) {
		
		var circle = new THREE.Mesh(
			
			new THREE.CircleGeometry(r, 64),
			
			new THREE.MeshBasicMaterial({color: colors[i]})
			
		);
		
		circle.position.set(loc[i].x, loc[i].y, 0);
		
		this.add(circle);
		
	}
}

BcCircle.prototype = Object.create(THREE.Object3D.prototype);
BcCircle.prototype.constructor = BcCircle;
