import React, { useState } from 'react';
import { NavigationProps, Screen, Product } from '../types';
import { useStore } from '../context/StoreContext';

export const Inventory: React.FC<NavigationProps> = ({ onNavigate }) => {
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Product State
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Colchões',
    size: '',
    quantity: 0,
    price: 0,
    costPrice: 0,
    ncm: '',
    image: ''
  });

  const { inventory, updateStock, addToInventory } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editPrice, setEditPrice] = useState<number>(0);

  const categories = ['Todos', 'Colchões', 'Cabeceiras', 'Box/Baú', 'Travesseiros', 'Agarradinhos'];

  const filteredInventory = selectedCategory === 'Todos'
    ? inventory
    : inventory.filter(item => item.category === selectedCategory);

  const handleOpenEdit = (item: Product) => {
    setEditingItem(item);
    setEditQuantity(item.quantity);
    setEditPrice(item.price);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      updateStock(editingItem.id, {
        quantity: editQuantity,
        price: editPrice
      });
      setIsEditModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleSaveNewProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      alert('Nome e Categoria são obrigatórios.');
      return;
    }

    addToInventory({
      ...newProduct,
      image: newProduct.image || 'https://via.placeholder.com/150', // Default image
    });

    setIsNewProductModalOpen(false);
    setNewProduct({
      name: '',
      category: 'Colchões',
      size: '',
      quantity: 0,
      price: 0,
      ncm: '',
      image: ''
    });
  };

  return (
    <div className="bg-background-light text-slate-900 font-display min-h-screen flex flex-col relative">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center p-4 gap-4">
          <button
            onClick={() => onNavigate(Screen.DASHBOARD)}
            className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900 md:hidden"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold leading-tight flex-1">Estoque</h1>
          <div className="flex gap-2">
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-900">
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex h-9 shrink-0 items-center justify-center px-5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col gap-6 pb-24">
        {/* Inventory List */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              {selectedCategory === 'Todos' ? 'Estoque Geral' : selectedCategory}
            </h3>
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
              {filteredInventory.length} itens
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {filteredInventory.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                <p>Nenhum produto encontrado nesta categoria.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                      <th className="p-3 w-16">Img</th>
                      <th className="p-3">Produto</th>
                      <th className="p-3 text-right">Custo</th>
                      <th className="p-3 text-right">Venda</th>
                      <th className="p-3 text-right">Margem</th>
                      <th className="p-3 text-center">Estoque</th>
                      <th className="p-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredInventory.map((item) => {
                      const margin = item.costPrice ? ((item.price - item.costPrice) / item.price) * 100 : 0;
                      const isLowStock = item.quantity < 2;
                      const isWarningStock = item.quantity >= 2 && item.quantity < 5;

                      return (
                        <tr
                          key={item.id}
                          className={`border-b border-slate-100 hover:bg-slate-50 transition-colors 
                                        ${isLowStock ? 'bg-red-50 text-red-900' : isWarningStock ? 'bg-yellow-50 text-yellow-900' : ''}
                                    `}
                        >
                          <td className="p-2">
                            <div className="size-10 rounded bg-slate-200 bg-cover bg-center border border-black/10" style={{ backgroundImage: `url(${item.image})` }}></div>
                          </td>
                          <td className="p-2">
                            <div className="font-bold">{item.name}</div>
                            <div className="text-[10px] opacity-70">{item.category} • {item.size}</div>
                          </td>
                          <td className="p-2 text-right font-medium text-slate-500">
                            {item.costPrice ? `R$ ${item.costPrice.toLocaleString('pt-BR')}` : '-'}
                          </td>
                          <td className="p-2 text-right font-bold">
                            R$ {item.price.toLocaleString('pt-BR')}
                          </td>
                          <td className="p-2 text-right">
                            {item.costPrice ? (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${margin > 30 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                {margin.toFixed(0)}%
                              </span>
                            ) : '-'}
                          </td>
                          <td className="p-2 text-center">
                            {isLowStock ? (
                              <div className="flex items-center justify-center gap-1 font-bold text-red-600 animate-pulse">
                                <span className="material-symbols-outlined text-sm">warning</span>
                                {item.quantity}
                              </div>
                            ) : (
                              <span className="font-bold">{item.quantity}</span>
                            )}
                          </td>
                          <td className="p-2 flex justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1 hover:bg-black/5 rounded text-slate-500 hover:text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section >
      </main >

      {/* FAB */}
      < div className="fixed bottom-6 right-6 z-40" >
        <button
          onClick={() => setIsNewProductModalOpen(true)}
          className="flex items-center justify-center gap-2 h-14 pl-5 pr-6 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl">add_circle</span>
          Adicionar Entrada
        </button>
      </div >

      {/* Edit Modal Overlay */}
      {
        isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-lg text-slate-900">Editar Produto</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <div className="size-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img src={editingItem?.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 line-clamp-1">{editingItem?.name}</p>
                    <p className="text-xs text-slate-500">{editingItem?.size} • {editingItem?.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Quantidade</label>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setEditQuantity(Math.max(0, editQuantity - 1))}
                        className="px-3 py-3 hover:bg-slate-50 active:bg-slate-100 border-r border-slate-100"
                      >
                        <span className="material-symbols-outlined text-xs">remove</span>
                      </button>
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                        className="w-full text-center font-bold text-slate-900 outline-none p-2"
                      />
                      <button
                        onClick={() => setEditQuantity(editQuantity + 1)}
                        className="px-3 py-3 hover:bg-slate-50 active:bg-slate-100 border-l border-slate-100"
                      >
                        <span className="material-symbols-outlined text-xs">add</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Preço (R$)</label>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <span className="pl-3 text-slate-400 font-bold text-sm">R$</span>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                        className="w-full font-bold text-slate-900 outline-none p-3 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* New Product Modal Overlay */}
      {
        isNewProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-lg text-slate-900">Novo Produto</h3>
                <button onClick={() => setIsNewProductModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome do Produto</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold text-slate-900"
                    placeholder="Ex: Colchão Premium"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold text-slate-900 bg-white"
                  >
                    {categories.filter(c => c !== 'Todos').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tamanho</label>
                    <input
                      type="text"
                      value={newProduct.size}
                      onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold text-slate-900"
                      placeholder="Ex: Casal"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">NCM</label>
                    <input
                      type="text"
                      value={newProduct.ncm}
                      onChange={(e) => setNewProduct({ ...newProduct, ncm: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold text-slate-900"
                      placeholder="0000.00.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Quantidade</label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold text-slate-900"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Preço de Custo (R$)</label>
                    <input
                      type="number"
                      value={newProduct.costPrice || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })}
                      className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold text-slate-900"
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-primary font-bold text-slate-900"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveNewProduct}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};