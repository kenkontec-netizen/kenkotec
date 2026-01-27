import React, { createContext, useContext, useState, useEffect } from 'react';

// Types moved to types.ts
import { Product, Sale, Customer } from '../types';

export interface StoreContextType {
    inventory: Product[];
    sales: Sale[];
    customers: Customer[];
    addToInventory: (product: Omit<Product, 'id' | 'lastUpdated'>) => void;
    removeFromInventory: (id: string, qty: number) => void;
    addSale: (sale: Omit<Sale, 'id' | 'date' | 'status'>) => void;
    addCustomer: (customer: Omit<Customer, 'id' | 'totalSpent' | 'lastPurchase'>) => void;
    updateStock: (id: string, updates: Partial<Product>) => void;
    updateSale: (id: string, updates: Partial<Sale>) => void;
    selectedReceiptSale: Sale | null;
    setSelectedReceiptSale: (sale: Sale | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Mock Data
const INITIAL_INVENTORY: Product[] = [
    {
        id: '1',
        name: 'Colchão Magnético Premium',
        category: 'Colchões',
        size: 'Casal 1.38x1.88',
        quantity: 12,
        price: 2490,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-CVoA9g4iIEFCuepLvFSRanZ_be-JZKTeH-IKKAXED6nRmhc3frlffw-ELTzUgSCs7dP7vKnRz3YrVQqJSRgmBOfLerAxcPfIAl4T9NR4TEzcvfUvhgtUjOnz8BBNbC-J2kkmIWwU4U5jmRxfGTLIftwGVE6wSZe3bQGU16ej3NH2SupVPNZpCYE8h6wyNcIVTrao6ylOuAQT6uPekNfk812rECExheOgn_AyEIY2hvsJyrAs448o-R3B1m-Aeye5DAAFb7VJIqM',
        ncm: '9404.29.00',
        lastUpdated: 'Hoje'
    },
    {
        id: '2',
        name: 'Cabeceira Estofada Luxo',
        category: 'Cabeceiras',
        size: 'Queen 1.58',
        quantity: 5,
        price: 890,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDu6hG9aZOI2fdu-dthT7EnUNCOl3dJkTnkmcEVTOIXLDadKOEEZuaJ2-L5IQHff0C3WN0BzKmp8GagvW-sJ-grXP8OWYuLxILZfSvCDNpBEGQI5as05HEEEGyuPWIk58opQvXgQfKkW7yDfTmev5SA4S9V9sJ0YC0X66LBS0SIizy1lGVjOB2FklXZZppb1TSOwvd2q4jx96RvvtXWMbPea4l1Z5gvh6TCOiaHKHpUVlPx_5KGPpv8aON6HipIwqksx0dOjTyODQ',
        ncm: '9403.50.00',
        lastUpdated: '14 Out'
    },
    {
        id: '3',
        name: 'Travesseiro Visco NASA',
        category: 'Travesseiros',
        size: 'Padrão',
        quantity: 42,
        price: 150,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8djW9Vu4XpAAkuG-2ex8VLtDA2vXKU6J4LSiUJ6GnfdAg5GbJx31jkN3t213LCL0Lgc3ybYXbc9cskbj68fFudpNF5gG5IMof0PDWQCeymmgUgKhcFa8uUYEYvRdMrzW8y2RQRZqOzDOkg6tuCAbF2PqxVa3PHjmzBtHK3uRsAytUwqdp8H-5qKeQqoInttIbRxdbBAxlbivkIvaRsiSA8E1OBSkZAoh8OaiSZoV2oDf5L6j382cYiY-UsQyh-45xs_gzx15R_n0',
        ncm: '9404.90.00',
        lastUpdated: 'Ontem'
    },
    {
        id: '4',
        name: 'Box Baú Blindado',
        category: 'Box/Baú',
        size: 'Solteiro 0.88',
        quantity: 8,
        price: 1200,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsXqd7PyKEj2OrZMH1SPk1CYfhcAjw0AWhD1jLnHx1PnrZWjOMXsVOh4R9vkyUd3_EtIX8L6VCCe9BMynMKFIKp2Q2liU8xPFlQ6MgMHp81ZjsjXZDfYlenqyUrmaO1Cv_h2U3ZSaIwPpp33wIMbJ9c-1EpVWJcgbOOL2c9ENTdrBElKCIujrXiFP0sPBw0djOUfWvdSiUWFA7Ct7jzDr55_zC7QSdlENMSvVYzmozW0tEi9ByZBuM8RwB--CCQD3_YEqyi2u84c',
        ncm: '9403.50.00',
        lastUpdated: '12 Out'
    }
];

// Helper for dates
const getDate = (daysAgo: number, time: string = '12:00:00') => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const [dateStr] = d.toLocaleString('pt-BR').split(',');
    return `${dateStr} ${time}`;
};

const INITIAL_SALES: Sale[] = [
    {
        id: '#1025',
        clientName: 'Roberto Almeida',
        clientPhone: '11987654321',
        clientAddress: 'Av. Paulista, 1000',
        items: [{ product: 'Colchão Magnético Premium', size: 'Casal 1.38x1.88', quantity: 1, price: 3490 }],
        total: 3490,
        paymentMethod: 'Crédito',
        date: getDate(0, '14:30:00'),
        seller: '14-PADRAO 2',
        status: 'paid'
    },
    {
        id: '#1024',
        clientName: 'Carla Dias',
        clientPhone: '11999998888',
        clientAddress: 'Rua Augusta, 500',
        items: [
            { product: 'Cabeceira Estofada Luxo', size: 'Queen 1.58', quantity: 2, price: 890 },
            { product: 'Travesseiro Visco NASA', size: 'Padrão', quantity: 4, price: 150 }
        ],
        total: 2380,
        paymentMethod: 'Pix',
        date: getDate(0, '10:15:00'),
        seller: '09-MARIA',
        status: 'paid'
    },
    {
        id: '#1023',
        clientName: 'Empresa Hotelaria Ltda',
        clientPhone: '1133334444',
        clientAddress: 'Rua dos Hotéis, 10',
        items: [{ product: 'Colchão Magnético Premium', size: 'Casal 1.38x1.88', quantity: 2, price: 2490 }],
        total: 4980,
        paymentMethod: 'Boleto',
        date: getDate(0, '08:45:00'),
        status: 'paid'
    },
    // Yesterday
    {
        id: '#1022',
        clientName: 'Fernanda Costa',
        clientPhone: '21987651234',
        clientAddress: 'Rua da Praia, 20',
        items: [{ product: 'Box Baú Blindado', size: 'Solteiro 0.88', quantity: 1, price: 1200 }],
        total: 1200,
        paymentMethod: 'Crédito',
        date: getDate(1, '16:45:00'),
        status: 'pending'
    },
    // Past dates
    {
        id: '#1021',
        clientName: 'Lucas Martins',
        clientPhone: '31999887766',
        clientAddress: 'Av. Afonso Pena, 200',
        items: [{ product: 'Colchão Magnético Premium', size: 'Casal 1.38x1.88', quantity: 2, price: 2900 }],
        total: 5800,
        paymentMethod: 'Pix',
        date: getDate(4, '09:15:00'),
        status: 'paid'
    },
    {
        id: '#1020',
        clientName: 'Julia Silva',
        clientPhone: '11977776666',
        clientAddress: 'Rua Oscar Freire, 300',
        items: [{ product: 'Cabeceira Estofada Luxo', size: 'Queen 1.58', quantity: 1, price: 890 }],
        total: 890,
        paymentMethod: 'Crédito',
        date: getDate(5, '14:20:00'),
        status: 'canceled'
    }
];

const INITIAL_CUSTOMERS: Customer[] = [
    { id: '1', name: 'João da Silva', phone: '(11) 98888-7777', totalSpent: 4500, lastPurchase: 'Ontem' },
    { id: '2', name: 'Maria Oliveira', phone: '(11) 99999-8888', totalSpent: 12000, lastPurchase: '3 dias atrás' }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inventory, setInventory] = useState<Product[]>(INITIAL_INVENTORY);
    const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
    const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
    const [selectedReceiptSale, setSelectedReceiptSale] = useState<Sale | null>(null);

