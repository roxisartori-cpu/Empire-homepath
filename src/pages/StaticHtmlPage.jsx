import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const isExternalHref = (href) => /^(https?:|mailto:|tel:)/i.test(href);

const scrollToHash = (hash) => {
  if (!hash) return;
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const StaticHtmlPage = ({ page }) => {
  const containerRef = useRef(null);
  const styleRef = useRef(null);
  const scriptRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const spaNavigate = useCallback((href) => {
    const url = new URL(href, window.location.origin);
    const path = url.pathname || '/';
    const hash = url.hash;

    if (location.pathname === path) {
      if (hash) {
        window.history.replaceState(null, '', path + hash);
        scrollToHash(hash);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    navigate(hash ? `${path}${hash}` : path);
  }, [location.pathname, navigate]);

  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#0A1628';
    document.documentElement.style.backgroundColor = '#0A1628';
    document.body.style.overflow = '';
    if (page.title) document.title = page.title;

    window.__spaNavigate = spaNavigate;

    document.querySelectorAll('[data-static-page-style]').forEach((el) => el.remove());
    document.querySelectorAll('[data-static-page-script]').forEach((el) => el.remove());

    if (page.css) {
      const styleEl = document.createElement('style');
      styleEl.setAttribute('data-static-page-style', 'true');
      styleEl.textContent = page.css;
      document.head.appendChild(styleEl);
      styleRef.current = styleEl;
    }

    return () => {
      delete window.__spaNavigate;
      styleRef.current?.remove();
      styleRef.current = null;
    };
  }, [page, spaNavigate]);

  useEffect(() => {
    let scriptEl = null;
    if (page.scripts && containerRef.current) {
      scriptEl = document.createElement('script');
      scriptEl.setAttribute('data-static-page-script', 'true');
      scriptEl.textContent = page.scripts;
      containerRef.current.appendChild(scriptEl);
      scriptRef.current = scriptEl;
    }

    return () => {
      scriptRef.current?.remove();
      scriptRef.current = null;
    };
  }, [page]);

  useEffect(() => {
    if (!location.hash) return;
    const timer = window.setTimeout(() => scrollToHash(location.hash), 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash, page]);

  const handleClick = useCallback((event) => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.target === '_blank') return;

    const href = anchor.getAttribute('href');
    if (!href || isExternalHref(href)) return;

    if (href === '#') {
      event.preventDefault();
      return;
    }

    if (href.startsWith('#')) {
      event.preventDefault();
      if (location.pathname === '/') {
        window.history.replaceState(null, '', href);
        scrollToHash(href);
      } else {
        spaNavigate(`/${href}`);
      }
      return;
    }

    if (href.startsWith('/')) {
      event.preventDefault();
      spaNavigate(href);
    }
  }, [location.pathname, spaNavigate]);

  return (
    <div
      ref={containerRef}
      className="static-page-wrapper"
      style={{ minHeight: '100vh', background: '#0A1628' }}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: page.html }}
    />
  );
};

export default StaticHtmlPage;
