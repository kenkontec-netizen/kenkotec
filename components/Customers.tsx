import React from 'react';
import { NavigationProps, Screen } from '../types';
import { useStore } from '../context/StoreContext';


export const Customers: React.FC<NavigationProps> = ({ onNavigate }) => {
    const { customers, addCustomer } = useStore();
    const [search, setSearch] = React.useState('');
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [newClient, setNewClient] = React.useState({ name: '', phone: '' });

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search))
    );

    const handleSaveClient = () => {
        if (!newClient.name) {
            alert('Nome é obrigatório');
            return;
        }
        addCustomer(newClient);
        setNewClient({ name: '', phone: '' });
        setIsAddModalOpen(false);
    };

    return (
        <div className="bg-background-light text-slate-900 font-display min-h-screen flex flex-col relative">
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 p-4 flex items-center gap-4 md:hidden">
                <button
                    onClick={() => onNavigate(Screen.DASHBOARD)}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold leading-tight flex-1">Meus Clientes</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                    <span className="material-symbols-outlined">person_add</span>
                </button>
            </header>

            {/* Desktop Header */}
            <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-100 p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">Meus Clientes</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    Novo Cliente
                </button>
            </header>

            <div className="p-4">
                <div className="relative mb-4">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por nome ou telefone..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm bg-white focus:ring-2 focus:ring-primary/50 placeholder:text-slate-400"
                    />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase bg-slate-50/50">
                                <th className="p-3 w-12 text-center"></th>
                                <th className="p-3">Nome do Cliente</th>
                                <th className="p-3">Telefone</th>
                                <th className="p-3 text-center">Total Gasto</th>
                                <th className="p-3 text-right">Última Compra</th>
                                <th className="p-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
                                        <p>Nenhum cliente encontrado.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((client) => (
                                    <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-2 text-center">
                                            <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold mx-auto text-xs">
                                                {client.name.charAt(0).toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="p-3 font-bold text-slate-900">
                                            {client.name}
                                        </td>
                                        <td className="p-3 text-slate-600 font-medium">
                                            {client.phone}
                                        </td>
                                        <td className="p-3 text-center font-bold text-primary">
                                            R$ {client.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-3 text-right text-xs text-slate-500">
                                            {client.lastPurchase}
                                        </td>
                                        <td className="p-3 flex justify-center gap-2">
                                            <button className="p-1 hover:bg-black/5 rounded text-slate-400 hover:text-slate-600 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Customer Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-900">Novo Cliente</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                                <input
                                    type="text"
                                    value={newClient.name}
                                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold text-slate-900"
                                    placeholder="Ex: Maria Silva"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Telefone</label>
                                <input
                                    type="text"
                                    value={newClient.phone}
                                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold text-slate-900"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveClient}
                                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
