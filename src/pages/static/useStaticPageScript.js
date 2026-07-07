import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useStaticPageScript({ title, scripts, containerRef }) {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#0A1628';
    document.documentElement.style.backgroundColor = '#0A1628';
    document.body.style.overflow = '';
    if (title) document.title = title;

    const spaNavigate = (href) => {
      const url = new URL(href, window.location.origin);
      const path = url.pathname || '/';
      const hash = url.hash ? url.hash.slice(1) : '';
      navigate(hash ? { pathname: path, hash } : path);
    };

    window.__spaNavigate = spaNavigate;

    let scriptEl = null;
    const mountTarget = containerRef?.current || document.body;
    if (scripts) {
      scriptEl = document.createElement('script');
      scriptEl.setAttribute('data-static-page-script', 'true');
      scriptEl.textContent = scripts;
      mountTarget.appendChild(scriptEl);
    }

    return () => {
      delete window.__spaNavigate;
      scriptEl?.remove();
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [title, scripts, navigate, containerRef]);
}
