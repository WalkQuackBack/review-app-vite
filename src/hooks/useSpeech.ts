
import { useState, useEffect } from "react";

export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    setSpeechSupported("speechSynthesis" in window);
  }, []);

  const speakWord = (word: string, lang: string = "zh-CN") => {
    return new Promise<void>((resolve, reject) => {
      if (!speechSupported || !word) {
        reject("Speech synthesis not supported or word is empty");
        return;
      }

      window.speechSynthesis.cancel();

      setIsLoading(true);

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.volume = 1;
      utterance.lang = lang;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      utterance.onend = () => {
        setIsPlaying(false);
        resolve();
      };
      utterance.onerror = (event) => {
        setIsPlaying(false);
        reject(event.error);
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return { isPlaying, isLoading, speechSupported, speakWord, stopSpeaking };
}
