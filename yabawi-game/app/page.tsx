'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [numCups, setNumCups] = useState<number>(3);
  const [cups, setCups] = useState<number[]>(Array.from({ length: numCups }, (_, i) => i));
  const [ballPosition, setBallPosition] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [showBall, setShowBall] = useState<boolean>(false);
  const [positions, setPositions] = useState<{ left: string; top: string }[]>([]);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<number>(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Easy');

  useEffect(() => {
    const initialPositions = Array.from({ length: numCups }, (_, i) => ({
      left: `${130 + (i % 5) * 70}px`,
      top: `${Math.floor(i / 5) * 150}px`,
    }));
    setPositions(initialPositions);
    setBackgroundImages(Array(numCups).fill('url("/피카츄.png")'));
  }, [numCups]);

  const shuffleCups = () => {
    setMessage('');
    setIsShuffling(true);
    setShowBall(false);
    setBackgroundImages(Array(numCups).fill('url("/피카츄.png")')); // 피카츄 이미지로 초기화

    let newBallPosition = Math.floor(Math.random() * numCups);
    setBallPosition(newBallPosition);

    setShowBall(true);

    setTimeout(() => {
      setShowBall(false);
      let shuffledCups = [...cups];
      let currentBallPosition = newBallPosition; // 초기 위치 저장
      const newPositions = [...positions];
      let count = 0;

      const interval = setInterval(() => {
        if (count >= difficulty) {
          clearInterval(interval);
          setIsShuffling(false);
          setMessage('Choose a cup!');
          setBallPosition(currentBallPosition); // 섞인 후의 위치로 업데이트
          return;
        }

        const randomIndex1 = Math.floor(Math.random() * numCups);
        const randomIndex2 = Math.floor(Math.random() * numCups);

        // 피카츄 위치와 배열 순서 섞기
        [shuffledCups[randomIndex1], shuffledCups[randomIndex2]] = [shuffledCups[randomIndex2], shuffledCups[randomIndex1]];
        [newPositions[randomIndex1], newPositions[randomIndex2]] = [newPositions[randomIndex2], newPositions[randomIndex1]];

        // 공 위치도 함께 섞기
        if (currentBallPosition === randomIndex1) {
          currentBallPosition = randomIndex2;
        } else if (currentBallPosition === randomIndex2) {
          currentBallPosition = randomIndex1;
        }

        // 새 위치 적용
        setPositions([...newPositions]);
        setCups([...shuffledCups]);

        count++;
      }, 200); // 0.2초마다 컵의 위치를 바꿈
    }, 1000); // 1초 동안 공 위치를 보여줌
  };

  const chooseCup = (index: number) => {
    if (isShuffling) return;

    if (cups[index] === ballPosition) {
      setMessage('You won!');
      setShowBall(false);
      setTimeout(() => {
        const newBackgroundImages = [...backgroundImages];
        newBackgroundImages[index] = 'url("/몬스터볼2.png")';
        setBackgroundImages(newBackgroundImages);
      }, 300);
    } else {
      setMessage('You lost! Try again.');
    }
  };

  const handleDifficultyChange = (level: number, label: string) => {
    setDifficulty(level);
    setSelectedDifficulty(label);
  };

  const increaseCups = () => {
    if (numCups === 3) {
      setNumCups(5);
      resetGame(5);
    } else if (numCups === 5) {
      setNumCups(10);
      resetGame(10);
    }
  };

  const decreaseCups = () => {
    if (numCups === 10) {
      setNumCups(5);
      resetGame(5);
    } else if (numCups === 5) {
      setNumCups(3);
      resetGame(3);
    }
  };

  const resetGame = (newNumCups: number) => {
    setCups(Array.from({ length: newNumCups }, (_, i) => i));
    setPositions(
      Array.from({ length: newNumCups }, (_, i) => ({
        left: `${(i % 5) * 130}px`,
        top: `${Math.floor(i / 5) * 180}px`,
      }))
    );
    setBackgroundImages(Array(newNumCups).fill('url("/피카츄.png")'));
    setBallPosition(null);
    setMessage('');
    setShowBall(false);
    setIsShuffling(false);
  };

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '50px',
        color: 'white',
        backgroundImage: 'url("/지우.png")',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1>Yabawi Game</h1>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => handleDifficultyChange(10, 'Easy')}
          disabled={isShuffling}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: selectedDifficulty === 'Easy' ? '#4CAF50' : '#ccc',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Easy
        </button>
        <button
          onClick={() => handleDifficultyChange(25, 'Medium')}
          disabled={isShuffling}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: selectedDifficulty === 'Medium' ? '#FF9800' : '#ccc',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Medium
        </button>
        <button
          onClick={() => handleDifficultyChange(50, 'Hard')}
          disabled={isShuffling}
          style={{
            padding: '10px 20px',
            backgroundColor: selectedDifficulty === 'Hard' ? '#F44336' : '#ccc',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Hard
        </button>
      </div>
      <button
        onClick={shuffleCups}
        disabled={isShuffling}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#2196F3',
          border: 'none',
          borderRadius: '5px',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Start Game
      </button>
      <button
        onClick={increaseCups}
        disabled={numCups === 10}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#FFC107',
          border: 'none',
          borderRadius: '5px',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Next Level
      </button>
      <button
        onClick={decreaseCups}
        disabled={numCups === 3}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#9C27B0',
          border: 'none',
          borderRadius: '5px',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Previous Level
      </button>
      <div
        style={{
          position: 'relative',
          width: '650px',
          height: '400px',
          marginTop: '20px',
        }}
      >
        {cups.map((cup, index) => (
          <div
            key={index}
            onClick={() => chooseCup(index)}
            style={{
              width: '70px',
              height: '70px',
              cursor: 'pointer',
              position: 'absolute',
              left: positions[index]?.left,
              top: positions[index]?.top,
              backgroundImage: backgroundImages[index],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'left 0.2s ease, top 0.2s ease',
            }}
          >
            {showBall && cups[index] === ballPosition && (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundImage: 'url("/몬스터볼.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'absolute',
                  bottom: '-20px',
                  left: '40px',
                }}
              />
            )}
          </div>
        ))}
      </div>
      <p style={{ marginTop: '20px' }}>{message}</p>
    </div>
  );
}
