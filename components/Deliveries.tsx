import React from 'react';
import { NavigationProps, Screen } from '../types';

export const Deliveries: React.FC<NavigationProps> = ({ onNavigate }) => {
    const [viewMode, setViewMode] = React.useState<'list' | 'map'>('list');

    const tasks = [
        { id: '#1024', type: 'delivery', status: 'pending', time: 'Hoje 14:00', client: 'João Silva', address: 'Rua das Flores, 123 - Centro', items: ['1x Cama Box King', '2x Travesseiros'] },
        { id: '#1025', type: 'assembly', status: 'scheduled', time: 'Amanhã 09:00', client: 'Maria Oliveira', address: 'Av. Paulista, 1000 - Bela Vista', items: ['Montagem Completa'] },
        { id: '#1026', type: 'delivery', status: 'in-route', time: 'Hoje 16:30', client: 'Carlos Pereira', address: 'Rua Augusta, 500', items: ['1x Colchão Magnético'] },
    ];

    return (
        <div className="bg-background-light text-slate-900 font-display min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 p-4 flex items-center gap-4">
                <button
                    onClick={() => onNavigate(Screen.DASHBOARD)}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900 md:hidden"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold leading-tight flex-1">Entregas e Logística</h1>
                <div className="flex bg-slate-100 p-1 rounded-full">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`size-8 flex items-center justify-center rounded-full transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                    >
                        <span className="material-symbols-outlined text-[20px]">list</span>
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`size-8 flex items-center justify-center rounded-full transition-all ${viewMode === 'map' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                    >
                        <span className="material-symbols-outlined text-[20px]">map</span>
                    </button>
                </div>
            </header>

            <div className="p-4 flex flex-col gap-4">
                {viewMode === 'list' && (
                    <>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            {/* ... existing filters ... */}
                            <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-bold shadow-sm shadow-primary/20 whitespace-nowrap">
                                Pendentes (3)
                            </button>
                            <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-full text-sm font-medium whitespace-nowrap">
                                Em Rota (2)
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {tasks.map((task) => (
                                <div key={task.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-md">
                                    <div className={`p-4 border-b border-slate-100 flex justify-between items-center ${task.type === 'delivery' ? 'bg-blue-50/50' : 'bg-purple-50/50'}`}>
                                        <div className={`flex items-center gap-2 ${task.type === 'delivery' ? 'text-blue-700' : 'text-purple-700'}`}>
                                            <span className="material-symbols-outlined text-sm filled">{task.type === 'delivery' ? 'local_shipping' : 'build'}</span>
                                            <span className="text-xs font-bold uppercase tracking-wide">{task.type === 'delivery' ? 'Entrega' : 'Montagem'} • {task.time}</span>
                                        </div>
                                        <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded">{task.id}</span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-900 mb-1">{task.client}</h3>
                                        <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                                            {task.address}
                                        </p>
                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                                            <div className="flex-1">
                                                {task.items.map((item, i) => (
                                                    <p key={i} className="text-xs font-medium text-slate-900">{item}</p>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const encodedAddress = encodeURIComponent(task.address);
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
                                            }}
                                            className="mt-4 w-full bg-slate-900 text-white font-bold text-sm py-3 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">near_me</span>
                                            Iniciar Rota
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {viewMode === 'map' && (
                    <div className="flex-1 rounded-xl bg-slate-200 overflow-hidden relative min-h-[500px] border border-slate-300">
                        {/* Mock Map Background */}
                        <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Mapa da Cidade</p>
                        </div>

                        {/* Points */}
                        <div className="absolute top-1/3 left-1/4 animate-bounce">
                            <div className="size-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white z-10 relative">
                                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow text-[10px] font-bold whitespace-nowrap">
                                Entrega #1024
                            </div>
                        </div>

                        <div className="absolute top-1/2 right-1/4">
                            <div className="size-8 bg-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white z-10 relative">
                                <span className="material-symbols-outlined text-[16px]">build</span>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow text-[10px] font-bold whitespace-nowrap">
                                Montagem #1025
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                            <button className="size-10 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-700 hover:bg-slate-50">
                                <span className="material-symbols-outlined">my_location</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
