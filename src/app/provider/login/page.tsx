import LoginForm from '@/components/auth/login-form';

export default function ProviderLoginPage() {
  return (
    <div className="py-10">
      <LoginForm
        title="Provider Login"
        subtitle="Sign in to manage your provider account and dashboard."
        expectedRole="PROVIDER"
      />
    </div>
  );
}