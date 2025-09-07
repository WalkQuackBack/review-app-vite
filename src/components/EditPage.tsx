import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, Plus, Edit2, Trash2, Check } from "lucide-react";
// import "../styles/EditPage.css";
import { Page } from "./ui/Page";
import { Alert } from "./ui/alert";

interface EditPageProps {
  words: string[];
  onUpdateWords: (words: string[]) => void;
  onBack: () => void;
}

interface SwipeState {
  index: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
  isVerticalScroll: boolean; // New property to track vertical scroll
  dragThreshold: number;
  verticalThreshold: number;
  startTime: number;
}

export function EditPage({ words, onUpdateWords, onBack }: EditPageProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [swipeState, setSwipeState] = useState<SwipeState | null>(null);
  const [newWord, setNewWord] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [wordToDelete, setWordToDelete] = useState(0);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [isDeletAllOpen, setIsDeletAllOpen] = useState(false);

  const handleDeleteConfirmYes = () => {
    setIsDeleteConfirmOpen(false);
    const updatedWords = words.filter((_, i) => i !== wordToDelete);
    onUpdateWords(updatedWords);
  };
  const handleDeleteConfirmCancel = () => setIsDeleteConfirmOpen(false);

  const handleIsDeletAllYes = () => {
    setIsDeleteConfirmOpen(false);
    onUpdateWords([])
  };
  const handleIsDeletAllCancel = () => setIsDeleteConfirmOpen(false);

  const handleAddWord = () => {
    if (newWord.trim()) {
      onUpdateWords([...words, newWord.trim()]);
      setNewWord("");
    }
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(words[index]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      const updatedWords = [...words];
      updatedWords[editingIndex] = editValue.trim();
      onUpdateWords(updatedWords);
    }
    setEditingIndex(null);
    setEditValue("");
  };

  const handleDeleteWord = (index: number) => {
    setWordToDelete(index)
    setIsDeleteConfirmOpen(true)
  };

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    if (editingIndex !== null) return;

    const touch = e.touches[0];
    const itemElement = e.currentTarget as HTMLElement;
    const itemWidth = itemElement.offsetWidth;

    setSwipeState({
      index,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: false,
      isVerticalScroll: false,
      dragThreshold: itemWidth * 0.25,
      verticalThreshold: 10, // Define a vertical threshold
      startTime: Date.now(),
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeState || editingIndex !== null || swipeState.isVerticalScroll) return;
    
    const touch = e.touches[0];
    const newCurrentX = touch.clientX;
    const newCurrentY = touch.clientY;
    const deltaX = Math.abs(newCurrentX - swipeState.startX);
    const deltaY = Math.abs(newCurrentY - swipeState.startY);

    const timeElapsed = Date.now() - swipeState.startTime;

    const isPastTimeThreshold = timeElapsed > 1000;
    const isHorizontalDrag = deltaX > deltaY;

    // Check if the gesture is a dominant vertical scroll
    if (!swipeState.isDragging && !isHorizontalDrag && deltaY > swipeState.verticalThreshold) {
      setSwipeState((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            isVerticalScroll: true, // Mark this gesture as a vertical scroll
          };
        }
        return null;
      });
      return; // Exit early
    }

    // Continue the drag if the time threshold has been passed
    // or if the initial drag was horizontal
    if (isHorizontalDrag || isPastTimeThreshold) {
      setSwipeState((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            currentX: newCurrentX,
            currentY: newCurrentY,
            isDragging: true,
          };
        }
        return null;
      });
    }
  };

  const handleTouchEnd = () => {
    if (!swipeState || editingIndex !== null) return;

    const deltaX = swipeState.currentX - swipeState.startX;
    const actionThreshold = swipeState.dragThreshold;

    if (Math.abs(deltaX) > actionThreshold) {
      if (deltaX > 0) {
        handleStartEdit(swipeState.index);
      } else {
        handleDeleteWord(swipeState.index);
      }
    }

    setSwipeState(null);
  };

  const getSwipeTransform = (index: number) => {
    if (!swipeState || swipeState.index !== index || !swipeState.isDragging) {
      return "translateX(0)";
    }
    
    const deltaX = swipeState.currentX - swipeState.startX;
    return `translateX(${deltaX}px)`;
  };

  return (
    <Page className="edit-page-container">
      {/* Header */}
      <div className="edit-page-header">
        <Button onClick={onBack} appearance="elevated" className="study-page-back-button">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="title-l">编辑词汇列表 Change the words</h2>
        <span className="body-m">
          {words.length} 词 / {words.length} Words
        </span>
      </div>

      {/* Add New Word */}
      <div className="edit-page-add-word-section">
        <Input
          placeholder="添加新词..."
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
              <p className="body-m">暂无词汇</p>
              <p className="body-m">在上方添加您的第一个词</p>
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
                          if (e.key === 'Enter') handleSaveEdit();
                        }}
                      />
                      <Button onClick={handleSaveEdit} appearance="primary" className="edit-page-word-item-action-button">
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
          appearance="destructive"
          onClick={() => setIsDeletAllOpen(true)}>
          全部删除
          </Button>
      </div>
      <Alert
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="你确定要删除吗？"
        body="你不能撤销此操作。"
        actions={[
          { text: '取消', appearance: 'text', callback: handleDeleteConfirmCancel },
          { text: '要', appearance: 'primary', callback: handleDeleteConfirmYes }
        ]}
      />
    <Alert
        isOpen={isDeletAllOpen}
        onClose={() => setIsDeletAllOpen(false)}
        title="你确定要全部删除吗？"
        body="你不能撤销此操作。"
        actions={[
          { text: '取消', appearance: 'text', callback: handleIsDeletAllCancel },
          { text: '要', appearance: 'primary', callback: handleIsDeletAllYes }
        ]}
      />
    </Page>
  );
}