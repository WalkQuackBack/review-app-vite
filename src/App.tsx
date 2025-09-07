import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { MainPage } from "./components/MainPage";
import { StudyPage } from "./components/StudyPage";
import { EditPage } from "./components/EditPage";
import { StartFromWordDrawer } from "./components/StartFromWordDrawer";
import { SettingsModal } from "./components/SettingsModal";
import type { DisplayMode } from "./components/SettingsModal";

export default function App() {
  const [words, setWords] = useState<string[]>([]);
  const [studyStartIndex, setStudyStartIndex] = useState(0);
  const [showStartFromWordDrawer, setShowStartFromWordDrawer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("pinyin-word");

  const navigate = useNavigate();

  const handleStart = () => {
    if (words.length === 0) {
      navigate("/edit");
    } else {
      setStudyStartIndex(0);
      navigate("/study");
    }
  };

  const handleStartFromWord = () => {
    if (words.length === 0) {
      navigate("/edit");
    } else {
      setShowStartFromWordDrawer(true);
    }
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleSelectStartWord = (index: number) => {
    setStudyStartIndex(index);
    navigate("/study");
  };

  const handleEditWordList = () => {
    navigate("/edit");
  };

  const handleBackToMain = () => {
    navigate("/");
  };

  const handleUpdateWords = (newWords: string[]) => {
    setWords(newWords);
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              onStart={handleStart}
              onStartFromWord={handleStartFromWord}
              onEditWordList={handleEditWordList}
              onSettings={handleSettings}
            />
          }
        />
        <Route
          path="/study"
          element={
            <StudyPage
              words={words}
              startIndex={studyStartIndex}
              displayMode={displayMode}
              onBack={handleBackToMain}
            />
          }
        />
        <Route
          path="/edit"
          element={
            <EditPage
              words={words}
              onUpdateWords={handleUpdateWords}
              onBack={handleBackToMain}
            />
          }
        />
      </Routes>
      <StartFromWordDrawer
        isOpen={showStartFromWordDrawer}
        onClose={() => setShowStartFromWordDrawer(false)}
        words={words}
        onSelectWord={handleSelectStartWord}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
      />
    </>
  );
}