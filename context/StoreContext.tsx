import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Sale, Customer } from '../types';
import { supabase } from '../lib/supabaseClient';

export interface StoreContextType {
    inventory: Product[];
    sales: Sale[];
    customers: Customer[];
    addToInventory: (product: Omit<Product, 'id' | 'lastUpdated'>) => Promise<string | null>;
    removeFromInventory: (id: string, qty: number) => Promise<void>;
    addSale: (sale: Omit<Sale, 'id' | 'date' | 'status'>) => Promise<void>;
    addCustomer: (customer: Omit<Customer, 'id' | 'totalSpent' | 'lastPurchase'>) => Promise<void>;
    updateStock: (id: string, updates: Partial<Product>) => Promise<void>;
    updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
    selectedReceiptSale: Sale | null;
    setSelectedReceiptSale: (sale: Sale | null) => void;
    loading: boolean;
    resetDatabase: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inventory, setInventory] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedReceiptSale, setSelectedReceiptSale] = useState<Sale | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Products
            const { data: productsData, error: productsError } = await supabase.from('products').select('*');
            if (productsError) {
                console.error('Error fetching products:', productsError);
            } else {
                setInventory(productsData?.map(p => ({
                    ...p,
                    lastUpdated: p.last_updated,
                    costPrice: p.cost_price
                })) || []);
            }

            // Sales
            const { data: salesData, error: salesError } = await supabase.from('sales').select('*').order('date', { ascending: false });
            if (salesError) {
                console.error('Error fetching sales:', salesError);
            } else {
                setSales(salesData?.map(s => ({
                    ...s,
                    clientName: s.client_name,
                    clientPhone: s.client_phone,
                    clientAddress: s.client_address,
                    paymentMethod: s.payment_method,
                    deliveryStatus: s.delivery_status
                })) || []);
            }

            // Customers
            const { data: customersData, error: customersError } = await supabase.from('customers').select('*');
            if (customersError) {
                console.error('Error fetching customers:', customersError);
            } else {
                setCustomers(customersData?.map(c => ({
                    ...c,
                    totalSpent: c.total_spent,
                    lastPurchase: c.last_purchase
                })) || []);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addToInventory = async (product: Omit<Product, 'id' | 'lastUpdated'>) => {
        const dbProduct = {
            ...product,
            last_updated: 'Agora',
            // Ensure optional fields are handled if needed, assuming Supabase ignores undefined keys or we explicitly map
            cost_price: product.costPrice
        };
        // Remove undefined costPrice from object to avoid sending undefined to DB if not needed, or let Supabase handle it
        if (dbProduct.cost_price === undefined) delete (dbProduct as any).cost_price;
        if ((dbProduct as any).costPrice !== undefined) delete (dbProduct as any).costPrice;


        const { data, error } = await supabase.from('products').insert(dbProduct).select().single();
        if (error) {
            console.error('Error adding product:', error);
            return error.message;
        }

        const newProduct: Product = {
            ...data,
            lastUpdated: data.last_updated,
            costPrice: data.cost_price
        };
        setInventory(prev => [newProduct, ...prev]);
        return null;
    };

    const removeFromInventory = async (id: string, qty: number) => {
        const item = inventory.find(i => i.id === id);
        if (!item) return;

        const newQty = Math.max(0, item.quantity - qty);
        const { error } = await supabase.from('products').update({ quantity: newQty }).eq('id', id);

        if (error) {
            console.error('Error updating inventory:', error);
            return;
        }

        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const addSale = async (sale: Omit<Sale, 'id' | 'date' | 'status'>) => {
        const currentDate = new Date().toJSON().slice(0, 10).split('-').reverse().join('/') + ' ' + new Date().toLocaleTimeString('pt-BR');

        const dbSale = {
            client_name: sale.clientName,
            client_phone: sale.clientPhone,
            client_address: sale.clientAddress,
            items: sale.items,
            total: sale.total,
            payment_method: sale.paymentMethod,
            seller: '14-PADRAO 2',
            status: 'paid',
            date: currentDate
        };

        const { data: newSaleData, error: saleError } = await supabase.from('sales').insert(dbSale).select().single();

        if (saleError) {
            console.error('Error creating sale:', saleError);
            return;
        }

        const newSale: Sale = {
            ...newSaleData,
            clientName: newSaleData.client_name,
            clientPhone: newSaleData.client_phone,
            clientAddress: newSaleData.client_address,
            paymentMethod: newSaleData.payment_method,
            deliveryStatus: newSaleData.delivery_status
        };

        setSales(prev => [newSale, ...prev]);
        setSelectedReceiptSale(newSale);

        // Update Customers Logic
        const existingCustomer = customers.find(c => c.name.toLowerCase() === sale.clientName.toLowerCase());

        if (existingCustomer) {
            const updates = {
                total_spent: existingCustomer.totalSpent + sale.total,
                last_purchase: 'Hoje',
                phone: sale.clientPhone || existingCustomer.phone,
                address: sale.clientAddress || existingCustomer.address
            };

            const { error: custError } = await supabase.from('customers').update(updates).eq('id', existingCustomer.id);
            if (!custError) {
                setCustomers(prev => prev.map(c =>
                    c.id === existingCustomer.id
                        ? { ...c, totalSpent: updates.total_spent, lastPurchase: updates.last_purchase, phone: updates.phone, address: updates.address! }
                        : c
                ));
            }
        } else {
            const newCustomerPayload = {
                name: sale.clientName,
                phone: sale.clientPhone,
                address: sale.clientAddress,
                total_spent: sale.total,
                last_purchase: 'Hoje'
            };
            const { data: newCustData, error: custError } = await supabase.from('customers').insert(newCustomerPayload).select().single();
            if (!custError && newCustData) {
                const newCustomer: Customer = {
                    ...newCustData,
                    totalSpent: newCustData.total_spent,
                    lastPurchase: newCustData.last_purchase
                };
                setCustomers(prev => [newCustomer, ...prev]);
            }
        }

        // Deduction Logic
        // We use the same heuristic as before to find products locally and then update them in DB
        const updatesToRun: PromiseLike<any>[] = [];
        const localInventoryUpdates = [...inventory];

        sale.items.forEach(saleItem => {
            const productIndex = localInventoryUpdates.findIndex(p => {
                // Priority: Match by ID
                if (saleItem.productId && p.id === saleItem.productId) {
                    return true;
                }

                // Fallback: Name & Category & Size heuristic
                const nameMatch = p.name.toLowerCase().includes(saleItem.product.toLowerCase());
                const categoryMatch = p.category.toLowerCase().includes(saleItem.product.toLowerCase());
                const sizeMatch = p.size.toLowerCase().includes(saleItem.size.split(' ')[0].toLowerCase());
                return (nameMatch || categoryMatch) && sizeMatch;
            });

            if (productIndex !== -1) {
                const product = localInventoryUpdates[productIndex];
                const newQty = Math.max(0, product.quantity - saleItem.quantity);

                // Update Local (to keep track for next items in loop if any duplicates - though unlikely)
                localInventoryUpdates[productIndex] = { ...product, quantity: newQty, lastUpdated: 'Agora' };

                // Queue DB update
                updatesToRun.push(supabase.from('products').update({ quantity: newQty, last_updated: 'Agora' }).eq('id', product.id));
            }
        });

        await Promise.all(updatesToRun);
        setInventory(localInventoryUpdates);
    };

    const addCustomer = async (customer: Omit<Customer, 'id' | 'totalSpent' | 'lastPurchase'>) => {
        const dbCustomer = {
            name: customer.name,
            phone: customer.phone,
            address: customer.address,
            total_spent: 0,
            last_purchase: 'Nunca'
        };

        const { data, error } = await supabase.from('customers').insert(dbCustomer).select().single();
        if (error) {
            console.error('Error adding customer:', error);
            return;
        }

        const newCustomer: Customer = {
            ...data,
            totalSpent: data.total_spent,
            lastPurchase: data.last_purchase
        };
        setCustomers(prev => [newCustomer, ...prev]);
    };

    const updateStock = async (id: string, updates: Partial<Product>) => {
        const dbUpdates: any = { ...updates, last_updated: 'Agora' };
        if (updates.lastUpdated) delete dbUpdates.lastUpdated; // remove camelCase if present
        if (updates.costPrice) {
            dbUpdates.cost_price = updates.costPrice;
            delete dbUpdates.costPrice;
        }

        const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);

        if (error) {
            console.error('Error updating stock:', error);
            return;
        }

        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, ...updates, lastUpdated: 'Agora' };
            }
            return item;
        }));
    };

    const updateSale = async (id: string, updates: Partial<Sale>) => {
        const dbUpdates: any = { ...updates };
        if (updates.clientName) { dbUpdates.client_name = updates.clientName; delete dbUpdates.clientName; }
        if (updates.clientPhone) { dbUpdates.client_phone = updates.clientPhone; delete dbUpdates.clientPhone; }
        if (updates.clientAddress) { dbUpdates.client_address = updates.clientAddress; delete dbUpdates.clientAddress; }
        if (updates.paymentMethod) { dbUpdates.payment_method = updates.paymentMethod; delete dbUpdates.paymentMethod; }
        if (updates.deliveryStatus) { dbUpdates.delivery_status = updates.deliveryStatus; delete dbUpdates.deliveryStatus; }

        const { error } = await supabase.from('sales').update(dbUpdates).eq('id', id);

        if (error) {
            console.error('Error updating sale:', error);
            return;
        }

        setSales(prev => prev.map(sale => {
            if (sale.id === id) {
                return { ...sale, ...updates };
            }
            return sale;
        }));
    };

    const resetDatabase = async () => {
        setLoading(true);
        try {
            // 1. Delete all Sales
            const { error: salesError } = await supabase.from('sales').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to delete all
            if (salesError) throw salesError;

            // 2. Delete all Customers
            const { error: customersError } = await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            if (customersError) throw customersError;

            // 3. Reset Inventory (Set quantity to 0)
            const { error: productsError } = await supabase.from('products').update({ quantity: 0, last_updated: 'Reset' }).neq('id', '00000000-0000-0000-0000-000000000000');
            if (productsError) throw productsError;

            // Update State
            setSales([]);
            setCustomers([]);
            setInventory(prev => prev.map(p => ({ ...p, quantity: 0, lastUpdated: 'Reset' })));

        } catch (error) {
            console.error("Error resetting database:", error);
            alert("Erro ao resetar o banco de dados. Verifique o console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <StoreContext.Provider value={{
            inventory,
            sales,
            customers,
            addToInventory,
            removeFromInventory,
            addSale,
            addCustomer,
            updateStock,
            updateSale,
            selectedReceiptSale,
            setSelectedReceiptSale,
            loading,
            resetDatabase
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
