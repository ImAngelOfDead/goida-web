import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function Home() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return;

        if (session) {
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }, [session, status, router]);

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
            <div className="text-white">Redirecting...</div>
        </div>
    );
}