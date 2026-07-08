import { SignUp } from '@clerk/clerk-react';
import { clerkAppearance } from '../clerkAppearance';

const ClerkSignUp = () => (
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
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      forceRedirectUrl="/#pricing"
      appearance={clerkAppearance}
    />
  </div>
);

export default ClerkSignUp;
