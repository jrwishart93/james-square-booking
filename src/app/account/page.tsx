import AccountPageClient from './AccountPageClient';

export const metadata = {
  title: 'Account',
  description: 'Manage your account details',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function AccountPage() {
  return <AccountPageClient />;
}
