import { pinyin } from 'pinyin-pro';
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Play, Square, SkipForward, SkipBack, ArrowLeft } from "lucide-react";
import type { DisplayMode } from "./SettingsModal";
import { Page } from "./ui/Page";

interface StudyPageProps {
  words: string[];
  startIndex?: number;
  displayMode: DisplayMode;
  onBack: () => void;
}

interface SwipeState {
  startX: number;
  currentX: number;
  isDragging: boolean;
}

export function StudyPage({ words, startIndex = 0, displayMode, onBack }: StudyPageProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [swipeState, setSwipeState] = useState<SwipeState | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    setSpeechSupported('speechSynthesis' in window);
  }, []);

  const currentWord = words[currentIndex];

  const getDisplayText = (word: string) => {
    const pinyinResult = pinyin(word, { toneType: 'symbol', type: 'array' }).join(' ');

    switch (displayMode) {
      case "pinyin-word":
        return `${pinyinResult} / ${word}`;
      case "pinyin-only":
        return pinyinResult;
      case "word-only":
        return word;
      default:
        return word;
    }
  };

  const speakWord = () => {
    if (!speechSupported || !currentWord) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    setIsLoading(true);
    
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.rate = 0.8;
    utterance.volume = 1;
    utterance.lang = 'zh-CN';
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const nextWord = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, words.length - 1));
    stopSpeaking();
  };

  const previousWord = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    stopSpeaking();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeState({
      startX: e.touches[0].clientX,
      currentX: e.touches[0].clientX,
      isDragging: false,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeState) return;
    setSwipeState({
      ...swipeState,
      currentX: e.touches[0].clientX,
      isDragging: true,
    });
  };

  const handleTouchEnd = () => {
    if (!swipeState || !carouselRef.current) return;

    const deltaX = swipeState.currentX - swipeState.startX;
    const cardWidth = carouselRef.current.offsetWidth; // Assuming all cards have the same width as the container
    const swipeThreshold = cardWidth * 0.1; // Swipe 10% of card width to trigger navigation

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0) { // Swiped left
        nextWord();
      } else { // Swiped right
        previousWord();
      }
    }
    setSwipeState(null);
  };

  const getCarouselTransform = () => {
    let transformX = -currentIndex * 100; // Base transform for current card

    if (swipeState?.isDragging) {
      const deltaX = swipeState.currentX - swipeState.startX;
      const cardWidth = carouselRef.current ? carouselRef.current.offsetWidth : 0;
      if (cardWidth > 0) {
        transformX += (deltaX / cardWidth) * 100; // Add swipe offset as percentage
      }
    }
    return `translateX(${transformX}%)`;
  };

  if (words.length === 0) {
    return (
      <Page className="study-page-container">
        <div className="study-page-word-card-container">
          <Card className="study-page-word-card" interactable={false}>
            <CardContent className="card-content">
              <p className="body-m">暂无词汇可供学习</p>
              <Button onClick={onBack} appearance="outlined">
                返回
              </Button>
            </CardContent>
          </Card>
        </div>
      </Page>
    );
  }

  return (
    <Page className="study-page-container">
      {/* Header */}
      <div className="study-page-header">
        <Button onClick={onBack} appearance="elevated" className="study-page-back-button">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="study-page-header-text">
          {currentIndex + 1} of {words.length}
        </div>
      </div>

      {/* Word Display - Carousel */}
      <div className="study-page-word-display">
        <div 
          ref={carouselRef}
          className="study-page-carousel-container"
          style={{
            transform: getCarouselTransform(),
            transition: swipeState?.isDragging ? 'none' : 'transform 0.3s ease',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {words.map((word, index) => (
            <div className="study-page-word-card-container">
              <Card 
                key={index}
                interactable={false}
                className="study-page-word-card"
              >
                <CardContent className="card-content">
                  <div className="study-page-word-text display-s">{getDisplayText(word)}</div>
                  
                  {!speechSupported && (
                    <p className="body-m">
                    此浏览器不支持语音朗读
                  </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={isPlaying ? stopSpeaking : speakWord}
        disabled={isLoading}
        appearance="primary"
        className={"study-page-play-button " + (isPlaying ? 'playing' : '')}
        
        disabled={!speechSupported}
      >
        {isPlaying ? (
          <Square className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 ml-1" />
        )}
      </Button>

      {/* Navigation Controls */}
      <div className="study-page-navigation-controls">
        <Button
          onClick={previousWord}
          disabled={currentIndex === 0}
          appearance="tonal"
          className="study-page-nav-button"
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={nextWord}
          disabled={currentIndex === words.length - 1}
          appearance="tonal"
          className="study-page-nav-button"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </Page>
  );
}
