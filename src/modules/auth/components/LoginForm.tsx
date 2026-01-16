import { supabase } from '@/modules/supabase/client';
import { cn } from '@/ui/lib/utils';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-sm text-balance text-neutral-500 dark:text-neutral-400">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {
                borderRadius: '5px',
                borderColor: 'rgba(0,0,0,0.2)',
              },
            },
            variables: {
              default: {
                colors: {
                  brand: '#000',
                  brandAccent: '#cfd1ff',
                },
              },
            },
          }}
          providers={['google']}
          showLinks={false}
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </div>

      {/*<div className="grid gap-6">*/}
      {/*  <div className="grid gap-3">*/}
      {/*    <Label htmlFor="email">Email</Label>*/}
      {/*    <Input id="email" type="email" placeholder="m@example.com" required />*/}
      {/*  </div>*/}
      {/*  <div className="grid gap-3">*/}
      {/*    <div className="flex items-center">*/}
      {/*      <Label htmlFor="password">Password</Label>*/}
      {/*      /!*<a*!/*/}
      {/*      /!*  href="#"*!/*/}
      {/*      /!*  className="ml-auto text-sm underline-offset-4 hover:underline"*!/*/}
      {/*      /!*>*!/*/}
      {/*      /!*  Forgot your password?*!/*/}
      {/*      /!*</a>*!/*/}
      {/*    </div>*/}
      {/*    <Input id="password" type="password" required />*/}
      {/*  </div>*/}
      {/*  <Link to={'/assistants'}>*/}
      {/*    <Button type="submit" className="w-full">*/}
      {/*      Login*/}
      {/*    </Button>*/}
      {/*  </Link>*/}
      {/*  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-neutral-200 dark:after:border-neutral-800">*/}
      {/*    <span className="relative z-10 bg-white px-2 text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">*/}
      {/*      Or continue with*/}
      {/*    </span>*/}
      {/*  </div>*/}
      {/*  <Button variant="outline" className="w-full">*/}
      {/*    <IconBrandGoogle />*/}
      {/*    Login with Google*/}
      {/*  </Button>*/}
      {/*</div>*/}
      {/*<div className="text-center text-sm">*/}
      {/*  Don&apos;t have an account?{""}*/}
      {/*  <a href="#" className="underline underline-offset-4">*/}
      {/*    Sign up*/}
      {/*  </a>*/}
      {/*</div>*/}
    </div>
  );
}
