var algorithms = (function(){
	
	var simple = {
		'generate' : function(workingSet){
			var position = workingSet[1][1];
			var stack = [];
			var direction;
			// set 'path' to some elements
			do {
				if(position !== undefined){
					position.setPath();
					// cell is surrounded by neighbours with type = 'path'
					if(this.isSurroundedByPaths(position)){
						position = stack.shift();
						continue;
					}
					// cell has neighbours with type = undefined
					if(stack.indexOf(position) === -1){
						stack.push(position);
					}
					direction = this.getRandomDirection(position);
					position.boundaries[direction].setPath();
					position = position.neighbours[direction];
				}
			} while(stack.length !== 0)
			// set 'wall' to other elements
			for(var a = 0; a < workingSet.length; a++){
				for(var b = 0; b < workingSet[a].length; b++){
					if(workingSet[a][b].type !== 'path'){
						workingSet[a][b].setWall();
					}
				}
			}
		},
		// find all neighbours without  type = 'path' and return neighbour names
		'getNotPathNeighbours' : function(cell){
			return Object.keys(cell.neighbours).reduce(function(acc, item){
				if(cell.neighbours[item] !== undefined && cell.neighbours[item].type !== 'path'){
					acc.push(item);
				}
				return acc;
			}, []);
		},
		// get random neighbour name without type = 'path'
		'getRandomDirection' : function(cell){
			var neighbours = this.getNotPathNeighbours(cell);
			return neighbours[Math.floor(Math.random() * neighbours.length)];
		},
		// check that cell is surrounded by neighbours with type = 'path' or doesn't has neighbours
		'isSurroundedByPaths' : function(cell){
			return (!cell.neighbours.bottom || cell.neighbours.bottom.type === 'path')
				&& (!cell.neighbours.left || cell.neighbours.left.type === 'path')
				&& (!cell.neighbours.right || cell.neighbours.right.type === 'path')
				&& (!cell.neighbours.top || cell.neighbours.top.type === 'path');
		}
	};
	
	var Eller = {
		'generate' : function(workingSet){
			var height = workingSet.length;
			var width = workingSet[0].length;
			var mainSet = [];	// set for future subsets
			for(var a = 1; a < height; a += 2){
				this.updateStructure(mainSet, workingSet[a]);
				this.updateRight(mainSet, workingSet[a]);
				this.updateBottom(mainSet, workingSet[a]);
			}
			// set 'wall' to other elements
			for(var a = 0; a < workingSet.length; a++){
				for(var b = 0; b < workingSet[a].length; b++){
					if(workingSet[a][b].type !== 'path'){
						workingSet[a][b].setWall();
					}
				}
			}
		},
		// combine two subsets by combining their unique numbers
		// by assigning the largest unique value to cells with the smallest unique value
		'mergeSubsets' : function(mainSet, UN_1, UN_2){
			if(mainSet[UN_1].length < mainSet[UN_2].length){	// minor optimization
				return this.mergeSubsets(mainSet, UN_2, UN_1);
			}
			mainSet[UN_2].forEach(function(item){
				item.UN = UN_1;
			});
			mainSet[UN_1] = mainSet[UN_1].concat(mainSet[UN_2]);
			delete mainSet[UN_2];
		},
		// add unique numbers to cells in the next row
		'updateBottom' : function(mainSet, row){
			// not last row
			if(row[1].neighbours.bottom){
				var atLeastOne = false;
				var tmp = [];
				for(var a = 1; a < row.length; a += 2){
					tmp.push(row[a]);
					if(row[a].neighbours.right === undefined || row[a].neighbours.right.UN !== row[a].UN){
						tmp.forEach(function(item, index){
							if( (atLeastOne === false && index === tmp.length - 1) || Math.random() > 0.5 ){
								atLeastOne = true;
								item.neighbours.bottom.UN = item.UN;
								item.boundaries.bottom.setPath();
							}
						});
						atLeastOne = false;
						tmp = [];
					}
				}
			}
			// last row
			else {
				for(var a = 1; a < row.length; a += 2){
					if(row[a].neighbours.right && row[a].neighbours.right.UN !== row[a].UN){
						this.mergeSubsets(mainSet, row[a].UN, row[a].neighbours.right.UN);
						row[a].boundaries.right.setPath();
					}
				}
			}
		},
		// randomly add path to right cell or merge current subset with right subset
		'updateRight' : function(mainSet, row){
			for(var a = 1; a < row.length; a += 2){
				row[a].setPath();
				if(
					Math.random() < 0.5 &&
					row[a].neighbours.right &&
					row[a].neighbours.right.UN !== row[a].UN
				){
					// connect sets
					this.mergeSubsets(mainSet, row[a].UN, row[a].neighbours.right.UN);
					row[a].boundaries.right.setPath();
				}
			}
		},
		// add unique numbers to each even cell (if cell doesn't has unique number)
		// store new subset by it unique number
		'updateStructure' : function(mainSet, row){
			var uniqueNumber = mainSet.length;
			for(var a = 1; a < row.length; a += 2){
				row[a].UN = row[a].UN || ++uniqueNumber;
				mainSet[row[a].UN] = mainSet[row[a].UN] || [];
				mainSet[row[a].UN].push(row[a]);
			}
		}
	};
	
	var generate = function(workingSet, algorithmName){
		switch(algorithmName){
			case 'simple' :
				simple.generate.call(simple, workingSet);
				break;
			case 'Eller' : 
				Eller.generate.call(Eller, workingSet);
				break;
			default :
				throw new Error('Unknown algorithm name: "' + algorithmName + '".');
		}
	};
	
	return {
		'generate' : generate
	};
	
})();