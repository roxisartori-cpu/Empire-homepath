import { useLocation } from 'react-router-dom';
import StaticHtmlPage from './StaticHtmlPage';
import homePage from './static/homePage';
import demoPage from './static/demoPage';
import searchPage from './static/searchPage';
import privacyPage from './static/privacyPage';
import termsPage from './static/termsPage';
import disclaimerPage from './static/disclaimerPage';

export const STATIC_PAGES = {
  '/': homePage,
  '/demo': demoPage,
  '/search': searchPage,
  '/privacy': privacyPage,
  '/terms': termsPage,
  '/disclaimer': disclaimerPage,
};

export const STATIC_ROUTE_PATHS = Object.keys(STATIC_PAGES);

const StaticPagesLayout = () => {
  const { pathname } = useLocation();
  const page = STATIC_PAGES[pathname];
  if (!page) return null;
  return <StaticHtmlPage page={page} />;
};

export default StaticPagesLayout;
