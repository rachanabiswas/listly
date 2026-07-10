"use client";

import { useEffect, useRef } from "react";

const EDGE_THRESHOLD = 40;
const MAX_SCROLL_SPEED = 12;

export function useAutoScroll() {
  const scrollRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      let scrollX = 0;
      let scrollY = 0;

      if (clientX < EDGE_THRESHOLD) {
        scrollX =
          -((EDGE_THRESHOLD - clientX) / EDGE_THRESHOLD) * MAX_SCROLL_SPEED;
      } else if (clientX > innerWidth - EDGE_THRESHOLD) {
        scrollX =
          ((clientX - (innerWidth - EDGE_THRESHOLD)) / EDGE_THRESHOLD) *
          MAX_SCROLL_SPEED;
      }

      if (clientY < EDGE_THRESHOLD) {
        scrollY =
          -((EDGE_THRESHOLD - clientY) / EDGE_THRESHOLD) * MAX_SCROLL_SPEED;
      } else if (clientY > innerHeight - EDGE_THRESHOLD) {
        scrollY =
          ((clientY - (innerHeight - EDGE_THRESHOLD)) / EDGE_THRESHOLD) *
          MAX_SCROLL_SPEED;
      }

      scrollRef.current = { x: scrollX, y: scrollY };
    };

    const endScroll = () => {
      scrollRef.current = { x: 0, y: 0 };
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const tick = () => {
      const { x, y } = scrollRef.current;
      if (x !== 0 || y !== 0) {
        window.scrollBy(x, y);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragend", endScroll);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragend", endScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
}
