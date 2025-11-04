


import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, Plus, Edit2, Trash2, Check } from "lucide-react";
// import "../styles/EditPage.css";
import { Page } from "./ui/Page";
import { ResponsiveDialogOrDrawer } from "./ui/ResponsiveDialogOrDrawer";
import { useSwipe } from "../hooks/useSwipe";

interface EditPageProps {
  words: string[];
  onUpdateWords: (words: string[]) => void;
  onBack: () => void;
}

export function EditPage({ words, onUpdateWords, onBack }: EditPageProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newWord, setNewWord] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [dialogConfig, setDialogConfig] = useState<{ title: string; description: string; actions: any[] } | null>(null);

  const handleDeleteWord = (index: number) => {
    const updatedWords = words.filter((_, i) => i !== index);
    onUpdateWords(updatedWords);
  };

  const handleDeleteAll = () => {
    setDialogConfig({
      title: "Are you sure you want to delete all?",
      description: "You cannot undo this action.",
      actions: [
        <Button onClick={() => setDialogConfig(null)} appearance="text">Cancel</Button>,
        <Button onClick={() => {
          onUpdateWords([]);
          setDialogConfig(null);
        }} appearance="destructive">Delete all</Button>
      ]
    });
  };

  const handleAddWord = () => {
    if (newWord.trim()) {
      const newWords = [...words, newWord.trim()];
      onUpdateWords(newWords);
      setNewWord("");
      setEditingIndex(newWords.length - 1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(words[index]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSaveEdit = (isEnter: boolean = false) => {
    if (editingIndex !== null) {
      if (editValue.trim() === "" && !isEnter) {
        // If editValue is empty and check button is pressed, remove the word
        const updatedWords = words.filter((_, i) => i !== editingIndex);
        onUpdateWords(updatedWords);
        setEditingIndex(null);
        setEditValue("");
      } else if (editValue.trim() !== "") {
        const updatedWords = [...words];
        updatedWords[editingIndex] = editValue.trim();

        if (isEnter) {
          updatedWords.splice(editingIndex + 1, 0, "");
          onUpdateWords(updatedWords);
          setEditingIndex(editingIndex + 1);
          setEditValue("");
          setTimeout(() => inputRef.current?.focus(), 100);
        } else {
          onUpdateWords(updatedWords);
          setEditingIndex(null);
          setEditValue("");
        }
      }
    }
  };

  const { swipeState, handleTouchStart, handleTouchMove, handleTouchEnd, getSwipeTransform } = useSwipe(handleDeleteWord, handleStartEdit);

  return (
    <Page className="edit-page-container">
      {/* Header */}
      <div className="edit-page-header">
        <Button onClick={onBack} appearance="elevated" className="study-page-back-button icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="title-l">Edit words</h2>
        <span className="body-m">
          {words.length} Words
        </span>
      </div>

      {/* Add New Word */}
      <div className="edit-page-add-word-section">
        <Input
          placeholder="Add new word..."
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleAddWord()}
        />
        <Button onClick={handleAddWord} disabled={!newWord.trim()} appearance="primary">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Words List */}
      <div className="edit-page-word-list-container">
        {words.length === 0 ? (
          <div className="edit-page-no-words">
            <div className="edit-page-no-words-text">
              <p className="body-m">No words</p>
              <p className="body-m">Add your first word above</p>
            </div>
          </div>
        ) : (
          <div className="edit-page-word-list">
            {words.map((word, index) => (
              <Card
                key={index}
                interactable={false}
                className="edit-page-word-item"
                style={{
                  transform: getSwipeTransform(index),
                  transition: swipeState?.index === index && swipeState.isDragging ? 'none' : 'transform 350ms cubic-bezier(0.27, 1.06, 0.18, 1.00), opacity 75ms ease',
                }}
              >
                <CardContent
                  className="card-content"
                  onTouchStart={(e) => handleTouchStart(e, index)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {editingIndex === index ? (
                    <div className="edit-page-word-item-editing">
                      <Input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyUp={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(true);
                        }}
                      />
                      <Button onClick={() => handleSaveEdit(false)} appearance="primary" className="edit-page-word-item-action-button">
                        <Check />
                      </Button>
                    </div>
                  ) : (
                    <div className="edit-page-word-item-display">
                      <span className="body-m">{word}</span>
                      <div className="edit-page-word-item-actions">
                        <Button
                          onClick={() => handleStartEdit(index)}
                          appearance="tonal"
                          className="edit-page-word-item-action-button"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteWord(index)}
                          appearance="destructive"
                          className="edit-page-word-item-action-button delete-Button"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                {/* Swipe indicators */}
                {swipeState?.index === index && swipeState.isDragging && (
                  <>
                    { (swipeState.currentX - swipeState.startX) > 0 && (
                      <div
                        className="edit-page-swipe-indicator-overlay left"
                        style={{ width: `${Math.abs(swipeState.currentX - swipeState.startX - 12)}px` }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </div>
                    )}
                    { (swipeState.currentX - swipeState.startX) < 0 && (
                      <div
                        className="edit-page-swipe-indicator-overlay right"
                        style={{ width: `${Math.abs(swipeState.startX - swipeState.currentX - 12)}px` }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </div>
                    )}
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
        <Button
          appearance="text"
          onClick={handleDeleteAll}>
          Delete all
          </Button>
      </div>
      {dialogConfig && (
        <ResponsiveDialogOrDrawer
          isOpen={true}
          onClose={() => setDialogConfig(null)}
          title={dialogConfig.title}
          description={dialogConfig.description}
          actions={dialogConfig.actions}
        />
      )}
    </Page>
  );
}