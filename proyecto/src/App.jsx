import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([[8, 8]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState("RIGHT");
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);

  const gridSize = 20;
  const tileSize = 20;

  const generateFood = () => {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    setFood([x, y]);
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, gridSize * tileSize, gridSize * tileSize);

    ctx.fillStyle = "lime";
    snake.forEach(([x, y]) => {
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food[0] * tileSize, food[1] * tileSize, tileSize, tileSize);
  }, [snake, food]);

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

        if (head[0] < 0 || head[1] < 0 || head[0] >= gridSize || head[1] >= gridSize) {
          setIsRunning(false);
          alert("¡Game Over! Puntuación: " + score);
          return [[8, 8]];
        }

        for (let i = 0; i < newSnake.length; i++) {
          if (newSnake[i][0] === head[0] && newSnake[i][1] === head[1]) {
            setIsRunning(false);
            alert("¡Game Over! Puntuación: " + score);
            return [[8, 8]];
          }
        }

        newSnake.unshift(head);

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
    <div className="container">
      <h1>🐍 Juego de la Culebrita</h1>
      <p>Puntuación: {score}</p>

      <canvas
        ref={canvasRef}
        width={gridSize * tileSize}
        height={gridSize * tileSize}
      />

      <div className="buttons">
        <button onClick={() => setIsRunning(true)}>Iniciar</button>
        <button onClick={() => setIsRunning(false)}>Pausar</button>
        <button
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

      {/* Controles táctiles */}
      <div className="controls">
        <button onClick={() => direction !== "DOWN" && setDirection("UP")}>⬆️</button>
        <div>
          <button onClick={() => direction !== "RIGHT" && setDirection("LEFT")}>⬅️</button>
          <button onClick={() => direction !== "LEFT" && setDirection("RIGHT")}>➡️</button>
        </div>
        <button onClick={() => direction !== "UP" && setDirection("DOWN")}>⬇️</button>
      </div>
    </div>
  );
}
