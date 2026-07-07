import { Link as RouterLink } from 'react-router-dom';

// React Router client-side navigation (equivalent to next/link in this Vite SPA).
const Link = ({ href, children, ...props }) => {
  if (!href || /^(https?:|mailto:|tel:)/i.test(href)) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  );
};

export default Link;
