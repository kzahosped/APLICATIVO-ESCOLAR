import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';

interface CategoryGroup {
    category: string;
    total: number;
    items: {
        id: string;
        description: string;
        amount: number;
        date: string;
        status: string;
    }[];
}

const StudentFinances: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, financials } = useApp();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    // Filter records for current student
    const studentRecords = useMemo(() => {
        if (!currentUser) return [];
        return financials.filter(r => r.studentId === currentUser.id && r.status !== 'Pago');
    }, [currentUser, financials]);

    // Group by category
    const groupedByCategory: CategoryGroup[] = useMemo(() => {
        const groups: { [key: string]: CategoryGroup } = {};

        studentRecords.forEach(record => {
            const cat = record.category || 'Outros';
            if (!groups[cat]) {
                groups[cat] = {
                    category: cat,
                    total: 0,
                    items: []
                };
            }
            const balance = record.balance ?? record.amount;
            groups[cat].total += balance;
            groups[cat].items.push({
                id: record.id,
                description: record.description,
                amount: balance,
                date: record.dueDate,
                status: record.status
            });
        });

        return Object.values(groups).sort((a, b) => b.total - a.total);
    }, [studentRecords]);

    // Calculate totals
    const totalDebt = groupedByCategory.reduce((sum, g) => sum + g.total, 0);
    const totalPaid = useMemo(() => {
        if (!currentUser) return 0;
        return financials
            .filter(r => r.studentId === currentUser.id && r.status === 'Pago')
            .reduce((sum, r) => sum + r.amount, 0);
    }, [currentUser, financials]);

    const getCategoryIcon = (category: string) => {
        const lower = category.toLowerCase();
        if (lower.includes('hambur') || lower.includes('lanche')) return 'lunch_dining';
        if (lower.includes('mercear') || lower.includes('mercado')) return 'local_grocery_store';
        if (lower.includes('cantina') || lower.includes('refeit')) return 'restaurant';
        if (lower.includes('livr') || lower.includes('material')) return 'menu_book';
        if (lower.includes('mensalidade') || lower.includes('curso')) return 'school';
        if (lower.includes('uniforme')) return 'checkroom';
        return 'payments';
    };

    const getCategoryColor = (category: string) => {
        const lower = category.toLowerCase();
        if (lower.includes('hambur') || lower.includes('lanche')) return 'from-orange-500 to-amber-500';
        if (lower.includes('mercear') || lower.includes('mercado')) return 'from-green-500 to-emerald-500';
        if (lower.includes('cantina') || lower.includes('refeit')) return 'from-red-500 to-rose-500';
        if (lower.includes('livr') || lower.includes('material')) return 'from-blue-500 to-indigo-500';
        if (lower.includes('mensalidade') || lower.includes('curso')) return 'from-purple-500 to-violet-500';
        if (lower.includes('uniforme')) return 'from-pink-500 to-fuchsia-500';
        return 'from-gray-500 to-slate-500';
    };

    if (!currentUser) return null;

    return (
        <div className="pb-24 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0f0f1a] dark:to-[#1a1a2e]">
            {/* Header */}
            <div
                className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 px-5 pt-12 pb-8"
                style={{ paddingTop: 'max(48px, env(safe-area-inset-top))' }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-xl active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-white">arrow_back</span>
                    </button>
                    <h1 className="font-bold text-xl text-white">Minhas Finanças</h1>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-white/80 text-xs font-medium mb-1">Total em Aberto</p>
                        <p className="text-2xl font-bold text-white">
                            R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                        <p className="text-white/80 text-xs font-medium mb-1">Total Pago</p>
                        <p className="text-2xl font-bold text-white">
                            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-4 space-y-4">
                {groupedByCategory.length === 0 ? (
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-8 text-center shadow-lg animate-fade-in">
                        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Tudo em dia!</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Você não possui pendências financeiras no momento.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 px-1">
                            {groupedByCategory.length} {groupedByCategory.length === 1 ? 'setor com pendência' : 'setores com pendências'}
                        </p>

                        {groupedByCategory.map((group, idx) => (
                            <div
                                key={group.category}
                                className="bg-white dark:bg-[#1a1a2e] rounded-3xl shadow-lg overflow-hidden animate-fade-in"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                {/* Category Header */}
                                <button
                                    onClick={() => setExpandedCategory(
                                        expandedCategory === group.category ? null : group.category
                                    )}
                                    className="w-full p-5 flex items-center gap-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
                                >
                                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${getCategoryColor(group.category)}`}>
                                        <span className="material-symbols-outlined text-white text-2xl">
                                            {getCategoryIcon(group.category)}
                                        </span>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                            {group.category}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {group.items.length} {group.items.length === 1 ? 'item' : 'itens'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl text-red-500">
                                            R$ {group.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                        <span className="material-symbols-outlined text-gray-400">
                                            {expandedCategory === group.category ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </div>
                                </button>

                                {/* Expanded Items */}
                                {expandedCategory === group.category && (
                                    <div className="border-t border-gray-100 dark:border-gray-800 animate-fade-in">
                                        {group.items.map((item, itemIdx) => (
                                            <div
                                                key={item.id}
                                                className={`p-4 flex items-center gap-3 ${itemIdx < group.items.length - 1
                                                        ? 'border-b border-gray-100 dark:border-gray-800'
                                                        : ''
                                                    }`}
                                            >
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {item.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(item.date).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-red-500">
                                                        R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </p>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'Vencido'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-orange-100 text-orange-700'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default StudentFinances;
