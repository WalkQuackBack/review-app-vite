
import { useState, useRef, useEffect } from "react";

interface SwipeState {
  startX: number;
  currentX: number;
  isDragging: boolean;
}

export function useCarousel(itemCount: number, startIndex: number = 0) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [swipeState, setSwipeState] = useState<SwipeState | null>(null);
  const isDragging = swipeState?.isDragging ?? false;
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  const nextItem = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, itemCount - 1));
  };

  const previousItem = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeState({
      startX: e.touches[0].clientX,
      currentX: e.touches[0].clientX,
      isDragging: false,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeState) return;
    setSwipeState({
      ...swipeState,
      currentX: e.touches[0].clientX,
      isDragging: true,
    });
  };

  const handleTouchEnd = () => {
    if (!swipeState || !carouselRef.current) return;

    const deltaX = swipeState.currentX - swipeState.startX;
    const cardWidth = carouselRef.current.offsetWidth;
    const swipeThreshold = cardWidth * 0.1;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0) {
        nextItem();
      } else {
        previousItem();
      }
    }
    setSwipeState(null);
  };

  const getCarouselTransform = () => {
    let transformX = -currentIndex * 100;

    if (swipeState?.isDragging) {
      const deltaX = swipeState.currentX - swipeState.startX;
      const cardWidth = carouselRef.current ? carouselRef.current.offsetWidth : 0;
      if (cardWidth > 0) {
        transformX += (deltaX / cardWidth) * 100;
      }
    }
    return `translateX(${transformX}%)`;
  };

  return {
    currentIndex,
    carouselRef,
    nextItem,
    previousItem,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getCarouselTransform,
    isDragging,
  };
}