    // Load from local storage on mount
    useEffect(() => {
        const savedInventory = localStorage.getItem('kenkotec_inventory');
        const savedSales = localStorage.getItem('kenkotec_sales');
        const savedCustomers = localStorage.getItem('kenkotec_customers');
        if (savedInventory) setInventory(JSON.parse(savedInventory));
        if (savedSales) setSales(JSON.parse(savedSales));
        if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('kenkotec_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('kenkotec_sales', JSON.stringify(sales));
    }, [sales]);

    useEffect(() => {
        localStorage.setItem('kenkotec_customers', JSON.stringify(customers));
    }, [customers]);

    const addToInventory = (product: Omit<Product, 'id' | 'lastUpdated'>) => {
        const newProduct: Product = {
            ...product,
            id: Math.random().toString(36).substr(2, 9),
            lastUpdated: 'Agora'
        };
        setInventory(prev => [newProduct, ...prev]);
    };

    const removeFromInventory = (id: string, qty: number) => {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, item.quantity - qty) };
            }
            return item;
        }));
    };

    const addSale = (sale: Omit<Sale, 'id' | 'date' | 'status'>) => {
        const newSale: Sale = {
            ...sale,
            id: `#${Math.floor(Math.random() * 9000) + 1000}`,
            date: new Date().toJSON().slice(0, 10).split('-').reverse().join('/') + ' ' + new Date().toLocaleTimeString('pt-BR'),
            seller: '14-PADRAO 2',
            status: 'paid'
        };
        setSales(prev => [newSale, ...prev]);
        setSelectedReceiptSale(newSale); // Set as active for immediate viewing

        // Update Customers Logic
        setCustomers(prevCustomers => {
            const existingCustomerIndex = prevCustomers.findIndex(c => c.name.toLowerCase() === sale.clientName.toLowerCase());
            if (existingCustomerIndex !== -1) {
                const updatedCustomers = [...prevCustomers];
                updatedCustomers[existingCustomerIndex] = {
                    ...updatedCustomers[existingCustomerIndex],
                    totalSpent: updatedCustomers[existingCustomerIndex].totalSpent + sale.total,
                    lastPurchase: 'Hoje',
                    phone: sale.clientPhone || updatedCustomers[existingCustomerIndex].phone,
                    address: sale.clientAddress || updatedCustomers[existingCustomerIndex].address
                };
                return updatedCustomers;
            } else {
                return [{
                    id: Math.random().toString(36).substr(2, 9),
                    name: sale.clientName,
                    phone: sale.clientPhone,
                    address: sale.clientAddress,
                    totalSpent: sale.total,
                    lastPurchase: 'Hoje'
                }, ...prevCustomers];
            }
        });

        // Deduction Logic
        setInventory(prevInventory => {
            let updatedInventory = [...prevInventory];

            sale.items.forEach(saleItem => {
                // Try to find a matching product in inventory
                // Matches by Name (partial) OR Category AND Size matches (partial)
                const productIndex = updatedInventory.findIndex(p => {
                    const nameMatch = p.name.toLowerCase().includes(saleItem.product.toLowerCase());
                    const categoryMatch = p.category.toLowerCase().includes(saleItem.product.toLowerCase());

                    // Simple size matching heuristic
                    // If sale size says "Casal", look for "Casal" in inventory size
                    const sizeMatch = p.size.toLowerCase().includes(saleItem.size.split(' ')[0].toLowerCase());

                    return (nameMatch || categoryMatch) && sizeMatch;
                });

                if (productIndex !== -1) {
                    updatedInventory[productIndex] = {
                        ...updatedInventory[productIndex],
                        quantity: Math.max(0, updatedInventory[productIndex].quantity - saleItem.quantity),
                        lastUpdated: 'Agora'
                    };
                }
            });
            return updatedInventory;
        });
    };

    const addCustomer = (customer: Omit<Customer, 'id' | 'totalSpent' | 'lastPurchase'>) => {
        const newCustomer: Customer = {
            ...customer,
            id: Math.random().toString(36).substr(2, 9),
            totalSpent: 0,
            lastPurchase: 'Nunca'
        };
        setCustomers(prev => [newCustomer, ...prev]);
    };

    const updateStock = (id: string, updates: Partial<Product>) => {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, ...updates, lastUpdated: 'Agora' };
            }
            return item;
        }));
    };

    const updateSale = (id: string, updates: Partial<Sale>) => {
        setSales(prev => prev.map(sale => {
            if (sale.id === id) {
                return { ...sale, ...updates };
            }
            return sale;
        }));
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
            setSelectedReceiptSale
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
