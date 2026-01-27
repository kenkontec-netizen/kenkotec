import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Seg', uv: 4000, vendas: 2400, amt: 2400 },
    { name: 'Ter', uv: 3000, vendas: 1398, amt: 2210 },
    { name: 'Qua', uv: 2000, vendas: 9800, amt: 2290 },
    { name: 'Qui', uv: 2780, vendas: 3908, amt: 2000 },
    { name: 'Sex', uv: 1890, vendas: 4800, amt: 2181 },
    { name: 'Sáb', uv: 2390, vendas: 3800, amt: 2500 },
    { name: 'Dom', uv: 3490, vendas: 4300, amt: 2100 },
];

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

export const SalesChart: React.FC = () => {
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
                        {/* Removed YAxis vertical lines by not including CartesianGrid, YAxis is hidden or minimal */}
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
