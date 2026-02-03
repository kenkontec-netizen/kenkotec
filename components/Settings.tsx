import React, { useState } from 'react';
import { NavigationProps, Screen } from '../types';
import { useStore } from '../context/StoreContext';

interface SettingsProps extends NavigationProps {
    onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate, onLogout }) => {
    const { resetDatabase, loading } = useStore();

    const handleLogout = () => {
        if (confirm("Deseja realmente sair?")) {
            // Mock logout
            onLogout();
        }
    };

    const handleReset = async () => {
        const confirmed = confirm("ATENÇÃO: Isso apagará TODOS os dados de Vendas e Clientes, e zerará o estoque. Essa ação NÃO pode ser desfeita. Tem certeza?");
        if (confirmed) {
            await resetDatabase();
            alert("Dados resetados com sucesso.");
        }
    }

    return (
        <div className="bg-background-light text-slate-900 font-display min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 p-4 flex items-center gap-4 md:hidden">
                <button
                    onClick={() => onNavigate(Screen.DASHBOARD)}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold leading-tight flex-1">Ajustes</h1>
            </header>

            <main className="p-4 flex flex-col gap-6">
                {/* Profile Section */}
                <div className="flex flex-col items-center py-6">
                    <div className="size-24 rounded-full bg-slate-200 mb-4 overflow-hidden ring-4 ring-white shadow-lg">
                        <div
                            className="w-full h-full bg-center bg-no-repeat bg-cover"
                            style={{
                                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCeiQFben3dWgPZOPO91rDYkL_YTMKaHc2dAqbFzOk7nwa2ZeRv_UZbPuxQZt75NQVY71MRbRyvj1bNitGpnL-oQFpzhX-cUv9sBM_HMxZu05jmPHQd8nqP-b86KII-wyg53XaJ59S5V_sRziqESKHM2ihFa989Hetgqkii3gu93HkiNG15YWKUlLx-q_Z94-QeYeuRh36zudvxK1PBleHsZj7Ag0N3JeAfmfSrenoO860WmUZ0jJqZr9LhYE6qkUodkHzHRiSgN2s")',
                            }}
                        ></div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Gestor da Loja</h2>
                    <p className="text-sm text-slate-500">gestor@kenkotec.com.br</p>
                    <button className="mt-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                        Editar Perfil
                    </button>
                </div>

                {/* Menu Groups */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <h3 className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Conta</h3>
                        <div className="flex flex-col divide-y divide-slate-100">
                            <button className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left">
                                <span className="material-symbols-outlined text-slate-400">lock</span>
                                <span className="flex-1 font-medium text-sm">Segurança e Senha</span>
                                <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward_ios</span>
                            </button>
                            <button className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left">
                                <span className="material-symbols-outlined text-slate-400">notifications</span>
                                <span className="flex-1 font-medium text-sm">Notificações</span>
                                <span className="material-symbols-outlined text-slate-300 text-sm">arrow_forward_ios</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <h3 className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Aplicativo</h3>
                        <div className="flex flex-col divide-y divide-slate-100">
                            <button className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left">
                                <span className="material-symbols-outlined text-slate-400">palette</span>
                                <span className="flex-1 font-medium text-sm">Aparência</span>
                                <span className="text-xs text-slate-400 font-medium">Claro</span>
                            </button>
                            <button className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left">
                                <span className="material-symbols-outlined text-slate-400">language</span>
                                <span className="flex-1 font-medium text-sm">Idioma</span>
                                <span className="text-xs text-slate-400 font-medium">Português (BR)</span>
                            </button>
                            <button className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left">
                                <span className="material-symbols-outlined text-slate-400">help</span>
                                <span className="flex-1 font-medium text-sm">Ajuda e Suporte</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                        <h3 className="bg-red-50 px-4 py-2 text-xs font-bold text-red-500 uppercase tracking-wider">Zona de Perigo</h3>
                        <div className="flex flex-col divide-y divide-red-50">
                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className="flex items-center gap-3 p-4 hover:bg-red-50 transition-colors text-left group"
                            >
                                <span className="material-symbols-outlined text-red-400 group-hover:text-red-600">delete_forever</span>
                                <span className="flex-1 font-medium text-sm text-red-700 group-hover:text-red-900">
                                    {loading ? 'Processando...' : 'Zerar Banco de Dados'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 p-4 rounded-xl text-red-600 font-bold text-sm bg-red-50 hover:bg-red-100 transition-colors mt-2"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Sair da Conta
                    </button>

                    <p className="text-center text-[10px] text-slate-400 pb-4">
                        Versão 1.0.2 (Build 2405)
                    </p>
                </div>
            </main>
        </div>
    );
};
