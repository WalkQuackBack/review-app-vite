

import { Button } from "./ui/button";
import { Page } from "./ui/Page";
import { pinyin } from 'pinyin-pro';
import type { DisplayMode } from "../components/SettingsModal";

interface MainPageProps {
  onStart: () => void;
  onStartFromWord: () => void;
  onEditWordList: () => void;
  onSettings: () => void;
  onAutoplay: () => void;
  words: string[];
  displayMode: DisplayMode;
}

export function MainPage({ onStart, onStartFromWord, onEditWordList, onSettings, onAutoplay, words, displayMode }: MainPageProps) {
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

  return (
    <Page className="main-page-container">
      <div className="main-page-word-list">
        {words.length === 0 ? (
          <p className="body-m">No words added yet</p>
        ) : (
          <ul>
            {words.map((word, index) => (
              <li key={index}>{getDisplayText(word)}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="main-page-actions">
        <div className="main-page-primary-buttons">
          <Button
            onClick={onAutoplay}
            size="l"
            appearance="primary"
          >
            Autoplay
          </Button>
          <Button
            onClick={onStart}
            size="l"
            appearance="tonal"
          >
            Manual
          </Button>
        </div>
        <div className="main-page-secondary-buttons">
          <Button
            onClick={onEditWordList}
            appearance="elevated"
          >
            Edit
          </Button>
          <Button
            onClick={onStartFromWord}
            appearance="tertiary"
          >
            Start from word
          </Button>
          <Button
            onClick={onSettings}
            appearance="elevated"
          >
            Settings
          </Button>
        </div>
      </div>
    </Page>
  );
}
