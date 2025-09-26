import { LoginForm } from '@/modules/auth/components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="#"
            className={
              'flex flex-row items-center justify-start gap-2 text-lg font-semibold'
            }
          >
            <span className="text-base font-semibold">Project Leverage</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs pb-10">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-20 flex items-center justify-center">
          Logo
        </div>
      </div>
    </div>
  );
};
