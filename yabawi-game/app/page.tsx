'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [numCups, setNumCups] = useState<number>(3);
  const [cups, setCups] = useState<number[]>(Array.from({ length: numCups }, (_, i) => i));
  const [ballPosition, setBallPosition] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [showBall, setShowBall] = useState<boolean>(false);
  const [showGhost, setShowGhost] = useState<boolean>(false); // 귀신 이미지 표시 여부
  const [positions, setPositions] = useState<{ left: string; top: string }[]>([]);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<number>(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Easy');

  useEffect(() => {
    const initialPositions = Array.from({ length: numCups }, (_, i) => ({
      left: `${120 + (i % 5) * 80}px`,
      top: `${Math.floor(i / 5) * 120}px`,
    }));
    setPositions(initialPositions);
    setBackgroundImages(Array(numCups).fill('url("/피카츄.png")'));
  }, [numCups]);

  const shuffleCups = () => {
    setMessage('');
    setIsShuffling(true);
    setShowBall(false);
    setShowGhost(false); // 게임 시작 시 귀신 이미지 숨김
    setBackgroundImages(Array(numCups).fill('url("/피카츄.png")')); // 피카츄 이미지로 초기화

    let initialBallPosition = Math.floor(Math.random() * numCups); // 초기 공의 위치 설정
    setBallPosition(initialBallPosition);

    setShowBall(true);

    setTimeout(() => {
      setShowBall(false);
      let shuffledCups = [...cups];
      let currentBallPosition = initialBallPosition; // 초기 공 위치 저장
      const newPositions = [...positions];
      let count = 0;

      const interval = setInterval(() => {
        if (count >= difficulty) {
          clearInterval(interval);
          setIsShuffling(false);
          setMessage('Choose a cup!');
          setBallPosition(currentBallPosition); // 섞인 후의 공 위치로 업데이트
          return;
        }

        const randomIndex1 = Math.floor(Math.random() * numCups);
        const randomIndex2 = Math.floor(Math.random() * numCups);

        // 피카츄 위치와 배열 순서 섞기
        [shuffledCups[randomIndex1], shuffledCups[randomIndex2]] = [shuffledCups[randomIndex2], shuffledCups[randomIndex1]];
        [newPositions[randomIndex1], newPositions[randomIndex2]] = [newPositions[randomIndex2], newPositions[randomIndex1]];

        // 공 위치도 함께 섞기 (공이 있는 컵을 추적)
        if (currentBallPosition === randomIndex1) {
          currentBallPosition = randomIndex2;
        } else if (currentBallPosition === randomIndex2) {
          currentBallPosition = randomIndex1;
        }

        // 새 위치 적용
        setPositions([...newPositions]);
        setCups([...shuffledCups]);

        // 섞는 횟수 랜덤화
        if (Math.random() > 0.5) {
          count += 2;
        } else {
          count += 1;
        }
      }, 150); // 더 빠르게 섞음
    }, 1000); // 1초 동안 공 위치를 보여줌
  };

  const chooseCup = (index: number) => {
    if (isShuffling || showGhost) return; // 섞는 중이거나 귀신이 보이는 동안 선택 불가

    if (index === ballPosition) {
      // 선택한 인덱스와 공 위치를 정확히 비교
      setMessage('You won!');
      setShowBall(false);
      setTimeout(() => {
        const newBackgroundImages = [...backgroundImages];
        newBackgroundImages[index] = 'url("/몬스터볼2.png")';
        setBackgroundImages(newBackgroundImages);
      }, 300);
    } else {
      setMessage('You lost! Try again.');
      setShowGhost(true); // 틀리면 귀신 이미지 표시
    }
  };

  const handleDifficultyChange = (level: number, label: string) => {
    setDifficulty(level);
    setSelectedDifficulty(label);
  };

  const handleGhostClick = () => {
    setShowGhost(false); // 귀신 이미지 클릭 시 숨김
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
    setShowGhost(false); // 게임 리셋 시 귀신 이미지 숨김
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
        overflow: 'hidden',
      }}
    >
      <h1>몬스터볼에 들어가기 싫은 피카츄를 잡아라!</h1>
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
          쉬움
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
          중간
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
          어려움
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
        시작
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
        레벨 증가
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
        레벨 감소
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
              width: '80px', // 크기 조정 (작게 만듦)
              height: '80px', // 크기 조정 (작게 만듦)
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
            {showBall && index === ballPosition && (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundImage: 'url("/몬스터볼.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'absolute',
                  bottom: '-20px',
                  left: '30px',
                }}
              />
            )}
          </div>
        ))}
        {showGhost && (
          <div
            onClick={handleGhostClick}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundImage: 'url("./귀신.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1000, // 귀신 이미지가 모든 요소 위에 표시되도록 함
              cursor: 'pointer',
              animation: 'popIn 0.1s ease', // 팍 튀어나오는 애니메이션 추가
            }}
          />
        )}
      </div>
      <p style={{ marginTop: '20px' }}>{message}</p>
      <style jsx>{`
        @keyframes popIn {
          0% {
            transform: scale(0.1);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
