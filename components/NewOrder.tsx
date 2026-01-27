import React, { useState } from 'react';
import { NavigationProps, Screen, Product } from '../types';
import { useStore } from '../context/StoreContext';


export const NewOrder: React.FC<NavigationProps> = ({ onNavigate }) => {
  const { inventory, addSale } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [selectedProduct, setSelectedProduct] = useState('Colchão');
  const [selectedSize, setSelectedSize] = useState('Casal (1.38 x 1.88)');

  /* ----------------------------------------------------- */
  /* CART LOGIC
  /* ----------------------------------------------------- */
  interface CartItem {
    id: string;
    product: string;
    category: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
  }

  const [cart, setCart] = useState<CartItem[]>([]);

  // Dynamic Categories from Inventory
  const categories = Array.from(new Set(inventory.map(i => i.category)));

  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'Todos');

  // Filter products based on Category and Size (if needed, simplified for now)
  const availableProducts = inventory.filter(p => p.category === selectedCategory);

  const [selectedProductObj, setSelectedProductObj] = useState<Product | null>(availableProducts[0] || null);

  // Update selected product when category changes
  React.useEffect(() => {
    if (availableProducts.length > 0) {
      setSelectedProductObj(availableProducts[0]);
    } else {
      setSelectedProductObj(null);
    }
  }, [selectedCategory]);

  const addToCart = () => {
    if (!selectedProductObj) return;

    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      product: selectedProductObj.name,
      category: selectedProductObj.category,
      size: selectedSize === 'other' ? 'Padrão' : selectedSize, // Simplified size for now
      quantity: quantity,
      price: selectedProductObj.price, // Use real price
      image: selectedProductObj.image
    };

    setCart(prev => [...prev, newItem]);

    // Reset selection logic if needed
    setQuantity(1);
    // Visual feedback could go here
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleFinish = () => {
    if (cart.length === 0) {
      alert("Adicione itens ao carrinho primeiro.");
      return;
    }

    if (!clientName) {
      alert("Preencha o nome do cliente.");
      return;
    }

    // 1. Create Sale
    addSale({
      clientName,
      clientPhone,
      clientAddress,
      items: cart.map(item => ({
        product: item.product,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      })),
      total: cartTotal,
      paymentMethod
    });

    // 2. Redirect
    onNavigate(Screen.POST_SALE);
  };

  // Client Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientCpf, setClientCpf] = useState('');

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white border-b border-slate-100 p-4 shadow-sm md:hidden">
        <button
          onClick={() => onNavigate(Screen.DASHBOARD)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Novo Pedido</h1>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-100 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Novo Pedido</h1>
        <div className="flex gap-2">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
            Carrinho: {cart.length} itens
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-6 p-4">
        {/* Section: Dados do Cliente */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
            <h2 className="text-base font-bold uppercase tracking-wide text-slate-500">Dados do Cliente</h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Nome Completo</label>
              <input
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:ring-primary"
                placeholder="Ex: João da Silva"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Endereço de Entrega</label>
              <input
                value={clientAddress}
                onChange={e => setClientAddress(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:ring-primary"
                placeholder="Rua, Número, Bairro"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Telefone</label>
                <input
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:ring-primary"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">CPF</label>
                <input
                  value={clientCpf}
                  onChange={e => setClientCpf(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:ring-primary"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section: Itens do Pedido */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">shopping_cart</span>
              <h2 className="text-base font-bold uppercase tracking-wide text-slate-500">Itens do Pedido</h2>
            </div>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">{quantity} Item(s)</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 relative overflow-hidden group">
              {/* Selection Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-slate-500">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm py-2.5"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Produto</label>
                  <select
                    value={selectedProductObj?.name || ''}
                    onChange={e => {
                      const prod = availableProducts.find(p => p.name === e.target.value);
                      setSelectedProductObj(prod || null);
                    }}
                    className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm py-2.5"
                  >
                    {availableProducts.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-primary"><span className="material-symbols-outlined text-[18px]">remove</span></button>
                  <span className="px-2 text-sm font-semibold w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-primary"><span className="material-symbols-outlined text-[18px]">add</span></button>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Preço Unit.</p>
                  <p className="text-lg font-bold text-slate-900">R$ {selectedProductObj?.price.toLocaleString('pt-BR') || '0,00'}</p>
                </div>
              </div>
            </div>

            <button
              disabled={!selectedProductObj}
              onClick={addToCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-sm font-bold text-primary transition-colors hover:bg-primary/10 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">add_shopping_cart</span>
              Adicionar ao Carrinho
            </button>

            {/* Cart Preview */}
            {cart.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                <h3 className="font-bold text-sm text-slate-600">Itens no Carrinho ({cart.length})</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-slate-100 rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }}></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.quantity}x {item.product}</p>
                        <p className="text-xs text-slate-500">{item.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">R$ {(item.price * item.quantity).toLocaleString('pt-BR')}</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded-full">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section: Resumo e Pagamento */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
            <h2 className="text-base font-bold uppercase tracking-wide text-slate-500">Pagamento</h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex flex-col gap-3 mb-6">
              <label className="text-sm font-medium text-slate-700">Forma de Pagamento</label>
              <div className="grid grid-cols-3 gap-2">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    className="peer sr-only"
                    checked={paymentMethod === 'pix'}
                    onChange={() => setPaymentMethod('pix')}
                  />
                  <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white p-3 text-slate-500 transition-all peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary hover:bg-slate-50 peer-checked:ring-0">
                    <span className="material-symbols-outlined text-[20px]">photos</span>
                    <span className="text-xs font-bold">Pix/Din</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    className="peer sr-only"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white p-3 text-slate-500 transition-all peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary hover:bg-slate-50 peer-checked:ring-0">
                    <span className="material-symbols-outlined text-[20px]">credit_card</span>
                    <span className="text-xs font-bold">Cartão</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    className="peer sr-only"
                    checked={paymentMethod === 'other'}
                    onChange={() => setPaymentMethod('other')}
                  />
                  <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white p-3 text-slate-500 transition-all peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary hover:bg-slate-50 peer-checked:ring-0">
                    <span className="material-symbols-outlined text-xs">more_horiz</span>
                    <span className="text-xs font-bold">Outro</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Itens ({cart.length})</span>
                <span>R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-base font-bold text-slate-900">Total a Pagar</span>
                <span className="text-2xl font-extrabold text-primary">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 md:static md:shadow-none md:border-none md:bg-transparent">
        <button
          onClick={handleFinish}
          disabled={cart.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-transform active:scale-[0.98] hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">check_circle</span>
          Finalizar e Gerar Comprovante
        </button>
      </div>
    </div>
  );
};