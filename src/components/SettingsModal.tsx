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
    title: "Pinyin and Word",
    description: "Display both Pinyin and Word",
    example: "nǐ hǎo / 你好"
  },
  {
    id: "pinyin-only" as const,
    title: "Only Pinyin",
    description: "Only show Pinyin",
    example: "nǐ hǎo"
  },
  {
    id: "word-only" as const,
    title: "Only Word",
    description: "Only show Word",
    example: "你好"
  }
];

export function SettingsModal({ isOpen, onClose, displayMode, onDisplayModeChange }: SettingsModalProps) {
  const handleModeSelect = (mode: DisplayMode) => {
    onDisplayModeChange(mode);
  };

  const displayModeContent = (
    <div className="settings-modal-display-mode-section">
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
      title="Settings"
      description="Change the appearance of the words during playback."
      actions={
        <Button onClick={onClose} appearance="primary">
          Save changes
        </Button>
      }
    >
      {displayModeContent}
    </ResponsiveDialogOrDrawer>
  );
}
