import React from 'react';
import { NavigationProps, Screen } from '../types';
import { useStore } from '../context/StoreContext';

export const Reports: React.FC<NavigationProps> = ({ onNavigate }) => {
    const { sales } = useStore();

    const [dateRange, setDateRange] = React.useState<'7days' | '30days' | 'month'>('7days');

    const filterSalesByRange = (sales: any[]) => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return sales.filter(s => {
            if (s.status !== 'paid' && s.status !== 'finalized') return false;

            const [day, month, year] = s.date.split(' ')[0].split('/').map(Number);
            const saleDate = new Date(year, month - 1, day);

            if (dateRange === '7days') {
                const sevenDaysAgo = new Date(startOfDay);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return saleDate >= sevenDaysAgo;
            }
            if (dateRange === '30days') {
                const thirtyDaysAgo = new Date(startOfDay);
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return saleDate >= thirtyDaysAgo;
            }
            if (dateRange === 'month') {
                return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    };

    const filteredSales = filterSalesByRange(sales);
    const totalSales = filteredSales.reduce((acc, sale) => acc + sale.total, 0);
    const averageTicket = filteredSales.length > 0 ? totalSales / filteredSales.length : 0;

    // Chart Data
    const getChartLabels = () => {
        if (dateRange === 'month') {
            // Show weeks or days of month? Simplified to last 15 days for UI
            return Array.from({ length: 15 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (14 - i));
                return d;
            });
        }
        const days = dateRange === '30days' ? 15 : 7; // Show max 15 points
        return Array.from({ length: days }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - ((days - 1) - i));
            return d;
        });
    };

    const chartPoints = getChartLabels();

    const chartData = chartPoints.map(date => {
        const dateStr = date.toLocaleString('pt-BR').split(',')[0].trim();
        const dayTotal = filteredSales
            .filter(s => s.date.includes(dateStr))
            .reduce((acc, s) => acc + s.total, 0);

        return {
            label: date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0'),
            value: dayTotal
        };
    });

    const maxChartValue = Math.max(...chartData.map(d => d.value), 1000); // Min 1000 scale

    return (
        <div className="bg-background-light text-slate-900 font-display min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 p-4 flex items-center gap-4">
                <button
                    onClick={() => onNavigate(Screen.DASHBOARD)}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900 md:hidden"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold leading-tight flex-1">Relatórios de Vendas</h1>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="bg-slate-100 border-none text-xs font-bold rounded-lg py-2 pl-3 pr-8 focus:ring-0 cursor-pointer"
                >
                    <option value="7days">Últimos 7 dias</option>
                    <option value="30days">Últimos 30 dias</option>
                    <option value="month">Este Mês</option>
                </select>
            </header>

            <main className="p-4 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-500 mb-2">Vendas Totais</h3>
                        <p className="text-2xl font-bold text-slate-900">R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-xs text-green-600 font-medium mt-1">{sales.length} vendas registradas</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-500 mb-2">Ticket Médio</h3>
                        <p className="text-2xl font-bold text-slate-900">R$ {averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-xs text-green-600 font-medium mt-1">Calculado automaticamente</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 mb-4">Performance Semanal</h3>
                    <div className="h-48 flex items-end justify-between gap-2 px-2 border-b border-slate-100 pb-2">
                        {chartData.map((data, i) => {
                            const height = Math.max((data.value / maxChartValue) * 100, 4); // Min 4% height
                            return (
                                <div key={i} className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                    <div
                                        className="w-full bg-primary rounded-t-sm relative group hover:bg-primary/80 transition-all cursor-help"
                                        style={{ height: `${height}%`, opacity: data.value > 0 ? 1 : 0.1 }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg pointer-events-none">
                                            R$ {data.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {data.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 mb-4">Top Produtos</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="size-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">1</div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">Colchão Magnético King</p>
                                <p className="text-xs text-slate-500">32 unidades vendidas</p>
                            </div>
                            <p className="font-bold text-sm">R$ 89k</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">2</div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">Travesseiro NASA</p>
                                <p className="text-xs text-slate-500">145 unidades vendidas</p>
                            </div>
                            <p className="font-bold text-sm">R$ 12k</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">3</div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">Box Baú Queen</p>
                                <p className="text-xs text-slate-500">28 unidades vendidas</p>
                            </div>
                            <p className="font-bold text-sm">R$ 25k</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
