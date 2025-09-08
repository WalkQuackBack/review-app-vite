import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ResponsiveDialogOrDrawer } from "./ui/ResponsiveDialogOrDrawer";

interface StartFromWordDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  words: string[];
  onSelectWord: (index: number) => void;
}

export function StartFromWordDrawer({ isOpen, onClose, words, onSelectWord }: StartFromWordDrawerProps) {
  const handleSelectWord = (index: number) => {
    onSelectWord(index);
    onClose();
  };

  const wordsList = (
    <div className="start-from-word-drawer-list-container">
      {words.map((word, index) => (
        <Card
          key={index}
          interactable={true}
          className="start-from-word-drawer-list-item"
          onClick={() => handleSelectWord(index)}
        >
          <CardContent className="card-content">
            <div className="start-from-word-drawer-list-item-content">
              <span className="start-from-word-drawer-list-item-index">
                #{index + 1}
              </span>
              <span>{word}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <ResponsiveDialogOrDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Start from word"
      description="Choose a word to start playback from."
      actions={
        <Button onClick={onClose} appearance="primary">
          OK
        </Button>
      }
    >
      {words.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="start-from-word-drawer-empty-state">
            <p>No words</p>
            <p>Please add words to start learning</p>
          </div>
        </div>
      ) : (
        wordsList
      )}
    </ResponsiveDialogOrDrawer>
  );
}