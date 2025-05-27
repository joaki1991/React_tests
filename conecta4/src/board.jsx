import { useState } from "react";
import confetti from 'canvas-confetti';
import { Dialog, DialogContent, DialogTitle} from '@mui/material';

// Primero defino en dos variables las filas y las columnas del tablero
const ROWS = 6; 
const COLS = 7;
// Defino otra variable para las casillas vacias, la cual estableceré por ejemplo en null por defecto
const EMPTY = null;
// Defino las variables para los jugadores, que serán el 1 y el 2, con sus respectivos colores
// En este caso el jugador 1 será el rojo y el jugador 2 será el amarillo
const PLAYER_1 = "rojo";
const PLAYER_2 = "amarillo";

// Creamos el componente tablero de nuestro juego
const Board = () => {
    
    // Ahora con el useState puedo definir el tablero vacio
    // Este se va a consistir en un array vacio de x filas, teneindo cada una de estas filas un array vacio de y columnas
    const [board, setBoard] = useState(Array(ROWS).fill().map(()=>Array(COLS).fill(EMPTY))); // Las columnas de cada fila las relleno con null
    // También tengo que definir el estado del jugador actual, que por defecto será el jugador 1
    const [currentPlayer, setCurrentPlayer] = useState(PLAYER_1);
    // Por último tendré que definir el estado de la partida, que por defecto será false y si se hace true significará que la partida ha terminado
    const [gameOver, setGameOver] = useState(false);
    
    // Creo una función para renderizar el tablero
    function renderBoard(){
        return(
            // Creo un div con clase tablero para almacenar las casillas
            <div className="board">
            {board.map((row, rowIndex)=>(
                // Creo un div para cada una de las filas que disponemos
                <div key={rowIndex} className="row">
                    {row.map((cell, colIndex)=>(
                        // Y dentro de este div fila, creo un div para cada columna-casilla con la clase cell, seguida del numero de columna
                        <div key={colIndex} className={"cell "+(cell === PLAYER_1 ? 'red': (cell === PLAYER_2 ? 'yellow' : null))} onClick={()=>handleClick(colIndex)}></div>
                    ))}
                </div>
            )
            )}
            </div>
        );
    }

    // Cuando hagamos click en cada una de las casillas, tendremos que colorear la casilla de mas abajo del tablero que corresponda con esta columna y esté vacia
    function handleClick(colIndex){
        // Si la partida ha terminado, no hacemos nada
        if(gameOver) return;
        // Si no, primero tendremos que encontrar la primera fila vacia de la columna que hemos clicado
        // Para ello, recorro el tablero desde la fila de abajo hacia arriba con un for
        for(let row=ROWS-1; row>=0; row--){
            // Si la fila está vacia, entonces la rellenamos con el color del jugador actual
            if(board[row][colIndex]===EMPTY){               
                const newBoard = [...board]; // Hago una copia del tablero
                newBoard[row][colIndex] = currentPlayer; // Relleno la casilla con el color del jugador actual
                setBoard(newBoard); // Actualizo el tablero                
                // Chequeo si el jugador actual ha ganado
                if(checkWin(newBoard, row, colIndex, currentPlayer)){
                    setGameOver(true); // Si ha ganado, actualizo el estado de la partida a true y muestro confetti  
                    confetti();                                                
                    renderDialog(); // Muestro el dialogo de victoria
                    return; // Salgo de la función para que no siga buscando filas vacias en la columna                  
                }else{
                    // Si no ha ganado, chequeo si el tablero está lleno y por tanto hay empate
                    if(checkDraw(newBoard)){
                        setGameOver(true); // Si el tablero está lleno, actualizo el estado de la partida a true
                        alert("El juego ha terminado en empate!"); // Muestro un mensaje de alerta
                    }else{      
                        // Si no ha ganado ni está lleno, cambio el jugador actual                 
                        setCurrentPlayer(currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1); 
                    }
                    return; // Salgo de la función para que no siga buscando filas vacias en la columna
                }
                             
            }
        }
    }

    // Defino la función que muestra el dialogo de victoria
    function renderDialog(){
        return(
            <Dialog open={gameOver}>
                <DialogTitle>¡Victoria!</DialogTitle>
                <DialogContent>
                    <p>{currentPlayer === PLAYER_1 ? "El jugador "+PLAYER_1+" ha ganado!" : "El jugador "+PLAYER_2+" ha ganado!"}</p>
                    <button onClick={resetBoard}>Cerrar</button>
                </DialogContent>
            </Dialog>
        );
    }
    

    // Por ultimo voy a definir las funciones que chequean si el jugador ha ganado o si el tablero está lleno
    function checkWin(board, row, col, player) {
        // Definir las direcciones de las líneas (horizontal, vertical, diagonal)
        const directions = [
            [[0, 1], [0, -1]], // Horizontal
            [[1, 0], [-1, 0]], // Vertical
            [[1, 1], [-1, -1]], // Diagonal /
            [[1, -1], [-1, 1]], // Diagonal \
        ];
    
        for (const direction of directions) {
            let count = 1;
    
            // Revisar en una dirección
            for (const [dr, dc] of direction) {
                let r = row + dr;
                let c = col + dc;
                while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                    count++;
                    r += dr;
                    c += dc;
                }
            }
    
            if (count >= 4) return true;
        }
    
        return false;
    }

    function checkDraw(board){
        // Recorro el tablero y si hay alguna casilla vacia, devuelvo false
        for(let row of board){
            if(row.includes(EMPTY)){
                return false; // Si hay una casilla vacia, devuelvo false
            }
        }
        return true; // Si no hay casillas vacias, devuelvo true
    }

    //Por último voy a crear una funcion para establecer el estado del tablero a su estado inicial, es decir, vacio
    function resetBoard(){
        setBoard(Array(ROWS).fill().map(()=>Array(COLS).fill(EMPTY))); // Relleno el tablero con null
        setCurrentPlayer(PLAYER_1); // Establezco el jugador actual a 1
        setGameOver(false); // Establezco el estado de la partida a false
    }

    return(
        <div className="game-container">
            <h1>Conecta 4</h1>
            <button onClick={resetBoard}>Reiniciar Juego</button>
            {renderBoard()}
            {renderDialog()} 
            <div>
                Jugador Actual: {currentPlayer}
            </div>
        </div>
    );
}

export default Board;