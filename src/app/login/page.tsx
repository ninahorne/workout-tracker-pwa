import AuthForm from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-yellow-300 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-8 mb-8">
          <h2 className="text-center text-5xl font-black text-black uppercase tracking-tight mb-4">
            💪 WORKOUT TRACKER
          </h2>
          <p className="text-center text-xl font-bold text-black uppercase">
            GET SWOLE OR GO HOME! 🔥
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
