export const clerkAppearance = {
  variables: {
    colorBackground: '#0A1628',
    colorInputBackground: '#102038',
    colorInputText: '#FFFFFF',
    colorText: '#FFFFFF',
    colorTextSecondary: 'rgba(255,255,255,0.65)',
    colorPrimary: '#C9A84C',
    colorDanger: '#ef4444',
    borderRadius: '5px',
  },
  elements: {
    rootBox: 'mx-auto w-full',
    card: {
      backgroundColor: '#0A1628',
      border: '1px solid rgba(201,168,76,0.28)',
      boxShadow: 'none',
    },
    headerTitle: { color: '#FFFFFF' },
    headerSubtitle: { color: 'rgba(255,255,255,0.65)' },
    socialButtonsBlockButton: {
      border: '1px solid rgba(201,168,76,0.28)',
      backgroundColor: '#102038',
      color: '#FFFFFF',
    },
    formButtonPrimary: {
      backgroundColor: '#C9A84C',
      color: '#0A1628',
      '&:hover': { backgroundColor: '#DDB85C' },
    },
    footerActionLink: { color: '#C9A84C' },
    identityPreviewEditButton: { color: '#C9A84C' },
    formFieldInput: {
      backgroundColor: '#102038',
      borderColor: 'rgba(201,168,76,0.28)',
      color: '#FFFFFF',
    },
  },
};
