'use client';

import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const [numCups, setNumCups] = useState<number>(3);
  const [cups, setCups] = useState<number[]>([]);
  const [ballPosition, setBallPosition] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [showBall, setShowBall] = useState<boolean>(false);
  const [positions, setPositions] = useState<{ left: string; top: string }[]>([]);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<number>(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Easy');
  const [showGhost, setShowGhost] = useState<boolean>(false);

  const initializeGame = useCallback(() => {
    const initialPositions = Array.from({ length: numCups }, (_, i) => ({
      left: `${(i % 5) * 100}px`,
      top: `${Math.floor(i / 5) * 150}px`,
    }));
    setPositions(initialPositions);
    setBackgroundImages(Array(numCups).fill('url("/피카츄.png")'));
    setCups(Array.from({ length: numCups }, (_, i) => i));
    setBallPosition(null);
    setShowBall(false);
    setShowGhost(false);
    setMessage('');
    setIsShuffling(false);
  }, [numCups]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const shuffleCups = () => {
    // 새 게임을 시작할 때 모든 상태를 초기화하고 배경 이미지도 초기화
    initializeGame();
    setIsShuffling(true);

    const newBallPosition = Math.floor(Math.random() * numCups);
    setBallPosition(newBallPosition);

    setShowBall(true);

    setTimeout(() => {
      setShowBall(false);
      let shuffledCups = [...cups];
      const newPositions = [...positions];
      let count = 0;

      const interval = setInterval(() => {
        if (count >= difficulty) {
          clearInterval(interval);
          setIsShuffling(false);
          setMessage('Choose a cup!');
          return;
        }

        const randomIndex1 = Math.floor(Math.random() * numCups);
        const randomIndex2 = Math.floor(Math.random() * numCups);

        [shuffledCups[randomIndex1], shuffledCups[randomIndex2]] = [shuffledCups[randomIndex2], shuffledCups[randomIndex1]];
        [newPositions[randomIndex1], newPositions[randomIndex2]] = [newPositions[randomIndex2], newPositions[randomIndex1]];

        setPositions([...newPositions]);
        setCups([...shuffledCups]);

        count++;
      }, 200);
    }, 1000);
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
      setShowGhost(true);
    }
  };

  const handleDifficultyChange = (level: number, label: string) => {
    setDifficulty(level);
    setSelectedDifficulty(label);
  };

  const increaseCups = () => {
    if (numCups === 3) {
      setNumCups(5);
    } else if (numCups === 5) {
      setNumCups(10);
    }
  };

  const decreaseCups = () => {
    if (numCups === 10) {
      setNumCups(5);
    } else if (numCups === 5) {
      setNumCups(3);
    }
  };

  const continueGame = () => {
    setShowGhost(false); // 귀신 이미지를 숨기고 게임을 계속 진행할 수 있도록 설정
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
        position: 'relative',
      }}
    >
      <h1>몬스터볼에 들어가기 싫어하는 피카츄를 잡아라!!</h1>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleDifficultyChange(10, 'Easy')}
          disabled={isShuffling}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: selectedDifficulty === 'Easy' ? '#4CAF50' : '#ccc',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          쉬움
        </button>
        <button
          onClick={() => handleDifficultyChange(25, 'Medium')}
          disabled={isShuffling}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: selectedDifficulty === 'Medium' ? '#FF9800' : '#ccc',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          중간
        </button>
        <button
          onClick={() => handleDifficultyChange(50, 'Hard')}
          disabled={isShuffling}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: selectedDifficulty === 'Hard' ? '#F44336' : '#ccc',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          어려움
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={shuffleCups}
          disabled={isShuffling}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: '#2196F3',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          시작
        </button>
        <button
          onClick={increaseCups}
          disabled={numCups === 10}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: '#FFC107',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          숫자 증가
        </button>
        <button
          onClick={decreaseCups}
          disabled={numCups === 3}
          style={{
            padding: '10px 20px',
            margin: '5px',
            backgroundColor: '#9C27B0',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          숫자 감소
        </button>
      </div>
      <div
        style={{
          position: 'relative',
          width: '500px',
          height: '300px',
          marginTop: '20px',
        }}
      >
        {cups.map((cup, index) => (
          <div
            key={index}
            onClick={() => chooseCup(index)}
            style={{
              width: '80px', // 기본 크기
              height: '80px',
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
                  width: '30px',
                  height: '30px',
                  backgroundImage: 'url("/몬스터볼.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '25px',
                }}
              />
            )}
          </div>
        ))}
      </div>
      {showGhost && (
        <div
          onClick={continueGame} // 클릭 시 귀신 이미지만 제거하고 게임을 계속 진행
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundImage: 'url("/귀신.JPG")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1000,
            animation: 'popIn 0.3s forwards',
            cursor: 'pointer', // 클릭 가능하도록 설정
          }}
        />
      )}
      <p style={{ marginTop: '20px' }}>{message}</p>
      <style jsx>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 600px) {
          div[style*='width: 500px'] {
            width: 100%;
            height: auto;
          }

          div[style*='width: 80px'] {
            width: 50px;
            height: 50px;
          }

          div[style*='width: 30px'] {
            width: 20px;
            height: 20px;
          }

          button {
            width: 100%;
            margin-bottom: 10px;
            justify-content: center;
          }

          div[style*='display: flex'] {
            justify-content: center;
          }
        }

        @media (min-width: 601px) {
          div[style*='width: 500px'] {
            width: 650px;
            height: 400px;
          }

          div[style*='width: 80px'] {
            width: 100px;
            height: 100px;
          }

          div[style*='width: 30px'] {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
}
