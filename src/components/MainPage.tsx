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
        appearance="outlined"
        className="settings-button"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <div className="main-page-header">
        <h1 className="display-s">测试复习 Test Review</h1>
        <p className="body-m">通过语音朗读练习您的词汇 Practice Test through Text to Speech</p>
      </div>
      
      <div className="main-page-actions">
        <div className="main-page-secondary-buttons">
          <Button
            onClick={onStartFromWord}
            appearance="tonal"
          >
            从词开始 Start Originating from Word
          </Button>
          
          <Button
            onClick={onEditWordList}
            appearance="outlined"
          >
            编辑词汇列表 Change the Words
          </Button>
        </div>
        <Button
          onClick={onStart}
          appearance="primary"
          className="main-page-start-button"
        >
          开始 Start
        </Button>
      </div>
    </Page>
  );
}
