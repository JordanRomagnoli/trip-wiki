'use client';

import { useState } from 'react';
import Image from 'next/image';
import { loginAction, signupAction } from '@/lib/actions';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFormAction = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const action = isLogin ? loginAction : signupAction;
    
    // Call the server action directly. Next.js handles redirects automatically.
    // If there is an error, it will return an object, otherwise it redirects.
    const result = await action(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false); // Only stop loading if there's an error (no redirect)
    }
  };

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background styling elements matching the app */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="w-full max-w-md bg-surface border border-outline rounded-3xl p-8 shadow-2xl relative z-10 mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <Image 
              src="/icon.svg" 
              alt="Trip Wiki" 
              width={64} 
              height={64} 
              className="w-full h-full shadow-[0_0_30px_rgba(204,255,0,0.3)] rounded-2xl"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Trip Wiki</h1>
          <p className="text-tertiary mt-2">La guida di cui nessuno ha bisogno</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form action={handleFormAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-tertiary mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full bg-background border border-outline rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="iltuoindirizzo@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-tertiary mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full bg-background border border-outline rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-black font-bold rounded-xl px-4 py-3 mt-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Attendere...' : (isLogin ? 'Accedi' : 'Registrati')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-tertiary text-sm">
            {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium ml-2 hover:underline focus:outline-none"
            >
              {isLogin ? 'Registrati' : 'Accedi'}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
