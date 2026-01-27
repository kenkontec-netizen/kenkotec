import React, { useState } from 'react';
import { NavigationProps, Screen } from '../types';
import { useStore } from '../context/StoreContext';

export const Receipt: React.FC<NavigationProps> = ({ onNavigate }) => {
  const { selectedReceiptSale, inventory } = useStore();
  const currentSale = selectedReceiptSale;
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!currentSale) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
        <span className="material-symbols-outlined text-4xl">description</span>
        <p>Nenhuma venda selecionada.</p>
        <button onClick={() => onNavigate(Screen.SALES)} className="text-primary font-bold">Voltar para Vendas</button>
      </div>
    );
  }

  // Helper to find NCM
  const getNcm = (productName: string) => {
    const product = inventory.find(p => p.name === productName);
    return product?.ncm || '0000.00.00';
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, label }: { text: string, label: string }) => (
    <button
      onClick={() => copyToClipboard(text, label)}
      className="ml-2 p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors group relative"
      title="Copiar"
    >
      <span className="material-symbols-outlined text-[18px]">
        {copiedField === label ? 'check' : 'content_copy'}
      </span>
      {copiedField === label && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap animate-in fade-in zoom-in duration-200">
          Copiado!
        </span>
      )}
    </button>
  );

  return (
    <div className="bg-background-light min-h-screen flex flex-col relative pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4 flex items-center gap-4">
        <button
          onClick={() => onNavigate(Screen.SALES)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">Dados para NF-e</h1>
          <p className="text-xs text-slate-500">Venda #{currentSale.id}</p>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-6 max-w-3xl mx-auto w-full">
        {/* Client Section */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-500">person</span>
            <h2 className="font-bold text-slate-700">Dados do Destinatário</h2>
          </div>
          <div className="p-4 grid gap-4">
            {/* Name */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Nome / Razão Social</label>
                <p className="font-medium text-slate-900">{currentSale.clientName}</p>
              </div>
              <CopyButton text={currentSale.clientName} label="cliente" />
            </div>

            {/* Address */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Endereço Completo</label>
                <p className="font-medium text-slate-900">{currentSale.clientAddress}</p>
              </div>
              <CopyButton text={currentSale.clientAddress} label="endereco" />
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Telefone</label>
                <p className="font-medium text-slate-900">{currentSale.clientPhone}</p>
              </div>
              <CopyButton text={currentSale.clientPhone} label="telefone" />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-500">inventory_2</span>
            <h2 className="font-bold text-slate-700">Produtos</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {currentSale.items.map((item, idx) => (
              <div key={idx} className="p-4 transition-colors hover:bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-slate-900">{item.product}</p>
                    <p className="text-xs text-slate-500">{item.quantity}x unidades | {item.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-slate-400">Total Item: R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>

                {/* NFe Codes */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">NCM:</span>
                    <span className="font-mono text-sm font-bold text-slate-700">{getNcm(item.product)}</span>
                    <CopyButton text={getNcm(item.product)} label={`ncm-${idx}`} />
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">CFOP:</span>
                    <span className="font-mono text-sm font-bold text-slate-700">5102</span>
                    <CopyButton text="5102" label={`cfop-${idx}`} />
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">CST/CSOSN:</span>
                    <span className="font-mono text-sm font-bold text-slate-700">102</span>
                    <CopyButton text="102" label={`cst-${idx}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Total Section */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <span className="font-bold text-slate-500">VALOR TOTAL DA NOTA</span>
            <span className="text-xl font-bold text-slate-900">R$ {currentSale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </section>

        <div className="text-center text-xs text-slate-400 mt-4">
          <p>Use estes dados para preencher o emissor de NF-e do Sebrae.</p>
        </div>
      </div>
    </div>
  );
};