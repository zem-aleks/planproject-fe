import { Link, Navigate } from 'react-router';

import { LoginForm } from '@/modules/auth/components/LoginForm';
import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { LogoBlock } from '@/modules/home/components/LogoBlock';

export const LoginPage = () => {
  const { session } = useAuthSession();
  if (session) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-6">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to={'/'}>
            <LogoBlock />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs pb-10">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden bg-[url('https://akmoolaxrpskmtqdymjo.supabase.co/storage/v1/object/public/assets/logo/heroimage.jpeg')] bg-cover bg-center lg:block"></div>
    </div>
  );
};
