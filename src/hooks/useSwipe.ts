
import { useState } from "react";

interface SwipeState {
  index: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
  isVerticalScroll: boolean;
  dragThreshold: number;
  verticalThreshold: number;
  startTime: number;
}

export function useSwipe(onSwipeLeft: (index: number) => void, onSwipeRight: (index: number) => void) {
  const [swipeState, setSwipeState] = useState<SwipeState | null>(null);

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
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
      verticalThreshold: 10,
      startTime: Date.now(),
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeState || swipeState.isVerticalScroll) return;

    const touch = e.touches[0];
    const newCurrentX = touch.clientX;
    const newCurrentY = touch.clientY;
    const deltaX = Math.abs(newCurrentX - swipeState.startX);
    const deltaY = Math.abs(newCurrentY - swipeState.startY);

    const timeElapsed = Date.now() - swipeState.startTime;

    const isPastTimeThreshold = timeElapsed > 1000;
    const isHorizontalDrag = deltaX > deltaY;

    if (!swipeState.isDragging && !isHorizontalDrag && deltaY > swipeState.verticalThreshold) {
      setSwipeState((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            isVerticalScroll: true,
          };
        }
        return null;
      });
      return;
    }

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
    if (!swipeState) return;

    const deltaX = swipeState.currentX - swipeState.startX;
    const actionThreshold = swipeState.dragThreshold;

    if (Math.abs(deltaX) > actionThreshold) {
      if (deltaX > 0) {
        onSwipeRight(swipeState.index);
      } else {
        onSwipeLeft(swipeState.index);
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

  return {
    swipeState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getSwipeTransform,
  };
}
