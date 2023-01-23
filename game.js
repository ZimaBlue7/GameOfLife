// canvas is where i work
var canvas;
var context;
var fps = 30;

var canvasX = 500;
var canvasY = 500;

var tileX, tileY;

//Variables realcionated with the table of game
var table;
var rows = 100;
var columns = 100;

var white = "#FFFFFF";
var black = "#000000";

function createArray2d(r,c) {
    var obj = new Array(r);
    for ( i = 0; i < r; i++) {
        obj[i] = new Array(c);
}
    return obj;
}

var Agent = function (x,y,state){

    this.x = x;
    this.y = y;
    this.state = state; // live = 1, death = 2
    this.stateProx = this.state;

    this.neighbour = []; // neighbors are 8

    this.addNeighbour = function(){
        var xNeighbour;
        var yNeighbour;

        for ( i = -1; i< 2; i++) {
            for ( j = -1; j< 2; j++) {
            
                xNeighbour = (this.x + j + columns)% columns;
                yNeighbour = (this.y + i + rows) % rows;

                // discard the actual agent, i cant be mi own neighbor
                if( i != 0 || j != 0 ){
                    this.neighbour.push( table[yNeighbour][xNeighbour] );
                }

            }   
        }        
    }

    this.draw = function() {
        var color; 
        if( this.state == 1){
            color = white;
        }else{
            color = black;
        }

        context.fillStyle = color;
        context.fillRect(this.x*tileX,this.y*tileY , tileX,tileY);

    }

    this.newCycle = function() {
        var sum = 0;

        for(i = 0; i < this.neighbour.length;i++ ){
            sum += this.neighbour[i].state;
        }

        this.stateProx = this.state;

        if (sum < 2 || sum > 3){
            this.stateProx = 0;
        }

        if (sum == 3) {
            this.stateProx = 1;
        }
    }

    this.mutation = function(){
        this.state = this.stateProx 
    }
}

function initTable(obj) {
    
    var state;

    for ( y = 0; y < rows; y++) {
        for ( x = 0; x < columns; x++) {
            
            state = Math.floor(Math.random()*2);
            obj[y][x] = new Agent(x,y,state)
        }  
    }   

    for ( y = 0; y < rows; y++) {
        for ( x = 0; x < columns; x++) {
            
            obj[y][x].addNeighbour();
        }  
    }   
}

function init() {

    canvas = document.getElementById("window");
    context = canvas.getContext("2d");

    canvas.width = canvasX;
    canvas.height = canvasY;

    tileX =  Math.floor(canvasX/rows);
    tileY = Math.floor(canvasY/columns);

    table = createArray2d(rows,columns);

    initTable(table);

    setInterval(function() {principal(tileX, tileY);},1000/fps)
}

function drawTable(obj) {

    for ( y = 0; y < rows ; y++) {
        for ( x = 0; x < columns ; x++) {
            obj[y][x].draw();
        }
    }

    for ( y = 0; y < rows ; y++) {
        for ( x = 0; x < columns ; x++) {
            obj[y][x].newCycle();
        }
    }

    for ( y = 0; y < rows ; y++) {
        for ( x = 0; x < columns ; x++) {
         obj[y][x].mutation();
        }
}

}

function refreshCanvas() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

function principal() {

    refreshCanvas();
    drawTable(table);
}