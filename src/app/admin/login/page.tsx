import LoginForm from '@/components/auth/login-form';

export default function AdminLoginPage() {
  return (
    <div className="py-10">
      <LoginForm
        title="Admin Login"
        subtitle="Sign in to review pending provider registrations."
        expectedRole="ADMIN"
      />
    </div>
  );
}