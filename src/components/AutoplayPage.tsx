
import { useState, useEffect } from "react";
import { useSpeech } from "../hooks/useSpeech";
import { Button } from "./ui/button";
import { ResponsiveDialogOrDrawer } from "./ui/ResponsiveDialogOrDrawer";

interface AutoplayPageProps {
  words: string[];
  startIndex?: number;
  onBack: () => void;
}

export function AutoplayPage({ words, startIndex = 0, onBack }: AutoplayPageProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showActions, setShowActions] = useState(false);
  const { speakWord, stopSpeaking, isPlaying } = useSpeech();

  const playWordSequence = async (word: string, index: number) => {
    try {
      setShowActions(false);
      await speakWord(`You are on word ${currentIndex + 1} out of ${words.length}`, "en-US");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      for (let i = 0; i < 3; i++) {
        await speakWord(word);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
      setShowActions(true);
    } catch (error) {
      console.error(error);
      setShowActions(true);
    }
  };

  useEffect(() => {
    if (words.length > 0) {
      playWordSequence(words[currentIndex], currentIndex);
    }
  }, [currentIndex, words]);

  const handleRepeat = () => {
    playWordSequence(words[currentIndex], currentIndex);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="autoplay-page">
      <p>{isPlaying ? "Reading out words" : ""}</p>
      <ResponsiveDialogOrDrawer
        isOpen={showActions}
        onClose={() => setShowActions(false)}
        title="Actions"
        description="Pick an action to perform"
        actions={
          <>
            <Button onClick={handleRepeat}>Repeat</Button>
            <Button onClick={handlePrevious} disabled={currentIndex === 0}>
              Previous Word
            </Button>
            <Button onClick={handleNext} disabled={currentIndex === words.length - 1} appearance="primary">
              Next Word
            </Button>
          </>
        }
      />
    </div>
  );
}
