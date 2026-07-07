import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function initRevealAnimations(root) {
  if (!root) return () => {};

  const reveals = root.querySelectorAll('.reveal');
  if (!reveals.length) return () => {};

  const show = (el) => el.classList.add('visible');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );

  const syncVisible = () => {
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        show(el);
        observer.unobserve(el);
      } else {
        observer.observe(el);
      }
    });
  };

  syncVisible();

  const onScroll = () => syncVisible();
  window.addEventListener('scroll', onScroll, { passive: true });

  const fallbackTimer = window.setTimeout(() => {
    reveals.forEach(show);
  }, 500);

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.clearTimeout(fallbackTimer);
    observer.disconnect();
  };
}

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
    let cleanupReveal = () => {};
    const mountTarget = containerRef?.current || document.body;

    const runScripts = () => {
      if (scripts) {
        scriptEl = document.createElement('script');
        scriptEl.setAttribute('data-static-page-script', 'true');
        scriptEl.textContent = scripts;
        mountTarget.appendChild(scriptEl);
      }
      cleanupReveal = initRevealAnimations(containerRef?.current);
    };

    const frameId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(runScripts);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      delete window.__spaNavigate;
      cleanupReveal();
      scriptEl?.remove();
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [title, scripts, navigate, containerRef]);
}
