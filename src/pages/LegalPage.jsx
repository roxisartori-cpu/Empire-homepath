import React, { useEffect } from 'react';
import '../styles/legal.css';

const LegalPage = ({ html, title }) => {
  useEffect(() => {
    document.body.style.backgroundColor = '#0A1628';
    document.documentElement.style.backgroundColor = '#0A1628';
    if (title) document.title = title;

    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [title]);

  return (
    <div
      className="legal-wrapper"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default LegalPage;
