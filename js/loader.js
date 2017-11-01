function Loader(eventBus, onLoadComplete) {
	
	var scope = this;
	
	var preload,
		sound,
		analyser;
	
	var loadNum = 2;
	
	var total1 = 0;
	var total2 = 0;
	
	eventBus.addEventListener('loaded',function() {
			
		if(loadNum == 1)
		
			onLoadComplete();
		
		else
		
			loadNum--;
		
	});
	
	this.loadAssets = function(assetsList) {
		
		preload = new createjs.LoadQueue(false);
				
		preload.addEventListener( 'complete', onAssetsLoaded );
	
		preload.addEventListener( 'progress', onProgress1);
		
		loadAssets(assetsList);
		
	}
	
	function loadAssets(assetsList) {
		
		var len = assetsList.length;			
			
		for(var i = 0; i < len; i++) {
			
			var url = assetsList[i].url;
			
			var id = assetsList[i].id;
			
			preload.loadFile({ src : url, id : id });
			
		}
			
	}
	
	function onAssetsLoaded() {
		
		scope.getResult = function(id) {
			
			return preload.getResult(id);
			
		}
		
		eventBus.dispatchEvent({type:'loaded'});
		
	}
	
	function onProgress1() {
		
		var per = preload.progress * 50 ;
		
		total1 = per;
		
		var p = total1 + total2 / 100 * 150;
		
		loadingBar.style.width = p + 'px';
		
	}
	
	this.loadMusic = function(musicUrl) {
		
		var listener = new THREE.AudioListener();
				
		sound = new THREE.Audio(listener);
		
		var audioLoader = new THREE.AudioLoader();
		
		analyser = new THREE.AudioAnalyser(sound, 512);
		
		scope.analyser = analyser;
		
		audioLoader.load(musicUrl, onMusicLoaded, onProgress2);
		
	}
	
	function onMusicLoaded(buffer) {
		
		sound.setBuffer( buffer );
		
		sound.setLoop(false);
		
		sound.setVolume(1);
		
		scope.sound = sound;
		
		eventBus.dispatchEvent({type:'loaded'});
		
	}
	
	function onProgress2(xhr) {
		
		var per = xhr.loaded/xhr.total * 50;
		
		total2 = per;
		
		var p = total1 + total2 / 100 * 150;
		
		loadingBar.style.width = p + 'px';
		
	}
	
	
	
	
	
	
	
	
}
