//
//	module for creation and control cells of labyrinth
//
var core = (function(){
	// working set
	var elements = [];
	// factory function that create cells
	var elementFactory = function(cell, coords, actions){
		return {
			'element' : cell,
			'coordinates' : {
				'col' : coords[1],
				'row' : coords[0]
			},
			'UN' : undefined,
			'type' : undefined,
			'boundaries' : {
				'bottom' : undefined,
				'left' : undefined,
				'right' : undefined,
				'top' : undefined
			},
			'neighbours' : {
				'bottom' : undefined,
				'left' : undefined,
				'right' : undefined,
				'top' : undefined
			},
			'reset' : function(){
				this.UN = undefined;
				this.type = undefined;
				typeof actions.reset === 'function' && actions.reset(this.element);
			},
			'setWall' : function(){
				this.type = 'wall';
				typeof actions.setWall === 'function' && actions.setWall(this.element);
			},
			'setPath' : function(){
				this.type = 'path';
				typeof actions.setPath === 'function' && actions.setPath(this.element);
			}
		}
	};
	// fill 'boundaries' prop of element
	var setBoundaries = function(el){
		el.boundaries.top = elements[el.coordinates.row - 1] && elements[el.coordinates.row - 1][el.coordinates.col];
		el.boundaries.bottom = elements[el.coordinates.row + 1] && elements[el.coordinates.row + 1][el.coordinates.col];
		el.boundaries.left = elements[el.coordinates.row][el.coordinates.col - 1];
		el.boundaries.right = elements[el.coordinates.row][el.coordinates.col + 1];
	};
	// fill 'neighbours' prop of element
	var setNeighbours = function(el){
		el.neighbours.top = elements[el.coordinates.row - 2] && elements[el.coordinates.row - 2][el.coordinates.col];
		el.neighbours.bottom = elements[el.coordinates.row + 2] && elements[el.coordinates.row + 2][el.coordinates.col];
		el.neighbours.left = elements[el.coordinates.row][el.coordinates.col - 2];
		el.neighbours.right = elements[el.coordinates.row][el.coordinates.col + 2];
	};
	// create and fill working set
	var createWorkingSet = function(elementGenerator, sizes, actions){
		// create 2d array and fill it by objects
		for(var a =  0; a < sizes.rows; a++){
			elements[a] = [];
			for(var b = 0; b < sizes.columns; b++){
				elements[a][b] = elementFactory(
					elementGenerator(),
					[a,b],
					actions
				);
			}
		}
		// add to objects neighbours and boundaries
		for(var a = 0; a < elements.length; a++){
			for(var b = 0; b < elements[a].length; b++){
				setBoundaries(elements[a][b]);
				setNeighbours(elements[a][b]);
			}
		}
		return elements;
	};
	var getWorkingSet = function(){
		return elements;
	};
	var dropWorkingSet = function(){
		elements = [];
	};
	var resetWorkingSet = function(){
		for(var a = 0; a < elements.length; a++){
			for(var b = 0; b < elements[a].length; b++){
				elements[a][b].reset();
			}
		}
	};
	var setFinish = function(){
		elements[elements.length - 1][elements[0].length - 2].setPath();
	};
	var setStart = function(){
		elements[0][1].setPath();
	};

	return {
		'createWorkingSet' : createWorkingSet,
		'dropWorkingSet' : dropWorkingSet,
		'getWorkingSet' : getWorkingSet,
		'resetWorkingSet' : resetWorkingSet,
		'setFinish' : setFinish,
		'setStart' : setStart
	};
	
})();