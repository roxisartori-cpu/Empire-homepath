import HomePage from './static/HomePage';
import DemoPage from './static/DemoPage';
import SearchPage from './static/SearchPage';
import PrivacyPage from './static/PrivacyPage';
import TermsPage from './static/TermsPage';
import DisclaimerPage from './static/DisclaimerPage';

export const STATIC_PAGES = {
  '/': HomePage,
  '/demo': DemoPage,
  '/search': SearchPage,
  '/privacy': PrivacyPage,
  '/terms': TermsPage,
  '/disclaimer': DisclaimerPage,
};

export const STATIC_ROUTE_PATHS = Object.keys(STATIC_PAGES);
