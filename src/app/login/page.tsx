import LoginPageClient from './LoginPageClient';

export const metadata = {
  title: 'Login',
  description: 'Sign in or register',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function LoginPage() {
  return <LoginPageClient />;
}
