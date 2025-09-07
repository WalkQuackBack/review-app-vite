import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
// import "../styles/EditPage.css";
import { Page } from "./ui/Page";

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
  isScrolling: boolean;
  dragThreshold: number;
  itemWidth: number;
}

export function EditPage({ words, onUpdateWords, onBack }: EditPageProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [swipeState, setSwipeState] = useState<SwipeState | null>(null);
  const [newWord, setNewWord] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleDeleteWord = (index: number) => {
    const updatedWords = words.filter((_, i) => i !== index);
    onUpdateWords(updatedWords);
  };

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    if (editingIndex !== null) return;

    const touch = e.touches[0];
    const itemElement = e.currentTarget as HTMLElement; // Get the element that triggered the event
    const itemWidth = itemElement.offsetWidth; // Get its width

    setSwipeState({
      index,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: false,
      isScrolling: false,
      dragThreshold: itemWidth * 0.1, // Calculate dragThreshold here
      itemWidth: itemWidth, // Store itemWidth
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeState || editingIndex !== null) return;
    
    const touch = e.touches[0];
    const newCurrentX = touch.clientX;
    const newCurrentY = touch.clientY;

    const deltaX = Math.abs(newCurrentX - swipeState.startX);
    const deltaY = Math.abs(newCurrentY - swipeState.startY);

    // Determine if it's a scroll
    if (swipeState.isScrolling || (deltaY > deltaX && deltaY > 10)) {
      setSwipeState({ ...swipeState, isScrolling: true });
      return;
    }

    // Only start dragging (visual feedback) if horizontal movement exceeds threshold
    const shouldStartDragging = deltaX > swipeState.dragThreshold;

    setSwipeState({
      ...swipeState,
      currentX: newCurrentX,
      currentY: newCurrentY,
      isDragging: shouldStartDragging,
    });
  };

  const handleTouchEnd = () => {
    if (!swipeState || editingIndex !== null) return;

    // If it was determined to be a scroll, reset and do nothing
    if (swipeState.isScrolling) {
      setSwipeState(null);
      return;
    }

    const deltaX = swipeState.currentX - swipeState.startX;
    const actionThreshold = swipeState.itemWidth * 0.1; // 10% of card width for action activation

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
    const clampedDelta = Math.max(-150, Math.min(150, deltaX));
    return `translateX(${clampedDelta}px)`;
  };

  return (
    <Page className="edit-page-container">
      {/* Header */}
      <div className="edit-page-header">
        <Button onClick={onBack} appearance="elevated" className="study-page-back-button">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="title-l">编辑词汇列表</h2>
        <span className="body-m">
          {words.length} 词
        </span>
      </div>

      {/* Add New Word */}
      <div className="edit-page-add-word-section">
        <div className="flex-gap-2">
          <Input
            placeholder="添加新词..."
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
            className="flex-1"
          />
          <Button onClick={handleAddWord} disabled={!newWord.trim()} appearance="primary">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
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
                  transition: swipeState?.index === index && swipeState.isDragging ? 'none' : 'transform 0.1s ease, opacity 75ms ease',
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
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="flex-1"
                      />
                      <Button onClick={handleSaveEdit} appearance="primary" className="edit-page-word-item-action-button">
                        保存
                      </Button>
                      <Button onClick={handleCancelEdit} appearance="outlined" className="edit-page-word-item-action-button">
                        取消
                      </Button>
                    </div>
                  ) : (
                    <div className="edit-page-word-item-display">
                      <span className="body-m">{word}</span>
                      <div className="edit-page-word-item-actions">
                        <Button
                          onClick={() => handleStartEdit(index)}
                          appearance="outlined"
                          className="edit-page-word-item-action-button"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteWord(index)}
                          appearance="none"
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
                        style={{ width: `${Math.abs(swipeState.currentX - swipeState.startX)}px` }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </div>
                    )}
                    { (swipeState.currentX - swipeState.startX) < 0 && (
                      <div
                        className="edit-page-swipe-indicator-overlay right"
                        style={{ width: `${Math.abs(swipeState.currentX - swipeState.startX)}px` }}
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
      </div>
    </Page>
  );
}