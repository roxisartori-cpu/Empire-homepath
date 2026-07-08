import { SignIn } from '@clerk/clerk-react';
import { clerkAppearance } from '../clerkAppearance';

const ClerkSignIn = () => (
  <div
    style={{
      minHeight: '100vh',
      background: '#0A1628',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}
  >
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      forceRedirectUrl="/"
      appearance={clerkAppearance}
    />
  </div>
);

export default ClerkSignIn;
