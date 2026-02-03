import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../context/StoreContext';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg">
                <p className="text-sm font-bold text-slate-700">{label}</p>
                <p className="text-sm text-primary font-semibold">
                    R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
            </div>
        );
    }
    return null;
};

// Helper to parse "DD/MM/YYYY HH:mm:ss"
const parseDate = (dateStr: string) => {
    try {
        const [datePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day));
    } catch (e) {
        return new Date();
    }
};

export const SalesChart: React.FC = () => {
    const { sales } = useStore();

    const data = useMemo(() => {
        // Initialize days Mon-Sun
        const days = [
            { name: 'Seg', vendas: 0 },
            { name: 'Ter', vendas: 0 },
            { name: 'Qua', vendas: 0 },
            { name: 'Qui', vendas: 0 },
            { name: 'Sex', vendas: 0 },
            { name: 'Sáb', vendas: 0 },
            { name: 'Dom', vendas: 0 },
        ];

        // Get current week start (Monday)
        const now = new Date();
        const currentDayStr = now.getDay(); // 0 is Sunday
        const diffToMonday = currentDayStr === 0 ? 6 : currentDayStr - 1;
        const monday = new Date(now);
        monday.setDate(now.getDate() - diffToMonday);
        monday.setHours(0, 0, 0, 0);

        // Sunday end of week
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        sales.forEach(sale => {
            try {
                if (sale.status === 'cancelled') return; // Ignore cancelled sales

                const saleDate = parseDate(sale.date);
                // Check if date is valid and within current week
                if (!isNaN(saleDate.getTime()) && saleDate >= monday && saleDate <= sunday) {
                    // Map JS getDay() (0=Sun, 1=Mon...) to our array index (0=Seg...6=Dom)
                    let dayIndex = saleDate.getDay() - 1;
                    if (dayIndex < 0) dayIndex = 6; // Sunday

                    if (days[dayIndex]) {
                        days[dayIndex].vendas += sale.total;
                    }
                }
            } catch (e) {
                console.error("Error processing sale date:", sale.date);
            }
        });

        return days;
    }, [sales]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 h-full flex flex-col">
            <div className="mb-4">
                <h3 className="font-bold text-slate-900 text-lg">Vendas da Semana</h3>
                <p className="text-xs text-slate-500">Acompanhamento diário</p>
            </div>
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            dy={10}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="vendas"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorVendas)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
