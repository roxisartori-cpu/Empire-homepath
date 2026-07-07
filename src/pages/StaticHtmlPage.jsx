import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const isExternalHref = (href) => /^(https?:|mailto:|tel:)/i.test(href);

const scrollToHash = (hash) => {
  if (!hash) return;
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const StaticHtmlPage = ({ page }) => {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const spaNavigate = useCallback((href) => {
    const url = new URL(href, window.location.origin);
    const path = url.pathname || '/';
    const hash = url.hash ? url.hash.slice(1) : '';

    if (location.pathname === path && !hash) {
      navigate(path);
      return;
    }

    navigate(hash ? { pathname: path, hash } : path);
  }, [location.pathname, navigate]);

  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#0A1628';
    document.documentElement.style.backgroundColor = '#0A1628';
    document.body.style.overflow = '';
    if (page.title) document.title = page.title;

    window.__spaNavigate = spaNavigate;

    let scriptEl = null;
    if (page.scripts && containerRef.current) {
      scriptEl = document.createElement('script');
      scriptEl.setAttribute('data-static-page-script', 'true');
      scriptEl.textContent = page.scripts;
      containerRef.current.appendChild(scriptEl);
      scriptRef.current = scriptEl;
    }

    return () => {
      delete window.__spaNavigate;
      scriptRef.current?.remove();
      scriptRef.current = null;
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [page, spaNavigate]);

  const handleClick = useCallback((event) => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.target === '_blank') return;

    const href = anchor.getAttribute('href');
    if (!href || isExternalHref(href)) return;

    event.preventDefault();

    if (href === '#') return;

    if (href.startsWith('#')) {
      if (location.pathname === '/') {
        navigate({ pathname: '/', hash: href.slice(1) });
        requestAnimationFrame(() => scrollToHash(href));
      } else {
        spaNavigate(`/${href}`);
      }
      return;
    }

    if (href.startsWith('/')) {
      spaNavigate(href);
    }
  }, [location.pathname, navigate, spaNavigate]);

  return (
    <div
      className="static-page-wrapper"
      style={{ minHeight: '100vh', background: '#0A1628' }}
      onClick={handleClick}
    >
      {page.css ? <style dangerouslySetInnerHTML={{ __html: page.css }} /> : null}
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
    </div>
  );
};

export default StaticHtmlPage;
