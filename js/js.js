(function(target){
	
	var HIDDEN = 's__hidden';
	var HIDDEN_OVERFLOW = 's__hidden-overflow';
	var FRONT = 's__front-layer';
	var MAX_SIZE = 's__max-size';
	var PRE_FRONT = 's__pre-front-layer';
	var TRANSPARENT = 's__transparent';
	
	var BACKGROUND = 'js__bg';
	var CONTAINER = 'js__frames-container';
	var DEFINITION = 'js__definition';
	var FRAME = 'js__iframe';
	var MAX_MIN_BUTTON = 'js__max-min-button';
	var NEW_ELEMENT = 'js__new-frame';
	var NEW_TAB_BUTTON = 'js__new-tab-button';
	var PROTO = 'js__proj-proto';
	
	var frameProto;
    var projsList = [
		{ 'name' : 'Labyrinths generator', 'src' : 'labyrinths' }
	];
	
	function resizeFrame(){
		myLoadScreen.start();
		this.classList.add(TRANSPARENT);
		this.classList.toggle(MAX_SIZE);
		this.classList.toggle(FRONT);
		document.getElementsByClassName(CONTAINER)[0].classList.toggle(HIDDEN_OVERFLOW);
		document.getElementsByClassName(BACKGROUND)[0].classList.toggle(PRE_FRONT);
		setTimeout(function(){
			myLoadScreen.stop();
			this.classList.remove(TRANSPARENT);
		}.bind(this), 2000);
	}
	function switchMinMax(){
		this.title = (this.title === 'Minimize element') ? 'Maximize element' : 'Minimize element';
	};
	function openInNewTab(){
		window.open(this.src, '_blank');
	};
	function getFrameClone(){
		if(!frameProto){
			frameProto = document.getElementsByClassName(PROTO)[0];
		}
		var tmp = frameProto.cloneNode(true);
		tmp.classList.remove(HIDDEN);
		tmp.classList.remove(PROTO);
		tmp.classList.add(NEW_ELEMENT);
		tmp.theFrame = tmp.getElementsByClassName(FRAME)[0];
		tmp.theDef = tmp.getElementsByClassName(DEFINITION)[0];
		tmp.theMaxMin = tmp.getElementsByClassName(MAX_MIN_BUTTON)[0];
		tmp.theMaxMin.addEventListener('click', resizeFrame.bind(tmp));
		tmp.theMaxMin.addEventListener('click', switchMinMax);
		tmp.theNewTab = tmp.getElementsByClassName(NEW_TAB_BUTTON)[0];
		tmp.theNewTab.addEventListener('click', openInNewTab.bind(tmp.theFrame));
		return tmp;
	}
	function createFrames(){
		var tmp;
		var container = document.getElementsByClassName(CONTAINER)[0];
		projsList.forEach(function(item){
			tmp = getFrameClone();
			tmp.theFrame.src = 'projects/' + item.src + '/index.html';
			tmp.theDef.innerHTML = item.name;
			tmp.theDef.title = item.name;
			container.appendChild(tmp);
		});
	};
	
	target.core = {
		'createFrames' : createFrames
	};

})(this);