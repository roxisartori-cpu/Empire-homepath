import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions = new Map();

const scrollToHash = (hash) => {
  if (!hash) return false;
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({ behavior: 'auto' });
    return true;
  }
  return false;
};

const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const key = location.key;
    return () => {
      scrollPositions.set(key, window.scrollY);
    };
  }, [location.key]);

  useLayoutEffect(() => {
    if (scrollToHash(location.hash)) return;

    if (navigationType === 'POP') {
      const savedY = scrollPositions.get(location.key);
      if (typeof savedY === 'number') {
        window.scrollTo(0, savedY);
        return;
      }
    }

    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [location.key, location.hash, location.pathname, navigationType]);

  return null;
};

export default ScrollRestoration;
