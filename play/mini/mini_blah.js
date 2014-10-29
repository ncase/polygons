var GRID_SIZE_WIDTH = GRID[0].length;
var GRID_SIZE_HEIGHT = GRID.length;

canvas.width = GRID_SIZE_WIDTH*TILE_SIZE+10;
canvas.height = GRID_SIZE_HEIGHT*TILE_SIZE+10;

window.reset = function(){

	START_SIM = false;

	draggables = [];
	for(var y=0;y<GRID.length;y++){
		for(var x=0;x<GRID[y].length;x++){

			var data = GRID[y][x];
			if(data==0) continue;

			var xx = TILE_SIZE*(x+0.5);
			var yy = TILE_SIZE*(y+0.5);

			var draggable = new Draggable(xx,yy);
			draggable.color = (data==2) ? "triangle" : "square";
			draggables.push(draggable);

		}
	}

	// Write stats for first time
	for(var i=0;i<draggables.length;i++){
		draggables[i].update();
	}

};