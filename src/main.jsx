import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import ScrollRestoration from './components/ScrollRestoration.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignUpUrl="/#pricing"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <BrowserRouter>
        <ScrollRestoration />
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
