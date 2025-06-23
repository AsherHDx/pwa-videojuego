import { useEffect, useState } from "react";

const BOARD_SIZE = 10; // 10x10 grid

const initialPlayer = { x: 0, y: 0, vida: 100, nivel:1 };

let enemies = [[1,1],[2,2],[3,3],[4,4],[5,5]];

let isInEnemy = false;

export default function App() {
  const [player, setPlayer] = useState(initialPlayer);
  const [statusVisible, setStatusVisible] = useState(false);

  // Movement handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      let { x, y, vida, nivel } = player;
      switch (e.key.toLowerCase()) {
        case "w":
          if (y > 0) y--;
          break;
        case "s":
          if (y < BOARD_SIZE - 1) y++;
          break;
        case "a":
          if (x > 0) x--;
          break;
        case "d":
          if (x < BOARD_SIZE - 1) x++;
          break;
        case "enter":
          for(let [xEnemy,yEnemy] of enemies){
            console.log(`xEnemy: ${xEnemy}, yEnemy: ${yEnemy}`)
            console.log(`xPlayer: ${x+1}, yPlayer: ${y+1}`)
            if((x+1)==xEnemy && (y+1)==yEnemy){
              isInEnemy = true;
              vida-=20;
              nivel++;
              alert(`¡Atacaste la casilla (${y+1}, ${x+1}). Has derrotado al enemigo. 
                Tus nuevos status son: vida=${player.vida-20}, nivel=${player.nivel+1}`);
              break;
            }
          }

          if(!isInEnemy){
            alert(`¡Atacaste la casilla (${y+1}, ${x+1})!`);
          }

          break;
        case "e":
          setStatusVisible((prev) => !prev);
          return;
        default:
          return;
      }
      setPlayer({ x, y, vida, nivel });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player]);

  // Attack handler
  /*const handleCellAttack = (e, x, y) => {
    if(e.key === 'Enter'){
      alert(`¡Atacaste la casilla (${x+1}, ${y+1})!`);
    }
  };*/

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-2xl mb-4">Simulación de Juego</h1>

      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 40px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 40px)`,
        }}
      >
        {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, idx) => {
          const x = idx % BOARD_SIZE;
          const y = Math.floor(idx / BOARD_SIZE);
          const isPlayer = player.x === x && player.y === y;

          return (
            <div
              key={idx}
              //tabIndex={0}
              //onKeyDown={(e) => handleCellAttack(e,x,y)}
              className={`w-10 h-10 flex items-center justify-center border border-gray-500 cursor-pointer transition-all duration-100 ${
                isPlayer ? "bg-green-500" : "bg-gray-700"
              }`}
            >
              {isPlayer && "P"}
            </div>
          );
        })}
      </div>

      {statusVisible && (
        <div className="mt-4 p-4 bg-gray-800 rounded-xl shadow-xl">
          <h2 className="text-xl font-bold mb-2">Estatus del Jugador</h2>
          <p>Posición: ({player.x}, {player.y})</p>
          <p>Salud: {player.vida}</p>
          <p>Nivel: {player.nivel}</p>
        </div>
      )}
    </div>
  );
}