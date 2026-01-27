import React from 'react';
import { NavigationProps, Screen } from '../types';
import { useStore } from '../context/StoreContext';
import { SalesChart } from './SalesChart';


export const Dashboard: React.FC<NavigationProps> = ({ onNavigate }) => {
  const { sales, inventory } = useStore();

  // Date Helpers
  const today = new Date();
  const todayStr = today.toLocaleString('pt-BR').split(',')[0].trim(); // "dd/mm/yyyy"
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const todaySalesTotal = sales
    .filter(s => s.date.includes(todayStr) && (s.status === 'paid' || s.status === 'finalized'))
    .reduce((acc, s) => acc + s.total, 0);

  const monthSalesTotal = sales
    .filter(s => {
      if (s.status !== 'paid' && s.status !== 'finalized') return false;
      // Parse "dd/mm/yyyy"
      const parts = s.date.split(' ')[0].split('/');
      if (parts.length < 3) return false;
      const month = parseInt(parts[1]) - 1;
      const year = parseInt(parts[2]);
      return month === currentMonth && year === currentYear;
    })
    .reduce((acc, s) => acc + s.total, 0);

  const lowStockItems = inventory.filter(i => i.quantity <= 5).slice(0, 5);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden pb-20 bg-background-light">
      {/* Header */}
      <div className="flex items-center bg-white p-4 pb-2 justify-between sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <div className="flex size-12 shrink-0 items-center md:hidden">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/10"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCeiQFben3dWgPZOPO91rDYkL_YTMKaHc2dAqbFzOk7nwa2ZeRv_UZbPuxQZt75NQVY71MRbRyvj1bNitGpnL-oQFpzhX-cUv9sBM_HMxZu05jmPHQd8nqP-b86KII-wyg53XaJ59S5V_sRziqESKHM2ihFa989Hetgqkii3gu93HkiNG15YWKUlLx-q_Z94-QeYeuRh36zudvxK1PBleHsZj7Ag0N3JeAfmfSrenoO860WmUZ0jJqZr9LhYE6qkUodkHzHRiSgN2s")',
            }}
          ></div>
        </div>
        <h2 className="text-[#111418] text-xl font-extrabold leading-tight tracking-[-0.015em] flex-1 ml-3 md:hidden">
          Kenkotec
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-transparent text-[#111418] hover:bg-black/5 transition-colors">
            <span className="material-symbols-outlined text-[24px]">notifications</span>
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className="bg-white px-4 pt-6 pb-2">
        <h2 className="text-[#111418] tracking-tight text-[28px] font-bold leading-tight">Olá, Gestor</h2>
        <p className="text-[#617589] text-sm font-medium mt-1">Aqui está o resumo da sua loja hoje.</p>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* KPI Cards */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Card 1 */}
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-5 bg-white shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <p className="text-[#617589] text-sm font-semibold leading-normal">Vendas de Hoje</p>
            </div>
            <p className="text-[#111418] tracking-tight text-2xl font-bold leading-tight">
              R$ {todaySalesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1 text-[#078838] bg-green-50 w-fit px-2 py-1 rounded-md">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <p className="text-xs font-bold leading-normal">+12% vs ontem</p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-5 bg-white shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <p className="text-[#617589] text-sm font-semibold leading-normal">Faturamento Mensal</p>
            </div>
            <p className="text-[#111418] tracking-tight text-2xl font-bold leading-tight">
              R$ {(monthSalesTotal / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k
            </p>
            <div className="flex items-center gap-1 text-[#078838] bg-green-50 w-fit px-2 py-1 rounded-md">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <p className="text-xs font-bold leading-normal">+5% este mês</p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 h-[400px]">
            <SalesChart />
          </div>

          {/* Side Column: Inventory */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col h-[400px]">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">Resumo de Estoque</h3>
              <button
                className="text-primary text-sm font-bold"
                onClick={() => onNavigate(Screen.INVENTORY)}
              >
                Ver tudo
              </button>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 custom-scrollbar">
              {lowStockItems.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center my-auto">Estoque saudável!</div>
              ) : (
                lowStockItems.map(item => (
                  <div key={item.id} className="flex gap-3 items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <div
                        className="w-full h-full bg-center bg-no-repeat bg-cover"
                        style={{ backgroundImage: `url("${item.image}")` }}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#111418] text-sm font-bold leading-normal truncate">{item.name}</p>
                      <div className={`flex items-center gap-1 text-xs ${item.quantity <= 2 ? 'text-red-600' : 'text-yellow-600'}`}>
                        <span className="font-bold">{item.quantity} restantes</span>
                        {item.quantity <= 2 && <span className="text-[10px] bg-red-100 px-1 rounded">Crítico</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}

      </div>

      <div className="h-24"></div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-20 px-2 pb-2 z-50 md:hidden">
        <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-primary">
          <span className="material-symbols-outlined fill-1">dashboard</span>
          <span className="text-[10px] font-bold">Início</span>
        </button>
        <button
          onClick={() => onNavigate(Screen.INVENTORY)}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-[#617589] hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">inventory</span>
          <span className="text-[10px] font-medium">Estoque</span>
        </button>
        <button
          onClick={() => onNavigate(Screen.SALES)}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-[#617589] hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">attach_money</span>
          <span className="text-[10px] font-medium">Vendas</span>
        </button>
        <button
          onClick={() => onNavigate(Screen.SETTINGS)}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-[#617589] hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-medium">Ajustes</span>
        </button>
      </div>
    </div >
  );
};