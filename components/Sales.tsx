import React, { useState } from 'react';
import { NavigationProps, Screen, Sale } from '../types';
import { useStore } from '../context/StoreContext';

export const Sales: React.FC<NavigationProps> = ({ onNavigate }) => {
    const { sales, updateSale, setSelectedReceiptSale } = useStore();
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Tracking Modal State
    const [activeTrackingSale, setActiveTrackingSale] = useState<Sale | null>(null);

    const filteredSales = sales.filter(s => {
        // 1. Search Filter
        const matchesSearch =
            s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id.includes(searchQuery);

        if (!matchesSearch) return false;

        // 2. Tab Filter
        if (filter === 'all') return true;
        if (filter === 'month') {
            const saleDate = s.date.split(' ')[0].split('/');
            const saleMonth = parseInt(saleDate[1]) - 1;
            const currentMonth = new Date().getMonth();
            return saleMonth === currentMonth;
        }
        return true;
    });


    const handleStatusChange = (id: string, newStatus: string) => {
        updateSale(id, { status: newStatus as any });
    };

    const handleOpenReceipt = (sale: Sale) => {
        setSelectedReceiptSale(sale);
        onNavigate(Screen.RECEIPT);
    };

    const handleOpenTracking = (sale: Sale) => {
        setActiveTrackingSale(sale);
    };

    const updateDeliveryStatus = (newStatus: string) => {
        if (activeTrackingSale) {
            updateSale(activeTrackingSale.id, { deliveryStatus: newStatus as any });
            setActiveTrackingSale({ ...activeTrackingSale, deliveryStatus: newStatus as any });
        }
    };

    return (
        <div className="bg-background-light text-slate-900 font-display min-h-screen flex flex-col relative">
            <header className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4 flex items-center gap-4">
                <button
                    onClick={() => onNavigate(Screen.DASHBOARD)}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900 md:hidden"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold leading-tight flex-1">Minhas Vendas</h1>
                <button
                    onClick={() => onNavigate(Screen.NEW_ORDER)}
                    className="hidden md:flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-primary text-white font-bold shadow hover:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined">add</span>
                    Nova Venda
                </button>
            </header>

            <div className="p-4 flex flex-col gap-4 pb-20">
                {/* Search Bar */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Buscar por cliente ou ID..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm bg-white focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400 text-sm font-semibold"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-colors ${filter === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('month')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-colors ${filter === 'month' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600'}`}
                    >
                        Este Mês
                    </button>
                </div>

                {/* Sales List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase bg-slate-50/50">
                                <th className="p-3">ID / Data</th>
                                <th className="p-3">Cliente</th>
                                <th className="p-3">Produtos</th>
                                <th className="p-3 text-right">Total</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredSales.map((sale) => (
                                <tr key={sale.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-3">
                                        <div className="font-bold text-primary">{sale.id}</div>
                                        <div className="text-[10px] text-slate-400">{sale.date}</div>
                                    </td>
                                    <td className="p-3">
                                        <div className="font-bold text-slate-900">{sale.clientName}</div>
                                        <div className="text-[10px] text-slate-500">{sale.clientPhone}</div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-col">
                                            {sale.items.map((item, i) => (
                                                <span key={i} className="text-xs text-slate-600">
                                                    {item.quantity}x {item.product}
                                                </span>
                                            ))}
                                            {sale.items.length > 2 && <span className="text-[10px] text-slate-400 italic">...e mais itens</span>}
                                        </div>
                                    </td>
                                    <td className="p-3 text-right font-bold text-slate-900">
                                        R$ {sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-3 text-center">
                                        <select
                                            value={sale.status}
                                            onChange={(e) => handleStatusChange(sale.id, e.target.value)}
                                            className={`text-xs font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer
                                                ${sale.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    sale.status === 'finalized' ? 'bg-blue-100 text-blue-700' :
                                                        sale.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'}`}
                                        >
                                            <option value="pending">Pendente</option>
                                            <option value="paid">Pago</option>
                                            <option value="finalized">Finalizado</option>
                                            <option value="canceled">Cancelado</option>
                                        </select>
                                    </td>
                                    <td className="p-3 flex justify-center gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedReceiptSale(sale);
                                                onNavigate(Screen.RECEIPT);
                                            }}
                                            className="p-1.5 hover:bg-primary/10 rounded text-slate-500 hover:text-primary transition-colors"
                                            title="Dados NF-e"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">description</span>
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>



                {/* FAB */}
                <div className="fixed bottom-6 right-6 z-40 md:hidden">
                    <button
                        onClick={() => onNavigate(Screen.NEW_ORDER)}
                        className="flex items-center justify-center gap-2 h-14 pl-5 pr-6 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-transform active:scale-95"
                    >
                        <span className="material-symbols-outlined text-2xl">add</span>
                        Nova Venda
                    </button>
                </div>
            </div>
        </div>
    );
};
