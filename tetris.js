const kanvas = document.getElementById("tetris");
const kontekst = kanvas.getContext("2d");
const bodoviElement = document.getElementById("bodovi");
const RED = 30;
const KOL = KOLONA = 15;
const KV = velicinaKvadrata = 25;
const PRAZNOPOLJE = "WHITE";






function drawSquare(x,y,boja){
    kontekst.fillStyle = boja;
    kontekst.fillRect(x*KV,y*KV,KV,KV);

    kontekst.strokeStyle = "BLACK";
    kontekst.strokeRect(x*KV,y*KV,KV,KV);
}




let tabla = [];
for( r = 0; r <RED; r++){
    tabla[r] = [];
    for(k = 0; k < KOL; k++){
        tabla[r][k] = PRAZNOPOLJE;
    }
}





function drawTabla(){
    for( r = 0; r <RED; r++){
        for(k = 0; k < KOL; k++){
            drawSquare(k,r,tabla[r][k]);
        }
    }
}


drawTabla();



const TETROMINI = [

    [I,"aqua"],
    [J,"blue"]
    [L,"orange"],
    [O,"yellow"],
    [S,"green"],
    [T,"purple"],
    [Z,"red"],
    
];



function randomTetrada(){
    let r = randomN = Math.floor(Math.random() * TETROMINI.length) 
    return new Tetrada( TETROMINI[r][0],TETROMINI[r][1]);
}



let p = randomTetrada();





function Tetrada(tetrada,boja){
    this.tetrada = tetrada;
    this.boja = boja;
    this.tetradaN = 0; 
    this.activeTetrada = this.tetrada[this.tetradaN];
    this.x = 3;
    this.y = -2;
}




Tetrada.prototype.fill = function(boja){

    for( r = 0; r < this.activeTetrada.length; r++){

        for(k = 0; k < this.activeTetrada.length; k++){

            if( this.activeTetrada[r][k]){

                drawSquare(this.x + k,this.y + r, boja);

            }

        }
        
    }

}


Tetrada.prototype.draw = function(){

    this.fill(this.boja);

}



Tetrada.prototype.unDraw = function(){

    this.fill(PRAZNOPOLJE);

}



Tetrada.prototype.idiDole = function(){

    if(!this.collision(0,1,this.activeTetrada)){

        this.unDraw();
        this.y++;
        this.draw();

    }else{

        this.lock();
        p = randomTetrada();

    }
    
}


Tetrada.prototype.idiDesno = function(){

    if(!this.collision(1,0,this.activeTetrada)){

        this.unDraw();
        this.x++;
        this.draw();

    }
}

Tetrada.prototype.idiLijevo = function(){

    if(!this.collision(-1,0,this.activeTetrada)){

        this.unDraw();
        this.x--;
        this.draw();

    }

}


Tetrada.prototype.rotiraj = function(){

    let nextPattern = this.tetrada[(this.tetradaN + 1)%this.tetrada.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){

        if(this.x > KOL/2){
          
            kick = -1; 
        }else{
          
            kick = 1; 
        }

    }
    
    if(!this.collision(kick,0,nextPattern)){

        this.unDraw();
        this.x += kick;
        this.tetradaN = (this.tetradaN + 1)%this.tetrada.length; 
        this.activeTetrada = this.tetrada[this.tetradaN];
        this.draw();

    }
}

let bodovi = 0;

Tetrada.prototype.lock = function(){
    for( r = 0; r < this.activeTetrada.length; r++){

        for(k = 0; k < this.activeTetrada.length; k++){

        
            if( !this.activeTetrada[r][k]){
                continue;
            }
            
            if(this.y + r < 0){
                alert("Izgubili ste");
                
                krajIgre = true;
                break;
            }
            
            tabla[this.y+r][this.x+k] = this.boja;
        }

    }
    



    for(r = 0; r < RED; r++){

        let isRowFull = true;
        for( k = 0; k < KOL; k++){

            isRowFull = isRowFull && (tabla[r][k] != PRAZNOPOLJE);

        }
        if(isRowFull){
            
            for( y = r; y > 1; y--){

                for( k = 0; k < KOL; k++){
                    tabla[y][k] = tabla[y-1][k];
                }

            }

            for( k = 0; k < KOL; k++){
                tabla[0][k] = PRAZNOPOLJE;
            }

            bodovi += 10;
        }

    }
    
    drawTabla();
    

    bodoviElement.innerHTML = bodovi;
}



Tetrada.prototype.collision = function(x,y,piece){

    for( r = 0; r < piece.length; r++){
        for(k = 0; k < piece.length; k++){
            
            if(!piece[r][k]){
                continue;
            }

            let newX = this.x + k + x;
            let newY = this.y + r + y;
            
            if(newX < 0 || newX >= KOL || newY >= RED){
                return true;
            }
            
            if(newY < 0){
                continue;
            }
            
            if( tabla[newY][newX] != PRAZNOPOLJE){
                return true;
            }

        }

    }
    return false;

}


document.addEventListener("keydown",CONTROL);


function CONTROL(event){

    if(event.keyCode == 37){
        p.idiLijevo();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotiraj();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.idiDesno();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.idiDole();
    }

}


let dropStart = Date.now();
let krajIgre = false;

function drop(){

    let now = Date.now();
    let delta = now - dropStart;
    
    if(delta > 1000){
        p.idiDole();
        dropStart = Date.now();
    }
    if( !krajIgre){
        requestAnimationFrame(drop);
    }

}

drop();

