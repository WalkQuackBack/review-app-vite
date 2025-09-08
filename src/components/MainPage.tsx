import { Button } from "./ui/button";
import { Settings } from "lucide-react";
// import "../styles/MainPage.css";
import { Page } from "./ui/Page";

interface MainPageProps {
  onStart: () => void;
  onStartFromWord: () => void;
  onEditWordList: () => void;
  onSettings: () => void;
}

export function MainPage({ onStart, onStartFromWord, onEditWordList, onSettings }: MainPageProps) {
  return (
    <Page className="main-page-container">
      {/* Settings button */}
      <Button
        onClick={onSettings}
        appearance="text"
        className="settings-button icon"
      >
        <Settings className="h-5 w-5" />
      </Button>
      
      <div className="main-page-actions">
        <div className="main-page-secondary-buttons">
          <Button
            onClick={onStartFromWord}
            appearance="tonal"
          >
            Start from word
          </Button>
          
          <Button
            onClick={onEditWordList}
            appearance="outlined"
          >
            Edit words
          </Button>
        </div>
        <Button
          onClick={onStart}
          appearance="primary"
          className="main-page-start-button"
        >
          Start playback
        </Button>
      </div>
    </Page>
  );
}
