import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

// We import the HTML content as a string. 
// Since we don't have a loader, we'll just paste it or use a constant.
import landingHtml from './landingHtml';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Force background color on mount
    document.body.style.backgroundColor = '#0A1628';
    document.documentElement.style.backgroundColor = '#0A1628';

    // Reveal animations
    const revs = document.querySelectorAll('.reveal');
    const ro = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revs.forEach(r => ro.observe(r));

    // Scroll active link highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const handleScroll = () => {
      let p = window.scrollY + 90;
      sections.forEach(s => {
        if (p >= s.offsetTop && p < s.offsetTop + s.offsetHeight) {
          navLinks.forEach(l => {
            l.style.color = '';
            if (l.getAttribute('href') === '#' + s.id) {
              l.style.color = 'rgba(255,255,255,0.9)';
            }
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Global functions for the inline onclicks in the HTML
    window.openModal = () => {
      document.getElementById('disc-modal').classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    window.closeModal = () => {
      document.getElementById('disc-modal').classList.remove('open');
      document.body.style.overflow = '';
    };
    window.closeOut = (e) => {
      if (e.target === document.getElementById('disc-modal')) window.closeModal();
    };

    // Attach listener for Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') window.closeModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      ro.disconnect();
      delete window.openModal;
      delete window.closeModal;
      delete window.closeOut;

      // Reset background color on unmount
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [navigate]);

  return (
    <div 
      className="landing-wrapper" 
      dangerouslySetInnerHTML={{ __html: landingHtml }} 
    />
  );
};

export default LandingPage;
