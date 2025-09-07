import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check } from "lucide-react";
import { ResponsiveDialogOrDrawer } from "./ui/ResponsiveDialogOrDrawer";

export type DisplayMode = "pinyin-word" | "pinyin-only" | "word-only";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
}

const displayModeOptions = [
  {
    id: "pinyin-word" as const,
    title: "拼音和汉字",
    description: "同时显示拼音和汉字",
    example: "nǐ hǎo / 你好"
  },
  {
    id: "pinyin-only" as const,
    title: "仅拼音",
    description: "仅显示拼音",
    example: "nǐ hǎo"
  },
  {
    id: "word-only" as const,
    title: "仅汉字",
    description: "仅显示汉字",
    example: "你好"
  }
];

export function SettingsModal({ isOpen, onClose, displayMode, onDisplayModeChange }: SettingsModalProps) {
  const handleModeSelect = (mode: DisplayMode) => {
    onDisplayModeChange(mode);
  };

  const displayModeContent = (
    <div className="settings-modal-display-mode-section">
      <div className="settings-modal-display-mode-title">Display Mode</div>
      <div className="settings-modal-display-mode-options">
        {displayModeOptions.map((option) => (
          <Card
            key={option.id}
            interactable={true}
            className={`settings-modal-option-card ${displayMode === option.id ? 'selected' : ''}`}
            onClick={() => handleModeSelect(option.id)}
          >
            <CardContent className="card-content">
              <div className="settings-modal-option-content">
                <div className="settings-modal-option-title-row">
                  <span className="settings-modal-option-title">{option.title}</span>
                  <Check style={displayMode !== option.id && {opacity: 0} || {opacity: 1}} className="settings-modal-option-check-icon" />
                </div>
                <p className="settings-modal-option-description">
                  {option.description}
                </p>
                <div className="settings-modal-option-example">
                  {option.example}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <ResponsiveDialogOrDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="设置"
      description="自定义学习会话中汉字显示方式。"
      actions={
        <Button onClick={onClose} appearance="primary">
          完成
        </Button>
      }
    >
      {displayModeContent}
    </ResponsiveDialogOrDrawer>
  );
}