import React, { useEffect, useState } from 'react';
import { NavigationProps, Screen } from '../types';
import { useStore } from '../context/StoreContext';

export const RecentOrders: React.FC<NavigationProps> = ({ onNavigate }) => {
    const { sales } = useStore();

    // Get last 5 sales
    const recentSales = sales.slice(0, 5);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Pago</span>;
            case 'finalized':
                return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">Finalizado</span>;
            case 'pending':
                return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">Pendente</span>;
            case 'canceled':
                return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">Cancelado</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    const getDeliveryBadge = (status?: string) => {
        switch (status) {
            case 'delivered':
                return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">Entregue</span>;
            case 'shipping':
                return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold">Enviando</span>;
            case 'pending':
                return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">Pendente</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">Pendente</span>;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-lg">Últimos Pedidos</h3>
                <button
                    onClick={() => onNavigate(Screen.SALES)}
                    className="text-primary text-sm font-bold hover:underline"
                >
                    Ver todos
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Cliente</th>
                            <th className="px-4 py-3">Data</th>
                            <th className="px-4 py-3">Valor</th>
                            <th className="px-4 py-3 text-center">Pagamento</th>
                            <th className="px-4 py-3 text-center">Entrega</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {recentSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900">{sale.id}</td>
                                <td className="px-4 py-3 font-semibold">{sale.clientName}</td>
                                <td className="px-4 py-3 text-slate-500">{sale.date.split(' ')[0]}</td>
                                <td className="px-4 py-3 font-bold text-slate-900">R$ {sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                <td className="px-4 py-3 text-center">{getStatusBadge(sale.status)}</td>
                                <td className="px-4 py-3 text-center">{getDeliveryBadge(sale.deliveryStatus)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {recentSales.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                    <p>Nenhum pedido recente.</p>
                </div>
            )}
        </div>
    );
};
