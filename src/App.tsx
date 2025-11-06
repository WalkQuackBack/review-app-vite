
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { MainPage } from "./components/MainPage";
import { StudyPage } from "./components/StudyPage";
import { EditPage } from "./components/EditPage";
import { AutoplayPage } from "./components/AutoplayPage";
import { StartFromWordDrawer } from "./components/StartFromWordDrawer";
import { SettingsModal } from "./components/SettingsModal";
import type { DisplayMode } from "./components/SettingsModal";
import { useWordList } from "./hooks/useWordList";
import { useNavigation } from "./hooks/useNavigation";

export default function App() {
  const { words, handleUpdateWords } = useWordList();
  const {
    handleStart,
    handleStartFromWord,
    handleEditWordList,
    handleBackToMain,
    handleSelectStartWord,
    handleAutoplay,
  } = useNavigation();
  const [studyStartIndex, setStudyStartIndex] = useState(0);
  const [showStartFromWordDrawer, setShowStartFromWordDrawer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("pinyin-word");

  const onStart = () => {
    handleStart();
    setStudyStartIndex(0);
  };

  const onStartFromWord = () => {
    if (handleStartFromWord()) {
      setShowStartFromWordDrawer(true);
    }
  };

  const onSettings = () => {
    setShowSettings(true);
  };

  const onSelectStartWord = (index: number) => {
    setStudyStartIndex(index);
    handleSelectStartWord();
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              onStart={onStart}
              onStartFromWord={onStartFromWord}
              onEditWordList={handleEditWordList}
              onSettings={onSettings}
              onAutoplay={handleAutoplay}
              words={words}
              displayMode={displayMode}
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
              goToEditPage={handleEditWordList}
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
        <Route
          path="/autoplay"
          element={
            <AutoplayPage
              words={words}
              onBack={handleBackToMain}
            />
          }
        />
      </Routes>
      <StartFromWordDrawer
        isOpen={showStartFromWordDrawer}
        onClose={() => setShowStartFromWordDrawer(false)}
        words={words}
        onSelectWord={onSelectStartWord}
        goToEditPage={handleEditWordList}
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