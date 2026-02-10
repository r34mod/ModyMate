import { ShoppingCart, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { generateShoppingList } from '../utils/menuGenerator';

export default function ShoppingList({ plan, onBack }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [openCategories, setOpenCategories] = useState({});
  const grouped = generateShoppingList(plan);

  const toggleItem = (key) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategory = (cat) => {
    setOpenCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const totalItems = Object.values(grouped).flat().length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="animate-fade-in-up">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 mb-5">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="text-emerald-600 dark:text-emerald-400" size={22} />
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Lista de la Compra</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          15 días del plan · {checkedCount}/{totalItems} artículos
        </p>
        <div className="mt-3 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(grouped).map(([category, items]) => {
          const isOpen = openCategories[category] !== false;
          const catChecked = items.filter((item) => checkedItems[item.name]).length;

          return (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{category}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{catChecked}/{items.length}</span>
                </div>
                {isOpen ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-3 space-y-0.5">
                  {items.map((item) => (
                    <label
                      key={item.name}
                      className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!!checkedItems[item.name]}
                        onChange={() => toggleItem(item.name)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-emerald-600"
                      />
                      <span className={`flex-1 text-sm ${
                        checkedItems[item.name]
                          ? 'line-through text-gray-400 dark:text-gray-500'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full font-bold">
                        ×{item.count}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
