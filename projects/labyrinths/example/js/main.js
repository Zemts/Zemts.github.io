var main = (function(){
    
    // short version of element.getElementsByClassName
    var byClass = function(target = document, className){
        return target.getElementsByClassName(className);
    };

    // stuff for DOM
    var html = (function(){
    // CLASS NAMES OF DOM ELEMENTS
       // special
        var ACTIVE_ELEMENT = 's__active-element';
        var CUSTOM_SIDE = 's__custom-side';
        var HIDDEN = 's__hidden';
        var RADIO_ON = 's__radio-on';
        var UNCOVERED = 's__uncovered';
        // user settings
        var ALGORITHMS = 'js__algorithms';
        var ALGORITHM_LABEL = 'js__algorithm-label';
        var GENERATE_BUTTON = 'js__generate-button';
        var MAZE_CELL_SIZE = 'js__maze-cell-size';
        var MAZE_HEIGHT = 'js__maze-height';
        var MAZE_WIDTH = 'js__maze-width';
        var MENU_NAME = 'js__menu-name';
        var RADIO_IMITATION = 'js__radio-imitation';
        var RENDERING_DELAY = 'js__rendering-delay';
        var SIZING = 'js__sizing';
        var USER_SETTINGS = 'js__user-settings';
        var VISUAL = 'js__visual';
        // work space
        var CELL = 'js__maze-cell';
        var CELL_PROTO = 'js__cell-prototype';
        var CONTAINER = 'js__maze-container';
        var LIKE_MARGIN = 'js__like-margin';
        var ROW = 'js__maze-row';
        var ROW_PROTO = 'js__row-prototype';
        var WORK_SPACE = 'js__work-space';
        // other
        var STEP = 160;

    // DOM ELEMENTS
        // user settings
        var userSettings = byClass(document, USER_SETTINGS)[0];
        var algorithmsSettings = byClass(userSettings, ALGORITHMS)[0];
        var generateButton = byClass(userSettings, GENERATE_BUTTON)[0];
        var menusList = byClass(userSettings, MENU_NAME);
        var sizeSettings = byClass(userSettings, SIZING)[0];
        var visualSettings = byClass(userSettings, VISUAL)[0];
        var algorithmsLabels = byClass(algorithmsSettings, ALGORITHM_LABEL);
        var cellSizeElem = byClass(sizeSettings, MAZE_CELL_SIZE)[0];
        var heightElem = byClass(sizeSettings, MAZE_HEIGHT)[0];
        var widthElem = byClass(sizeSettings, MAZE_WIDTH)[0];
        var delayElem = byClass(visualSettings, RENDERING_DELAY)[0];
        // workspace
        var workSpace = byClass(document, WORK_SPACE)[0];
        var container = byClass(workSpace, CONTAINER)[0];
        var likeMargin = Array.prototype.slice.call( byClass(document, LIKE_MARGIN) );
        var cellProto = (function(){
            var c = byClass(workSpace, CELL_PROTO)[0].cloneNode(true);
            c.classList.remove(CELL_PROTO);
            c.classList.remove(HIDDEN);
            c.classList.add(CELL);
            return c;
        })();
        var rowProto = (function(){
            var r = byClass(workSpace, ROW_PROTO)[0].cloneNode(true);
            r.classList.remove(ROW_PROTO);
            r.classList.remove(HIDDEN);
            r.classList.add(ROW);
            return r;
        })();
       

    // ADD LISTENERS TO DOM ELEMENTS
        // for algorithm labels
        Array.prototype.forEach.call(algorithmsLabels, function(item){
            item.addEventListener('click', function(){
                byClass(this.parentNode, RADIO_ON)[0] && byClass(this.parentNode, RADIO_ON)[0].classList.remove(RADIO_ON);
                byClass(this, RADIO_IMITATION)[0].classList.add(RADIO_ON);
            });
        });
        // for menu buttons
        Array.prototype.forEach.call(menusList, function(item){
            item.addEventListener('click', function(){
                Array.prototype.forEach.call(
                    menusList,
                    function(item){
                        if(this.parentNode !== item.parentNode){
                            item.parentNode.classList.remove(UNCOVERED);
                            item.classList.remove(ACTIVE_ELEMENT);
                            return;
                        }
                        this.parentNode.classList.toggle(UNCOVERED);
                        this.classList.toggle(ACTIVE_ELEMENT);
                    },
                    this
                );
            });
        });
        // for 'container' element
        container.addEventListener('click', function(ev){
            if(ev.target.classList.contains('s__path')){
                ev.target.classList.toggle('s__visited');
            }
        });
        // for 'generate' button
        generateButton.addEventListener('click', function(){
            window.main.generate({
                'algorithm' : getSelectedAlgorithm(),
                'cellSize' : cellSizeElem.value,
                'delay' : delayElem.value,
                'height' : heightElem.value,
                'width' : widthElem.value
            });
        });
        // for window object
        var intervalID = null;
        var h = window.innerHeight;
        var w = window.innerWidth;
        window.addEventListener('resize', function(){
            if(intervalID === null){
                intervalID = setInterval(function(){
                    if(window.innerHeight === h && window.innerWidth === w){
                        clearInterval(intervalID);
                        intervalID = null;
                        window.main.dirtyCSS(
                            window.main.workspace,
                            window.main.getLastRenderedSettings()
                        );
                    }
                    else {
                        h = window.innerHeight;
                        w = window.innerWidth;
                    }
                }, 200);
            }
        });
        
    // FUNCSIONS FOR GET SOMETHING
        var getCells = function(){
            return byClass(container, CELL);
        };
        var getNewCell = function(){
            return cellProto.cloneNode(true);
        };
        var getNewRow = function(){
            return rowProto.cloneNode(true);
        };
        var getRows = function(){
            return byClass(container, ROW);
        };
        var getSelectedAlgorithm = function(){
            return  byClass(algorithmsSettings, RADIO_ON)[0] &&
                    byClass(algorithmsSettings, RADIO_ON)[0].dataset.algorithmName;
        };
        var withCustomSide = function(){
            return byClass(container, CUSTOM_SIDE);
        };
        

        return {
            'userSettings' : {
                'generateButton' : generateButton
            },
            'workspace' : {
                'cellProto' : cellProto,
                'container' : container,
                'getCells' : getCells,
                'getNewCell' : getNewCell,
                'getNewRow' : getNewRow,
                'getRows' : getRows,
                'likeMargin' : likeMargin,
                'main' : workSpace,
                'withCustomSide' : withCustomSide
            }
        };

    })();

    // stuff for functional demonstration
    var example = (function(){
        // object with last settings for rendering labyrinth
        var lastSettings;
        // object with 'rendering actions' for labyrinth
        var labyrinthActions = {
            'leave' : function(domElement){
                domElement.classList.remove('s__visited');
            },
            'visit' : function(domElement){
                domElement.classList.add('s__visited');
            },
            'reset' : function(domElement){
                domElement.classList.remove('s__wall');
                domElement.classList.remove('s__path');
                domElement.classList.remove('s__visited');
            },
            'setPath' : function(domElement){
                domElement.classList.remove('s__wall');
                domElement.classList.add('s__path');
            },
            'setWall' : function(domElement){
                domElement.classList.remove('s__path');
                domElement.classList.add('s__wall');
            }
        };
        // reduce values from UI panel
        var reduceSettings = function(values){
            // default parameters of labyrith
            var defaultSettings = {
                'algorithm' : 'Eller',
                'cellSize' : 'auto',
                'delay' : 10,
                'height' : 51,
                'width' : 51
            };
            return {
                'algorithm' : values.algorithm || defaultSettings.algorithm,
                'cellSize' : (function(v){
                    return (v === 'auto') ?
                        'auto' :
                        (isNaN(parseFloat(v))) ?
                            defaultSettings.cellSize :
                            Math.abs(parseFloat(v));
                })(values.cellSize),
                'delay' : (isNaN(parseInt(values.delay))) ? defaultSettings.delay : Math.abs(parseInt(values.delay)),
                'height' : (function(v){
                    var abs = Math.abs(parseInt(v));
                    return (isNaN(abs)) ?
                        defaultSettings.height :
                        (abs % 2) ?
                            abs :
                            abs + 1;
                })(values.height),
                'width' : (function(v){
                    var abs = Math.abs(parseInt(v));
                    return (isNaN(abs)) ?
                        defaultSettings.width :
                        (abs % 2) ?
                            abs :
                            abs + 1;
                })(values.width)
            }
        };
        // calculate and set some css height/width/margin and etc. to DOM elements in 'workspaceObject'
        var dirtyCSS = function(workspaceObject, settings){
            var main = {
                'h' : workspaceObject.main.offsetHeight,
                'w' : workspaceObject.main.offsetWidth,
                get minPad(){ return Math.min(this.h, this.w) * 0.02; }
            };
            var free = {
                'h' : main.h - main.minPad * 2,
                'w' : main.w - main.minPad * 2,
                get minSide(){ return Math.min(this.h, this.w); }
            };
            var cell = (settings.cellSize !== 'auto')
                ? settings.cellSize
                : Math.min(free.minSide / settings.height, free.minSide / settings.width);
            var necessary = {
                'h' : cell * settings.height,
                'w' : cell * settings.width
            };
            workspaceObject.likeMargin.forEach(function(item){
                item.style.height = "calc((100% - " + necessary.h + "px) / 2)";
                item.style.minHeight = main.minPad + 'px';
            });
            workspaceObject.container.style.margin = '0 ' + main.minPad + 'px';
            workspaceObject.container.style.height = necessary.h + 'px';
            workspaceObject.container.style.width = necessary.w + 'px';
            workspaceObject.cellProto.style.height = cell + 'px';
            workspaceObject.cellProto.style.width = cell + 'px';
            
            var cells = workspaceObject.withCustomSide();
            if(cells.length){
                Array.prototype.forEach.call(cells, function(item){
                    item.style.height = cell + 'px';
                    item.style.width = cell + 'px';
                });
            }
        };
        // remove passed rows from container
        var clearContainer = function(rows){
            // without 'slice' (...forEach.call...) it works like increment-loop (remove only half of elements...)
            Array.prototype.slice.call(rows).forEach(function(item){
                item.parentNode.removeChild(item);
            });
        };
        // return promise inside of which container is filled by new rows
        var fillContainer = function(workingSet, workspaceObject, settings){
            var row;
            // almost sync
            if(settings.delay === 0){
                return new Promise(function(resolve, reject){
                    for(var a = 0; a < settings.height; a++){
                        row = workspaceObject.getNewRow();
                        for(var b = 0; b < settings.width; b++){
                            row.appendChild(workingSet[a][b].element);
                        }
                        workspaceObject.container.appendChild(row);
                    }
                    resolve();
                });
            }
            // async
            else {
                var rowCounter = 0;
                return new Promise(function(resolve, reject){
                    var recursion = function(){
                        if(rowCounter === settings.height){
                            return resolve();
                        }
                        row = workspaceObject.getNewRow();
                        for(var a = 0; a < settings.width; a++){
                            row.appendChild(workingSet[rowCounter][a].element);
                        }
                        workspaceObject.container.appendChild(row);
                        rowCounter++;
                        setTimeout(recursion, settings.delay);
                    };
                    recursion();
                });
            }
        };
        // generate labyrith (generate new or replace old)
        var generate = function(values){
            // check external dependences
            if(!window.algorithms){
                throw new Error("Module 'algorithms' was loaded incorrectly.")
            }
            if(!window.core){
                throw new Error("Module 'core' was loaded incorrectly.")
            }

            //var settings = reduceSettings(values);
            var workingSet = core.getWorkingSet();
            lastSettings = reduceSettings(values);
            dirtyCSS(html.workspace, lastSettings);
            // same sizes of labyrinth
            if(lastSettings.height === workingSet.length && lastSettings.width === workingSet[0].length){
                core.resetWorkingSet();
                core.setStart();
                core.setFinish();
                algorithms.generate(
                    workingSet,
                    lastSettings.algorithm
                );
            }
            // new sizes of labyrinth
            else {
                clearContainer(html.workspace.getRows());
                core.dropWorkingSet();
                workingSet = core.createWorkingSet(
                    html.workspace.getNewCell,
                    { 'rows' : lastSettings.height, 'columns' : lastSettings.width }, 
                    labyrinthActions
                );
                core.setStart();
                core.setFinish();
                algorithms.generate(
                    workingSet,
                    lastSettings.algorithm
                );
                fillContainer(workingSet, html.workspace, lastSettings)
                    .then(function(resolve){
                        //alert('done');
                    })
                    .catch(function(reject){
                        throw new Error(reject);
                    });
            }
        };
        var getLastSettings = function(){
            return lastSettings;
        }

        return {
            'dirtyCSS' : dirtyCSS,
            'generate' : generate,
            'getLastSettings' : getLastSettings
        };

    })();

    return {
        'dirtyCSS' : example.dirtyCSS,
        'generate' : example.generate,
        'generateButton' : html.userSettings.generateButton,
        'getLastRenderedSettings' : example.getLastSettings,
        'workspace' : html.workspace
    };

})();