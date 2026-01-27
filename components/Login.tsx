import React, { useState } from 'react';

interface LoginProps {
    onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (email && password) {
                onLogin();
            } else {
                alert('Por favor, preencha todos os campos.');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-primary p-8 flex flex-col items-center justify-center text-white">
                    <div className="size-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl">storefront</span>
                    </div>
                    <h1 className="text-2xl font-bold">Kenkotec</h1>
                    <p className="text-primary-100 text-sm">Gestão de Vendas</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold text-slate-900 transition-colors"
                                placeholder="admin@kenkotec.com"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold text-slate-900 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <span>Entrar</span>
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="#" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors">
                            Esqueci minha senha
                        </a>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-xs text-slate-400">
                © 2026 Kenkotec Management. v1.0.3
            </p>
        </div>
    );
};
