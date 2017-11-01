function ColorDetector() {
	
	var scope = this;
	
	var r = 3; 
	
	var gap = 8;
	
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
	
	var colorPos = [
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
	
	var color = '0xFFFFFF';
	
	this.detect = function(pointPos) {
		
		var v1 = pointPos;
		
		for(var i = 0; i < colorPos.length; i++) {
			
			var d = dis(v1,colorPos[i]);
			
			if( d <= r && (colors[i] !== color) ) {
				
				eventBus.dispatchEvent({ type : 'color', color: colors[i]});
				
				color = colors[i];
				
			}
			
		}
		
	}
	
	function dis(v1,v2) {
		
		return Math.sqrt((v1.x - v2.x)*(v1.x - v2.x) + (v1.y - v2.y)*(v1.y - v2.y));
		
	}
	
}
