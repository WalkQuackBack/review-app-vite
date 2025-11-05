
import { pinyin } from 'pinyin-pro';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Play, Square, SkipForward, SkipBack, ArrowLeft } from "lucide-react";
import type { DisplayMode } from "./SettingsModal";
import { Page } from "./ui/Page";
import { useSpeech } from "../hooks/useSpeech";
import { useCarousel } from "../hooks/useCarousel";

interface StudyPageProps {
  words: string[];
  startIndex?: number;
  displayMode: DisplayMode;
  onBack: () => void;
}

export function StudyPage({ words, startIndex = 0, displayMode, onBack }: StudyPageProps) {
  const { isPlaying, isLoading, speechSupported, speakWord, stopSpeaking } = useSpeech();
  const {
    currentIndex,
    carouselRef,
    nextItem,
    previousItem,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getCarouselTransform,
    isDragging,
  } = useCarousel(words.length, startIndex);


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

  const handlePlayPause = () => {
    if (isPlaying) {
      stopSpeaking();
    } else {
      speakWord(currentWord);
    }
  };

  const nextWord = () => {
    nextItem();
    stopSpeaking();
  };

  const previousWord = () => {
    previousItem();
    stopSpeaking();
  };

  if (words.length === 0) {
    return (
      <Page className="study-page-container">
        <div className="study-page-word-card-container">
          <Card className="study-page-word-card" interactable={false}>
            <CardContent className="card-content">
              <p className="body-m">There are currently no words to learn</p>
              <Button onClick={onBack} appearance="outlined">
                Return
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
        <Button onClick={onBack} appearance="elevated" className="study-page-back-button icon">
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
            transition: isDragging ? 'none' : 'transform 750ms cubic-bezier(0.27, 1.06, 0.18, 1.00)',
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
                    This browser does not support speech reading
                  </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={handlePlayPause}
        appearance="primary"
        size='l'
        className={"study-page-play-button " + (isPlaying ? 'playing' : '') + (isLoading ? 'loading' : '')}
        
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
          size='m'
          className="study-page-nav-button"
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={nextWord}
          disabled={currentIndex === words.length - 1}
          appearance="tonal"
          size='m'
          className="study-page-nav-button"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </Page>
  );
}
