import React from 'react';
import { Screen } from '../types';

interface LayoutProps {
    currentScreen: Screen;
    onNavigate: (screen: Screen) => void;
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentScreen, onNavigate, children }) => {
    const menuItems = [
        { label: 'Início', icon: 'dashboard', screen: Screen.DASHBOARD },
        { label: 'Estoque', icon: 'inventory_2', screen: Screen.INVENTORY },
        { label: 'Vendas', icon: 'sell', screen: Screen.SALES },
        { label: 'Clientes', icon: 'group', screen: Screen.CUSTOMERS },
        { label: 'Relatórios', icon: 'bar_chart', screen: Screen.REPORTS },

        { label: 'Ajustes', icon: 'settings', screen: Screen.SETTINGS },
    ];

    return (
        <div className="flex min-h-screen bg-background-light">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 sticky top-0 h-screen overflow-y-auto shrink-0 z-50">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">bed</span>
                    </div>
                    <span className="font-extrabold text-xl text-slate-900 tracking-tight">Kenkotec</span>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    {menuItems.map(item => (
                        <button
                            key={item.label}
                            onClick={() => onNavigate(item.screen)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left
                    ${currentScreen === item.screen
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 mt-auto">
                    <button className="flex items-center gap-3 px-4 py-3 w-full bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left">
                        <div
                            className="size-9 rounded-full bg-slate-200 bg-center bg-cover border-2 border-white shadow-sm"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCeiQFben3dWgPZOPO91rDYkL_YTMKaHc2dAqbFzOk7nwa2ZeRv_UZbPuxQZt75NQVY71MRbRyvj1bNitGpnL-oQFpzhX-cUv9sBM_HMxZu05jmPHQd8nqP-b86KII-wyg53XaJ59S5V_sRziqESKHM2ihFa989Hetgqkii3gu93HkiNG15YWKUlLx-q_Z94-QeYeuRh36zudvxK1PBleHsZj7Ag0N3JeAfmfSrenoO860WmUZ0jJqZr9LhYE6qkUodkHzHRiSgN2s")' }}
                        ></div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">Admin</p>
                            <p className="text-xs text-slate-500 truncate">Gerente</p>
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {children}
            </div>
        </div>
    );
};
