import { useState, useEffect, useRef } from "react";

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([[8, 8]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState("RIGHT");
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);

  const gridSize = 20;
  const tileSize = 20;

  // Generar nueva comida aleatoria
  const generateFood = () => {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    setFood([x, y]);
  };

  // Dibujar juego en el canvas
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, gridSize * tileSize, gridSize * tileSize);

    // Dibujar culebra
    ctx.fillStyle = "lime";
    snake.forEach(([x, y]) => {
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });

    // Dibujar comida
    ctx.fillStyle = "red";
    ctx.fillRect(food[0] * tileSize, food[1] * tileSize, tileSize, tileSize);
  }, [snake, food]);

  // Movimiento de la culebra
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = [...newSnake[0]];

        if (direction === "UP") head[1] -= 1;
        if (direction === "DOWN") head[1] += 1;
        if (direction === "LEFT") head[0] -= 1;
        if (direction === "RIGHT") head[0] += 1;

        // Colisión con paredes
        if (
          head[0] < 0 ||
          head[1] < 0 ||
          head[0] >= gridSize ||
          head[1] >= gridSize
        ) {
          setIsRunning(false);
          alert("¡Game Over! Puntuación: " + score);
          return [[8, 8]];
        }

        // Colisión con sí mismo
        for (let i = 0; i < newSnake.length; i++) {
          if (newSnake[i][0] === head[0] && newSnake[i][1] === head[1]) {
            setIsRunning(false);
            alert("¡Game Over! Puntuación: " + score);
            return [[8, 8]];
          }
        }

        newSnake.unshift(head);

        // Comer comida
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore((prev) => prev + 1);
          generateFood();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [direction, isRunning]);

  // Controles con teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
      if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
      if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
      if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">🐍 Juego de la Culebrita</h1>
      <p className="mb-2">Puntuación: {score}</p>

      <canvas
        ref={canvasRef}
        width={gridSize * tileSize}
        height={gridSize * tileSize}
        className="border border-white mb-4"
      />

      <div className="flex gap-2">
        <button
          className="bg-white text-black px-4 py-2 rounded"
          onClick={() => setIsRunning(true)}
        >
          Iniciar
        </button>
        <button
          className="bg-white text-black px-4 py-2 rounded"
          onClick={() => setIsRunning(false)}
        >
          Pausar
        </button>
        <button
          className="bg-white text-black px-4 py-2 rounded"
          onClick={() => {
            setSnake([[8, 8]]);
            setScore(0);
            generateFood();
            setIsRunning(false);
          }}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
