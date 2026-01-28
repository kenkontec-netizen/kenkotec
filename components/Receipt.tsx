import React, { useRef } from 'react';
import { NavigationProps, Screen } from '../types';
import { useStore } from '../context/StoreContext';

export const Receipt: React.FC<NavigationProps> = ({ onNavigate }) => {
  const { selectedReceiptSale } = useStore();
  const currentSale = selectedReceiptSale;
  const printRef = useRef<HTMLDivElement>(null);

  if (!currentSale) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
        <span className="material-symbols-outlined text-4xl">description</span>
        <p>Nenhuma venda selecionada.</p>
        <button onClick={() => onNavigate(Screen.SALES)} className="text-primary font-bold">Voltar para Vendas</button>
      </div>
    );
  }

  const handlePrint = () => {
    // Add printable class to the specific element we want to print
    if (printRef.current) {
      printRef.current.classList.add('printable-area');
      window.print();
      // Remove it after printing so it doesn't mess up layout if user cancels
      printRef.current.classList.remove('printable-area');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr || Date.now());
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col relative pb-20">
      {/* Function Bar - Hidden on Print */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4 flex items-center justify-between no-print shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate(Screen.SALES)}
            className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold leading-tight">Visualizar Recibo</h1>
            <p className="text-xs text-slate-500">Venda #{currentSale.id}</p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined">print</span>
          Imprimir
        </button>
      </header>

      {/* Printable Area */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div ref={printRef} className="bg-white max-w-2xl mx-auto shadow-sm border border-slate-200 p-8 min-h-[20cm] text-slate-900">

          {/* Receipt Header */}
          <div className="grid grid-cols-[100px_1fr] gap-6 border-b-2 border-slate-100 pb-8 mb-8">
            <div className="size-24 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
              <span className="material-symbols-outlined text-4xl">storefront</span>
              {/* Placeholder for Logo */}
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Kenkotec Colchões</h1>
              <p className="text-sm text-slate-500 mt-1">Soluções em Saúde e Bem-estar</p>
              <div className="mt-4 flex gap-6 text-xs text-slate-400">
                <p>CNPJ: 00.000.000/0001-00</p>
                <p>Tel: (00) 0000-0000</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">RECIBO</h2>
              <p className="font-mono text-slate-500 mt-1">#{currentSale.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Data de Emissão</p>
              <p className="text-sm font-medium">{formatDate(currentSale.date)}</p>
            </div>
          </div>

          {/* Client Info */}
          <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 border-b border-slate-200 pb-2">Dados do Cliente</h3>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Nome</p>
                <p className="text-sm font-bold text-slate-800">{currentSale.clientName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Telefone</p>
                <p className="text-sm text-slate-700">{currentSale.clientPhone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Endereço de Entrega</p>
                <p className="text-sm text-slate-700">{currentSale.clientAddress}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-100 text-xs text-slate-400 font-bold uppercase">
                  <th className="pb-3 w-16">Qtd</th>
                  <th className="pb-3">Descrição / Produto</th>
                  <th className="pb-3 text-right">Unitário</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {currentSale.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-50">
                    <td className="py-4 font-bold text-slate-500">{item.quantity}</td>
                    <td className="py-4">
                      <p className="font-bold text-slate-800">{item.product}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.size}</p>
                    </td>
                    <td className="py-4 text-right text-slate-500">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 text-right font-bold text-slate-800">R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>R$ {currentSale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 border-b border-slate-100 pb-3">
                <span>Desconto</span>
                <span>R$ 0,00</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-bold text-slate-900">Total a Pagar</span>
                <span className="text-2xl font-bold text-primary">R$ {currentSale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-right">
                <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-medium mt-2">
                  Pagamento via {currentSale.paymentMethod === 'pix' ? 'Pix/Dinheiro' : currentSale.paymentMethod === 'card' ? 'Cartão' : 'Outro'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer / Signature */}
          <div className="mt-auto pt-12 text-center">
            <div className="border-t border-slate-300 w-64 mx-auto mb-2"></div>
            <p className="text-xs text-slate-400">Assinatura do Recebedor</p>
            <p className="text-[10px] text-slate-300 mt-8">Gerado por Kenkotec System</p>
          </div>

        </div>
      </div>
    </div>
  );
};