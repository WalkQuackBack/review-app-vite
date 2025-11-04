
import { useState, useEffect } from "react";

export function useWordList() {
  const [words, setWords] = useState<string[]>(() => {
    try {
      const storedWords = localStorage.getItem("wordList");
      return storedWords ? JSON.parse(storedWords) : [];
    } catch (error) {
      console.error("Failed to parse stored word list:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("wordList", JSON.stringify(words));
    } catch (error) {
      console.error("Failed to save word list to local storage:", error);
    }
  }, [words]);

  const handleUpdateWords = (newWords: string[]) => {
    setWords(newWords);
  };

  return { words, handleUpdateWords };
}
