"use client";
import { useState, useEffect } from 'react';

export const useIntersection = ({ onIntersect, rootMargin = "0px" }) => {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, onIntersect, rootMargin]);

  return { ref: setRef };
};

export default useIntersection;
