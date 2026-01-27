import React from 'react';
import { NavigationProps, Screen } from '../types';
import { useStore } from '../context/StoreContext';

export const PostSale: React.FC<NavigationProps> = ({ onNavigate }) => {
    const { sales } = useStore();
    // Safely access the latest sale. If array might be empty initially, handle gracefully
    // Assuming prepend logic, index 0 is newest.
    const latestSale = sales.length > 0 ? sales[0] : null;

    const handleWhatsApp = () => {
        if (!latestSale) return;
        const message = `*Pedido Kenkotec ${latestSale.id.replace('#', '#')}*\n\n` +
            `Olá ${latestSale.clientName}, aqui está o resumo do seu pedido:\n\n` +
            latestSale.items.map(i => `▪ ${i.quantity}x ${i.product} - R$ ${i.price.toLocaleString('pt-BR')}`).join('\n') +
            `\n\n*Total: R$ ${latestSale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*\n` +
            `Obrigado pela preferência!`;

        const encodedMsg = encodeURIComponent(message);
        // Remove non-digits from phone
        const phone = latestSale.clientPhone.replace(/\D/g, '');
        window.open(`https://wa.me/55${phone}?text=${encodedMsg}`, '_blank');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 animate-in fade-in duration-500">

            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col items-center text-center gap-6 border border-slate-100">

                <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-5xl text-green-600 animate-bounce">check</span>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Venda Finalizada!</h2>
                    <p className="text-slate-500 mt-2">O pedido foi registrado com sucesso.</p>
                </div>

                <div className="w-full flex flex-col gap-3 mt-2">
                    <button
                        onClick={handleWhatsApp}
                        className="w-full py-4 bg-[#25D366] text-white font-bold rounded-xl shadow-lg hover:bg-[#128C7E] transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">chat</span>
                        Enviar no WhatsApp
                    </button>

                    <button
                        onClick={() => onNavigate(Screen.RECEIPT)}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">receipt_long</span>
                        Ver Recibo / NF-e
                    </button>

                    <button
                        onClick={() => onNavigate(Screen.NEW_ORDER)}
                        className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                        Nova Venda
                    </button>

                    <button
                        onClick={() => onNavigate(Screen.DASHBOARD)}
                        className="text-slate-400 text-sm font-semibold hover:text-slate-600 mt-2"
                    >
                        Voltar ao Início
                    </button>
                </div>

            </div>
        </div>
    );
};
