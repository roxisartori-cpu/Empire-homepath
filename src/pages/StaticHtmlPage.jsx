import React, { useEffect, useRef } from 'react';

const StaticHtmlPage = ({ page }) => {
  const containerRef = useRef(null);
  const styleRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    document.body.style.backgroundColor = '#0A1628';
    document.documentElement.style.backgroundColor = '#0A1628';
    document.body.style.overflow = '';
    if (page.title) document.title = page.title;

    document.querySelectorAll('[data-static-page-style]').forEach((el) => el.remove());
    document.querySelectorAll('[data-static-page-script]').forEach((el) => el.remove());

    if (page.css) {
      const styleEl = document.createElement('style');
      styleEl.setAttribute('data-static-page-style', 'true');
      styleEl.textContent = page.css;
      document.head.appendChild(styleEl);
      styleRef.current = styleEl;
    }

    let scriptEl = null;
    if (page.scripts && containerRef.current) {
      scriptEl = document.createElement('script');
      scriptEl.setAttribute('data-static-page-script', 'true');
      scriptEl.textContent = page.scripts;
      containerRef.current.appendChild(scriptEl);
      scriptRef.current = scriptEl;
    }

    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
      styleRef.current?.remove();
      scriptRef.current?.remove();
      styleRef.current = null;
      scriptRef.current = null;
    };
  }, [page]);

  return (
    <div
      ref={containerRef}
      className="static-page-wrapper"
      dangerouslySetInnerHTML={{ __html: page.html }}
    />
  );
};

export default StaticHtmlPage;
