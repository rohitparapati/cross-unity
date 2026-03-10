import RegisterForm from '@/components/auth/register-form';
import { db } from '@/lib/db';

export default async function ProviderRegisterPage() {
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="py-10">
      <RegisterForm categories={categories} />
    </div>
  );
}