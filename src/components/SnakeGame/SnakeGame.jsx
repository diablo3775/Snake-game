import React, { useEffect, useRef } from 'react'
import { useCallback } from 'react'
import { useState } from 'react'
import Food from '../Food/Food'
import Snake from '../Snake/Snake'
import './snake.css'

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const SnakeGame = () => {
  const [food, setFood] = useState(getRandomCoordinates())
  const [direction, setDirection] = useState('RIGHT')
  const [snakeDots, setSnakeDots] = useState([[0, 0], [2, 0], [4, 0], [6, 0], [8, 0]])
  const [speed] = useState(100)
  const [reset, setReset] = useState(true);
  const [currentScore, setCurrentScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [foodEatenTimestamp, setFoodEatenTimestamp] = useState(null)

  const checkIfEat = () => {
    let head = snakeDots[snakeDots.length - 1]
    if (head[0] === food[0] && head[1] === food[1]) {
      let currentTime = new Date().getTime()
      let timeElapsed = foodEatenTimestamp ? currentTime - foodEatenTimestamp : null
      let score = timeElapsed ? Math.round(2 / (timeElapsed / 1000)) : 1
      setCurrentScore(currentScore + 1 + score)
      if (currentScore + 1 + score > bestScore) {
        setBestScore(currentScore + 1 + score)
      }
      setFoodEatenTimestamp(currentTime)
      return true
    }
    return false
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFood(getRandomCoordinates());
    }, 50000);
    return () => clearInterval(intervalId);
  }, []);

  const checkIfOutside = () => {
    let head = snakeDots[snakeDots.length - 1]
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      onGameOver()
    }
  }

  const checkIfCollapsed = () => {
    let snake = [...snakeDots]
    let head = snake[snake.length - 1]

    snake.pop()
    snake.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver()
      }
    })
  }

  const onGameOver = () => {
    setCurrentScore(0)
    setSnakeDots([[0, 0], [2, 0], [4, 0], [6, 0], [8, 0]])
    setDirection(null)
    setReset(false)
    setGameOver(true)
  }

  const resetGame = () => {
    setCurrentScore(0)
    setBestScore(bestScore)
    setFood(getRandomCoordinates())
    setDirection('RIGHT')
    setSnakeDots([[0, 0], [2, 0], [4, 0], [6, 0], [8, 0]])
    setReset(true)
    setGameOver(false)
  }

  useEffect(() => {
    checkIfOutside()
    checkIfCollapsed()
    setTimeout(() => moveSnake(snakeDots, checkIfEat()), speed)
  }, [snakeDots])

  const moveSnake = useCallback(
    (snakeDots, eaten) => {
      let dots = [...snakeDots]
      let head = dots[dots.length - 1];
      switch (direction) {
        case 'RIGHT':
          head = [head[0] + 2, head[1]];
          break;
        case 'LEFT':
          head = [head[0] - 2, head[1]];
          break;
        case 'DOWN':
          head = [head[0], head[1] + 2];
          break;
        case 'UP':
          head = [head[0], head[1] - 2];
          break;

        default:
          break;
      }
      if (direction) {
        dots.push(head);

        eaten ? setFood(getRandomCoordinates()) : dots.shift();

        setSnakeDots([...dots]);
      }
    }, [direction]
  )

  useEffect(() => {
    const onKeyDown = (e) => {
      e = e || window.event
      switch (e.keyCode) {
        case 38:
          !['DOWN', 'UP'].includes(direction) && setDirection('UP')
          break
        case 40:
          !['DOWN', 'UP'].includes(direction) && setDirection('DOWN')
          break
        case 37:
          !['LEFT', 'RIGHT'].includes(direction) && setDirection('LEFT')
          break
        case 39:
          !['LEFT', 'RIGHT'].includes(direction) && setDirection('RIGHT')
          break

        default:
          break
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [direction, setDirection])

  return (
    <div>
      <h3>Current Score: {currentScore}</h3>
      <h3>Best Score: {bestScore}</h3>
      <div className='game-area'>
        <Snake snakeDots={snakeDots} />
        <Food dot={food} />
        <div>
          {gameOver ? <div>
            <p>Game Over!</p>
            <button onClick={() => resetGame()}>Play Again</button>
          </div> : null}
        </div>
      </div>
    </div>
  )
}

export default SnakeGame