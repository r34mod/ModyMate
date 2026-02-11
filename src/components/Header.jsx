import { Activity, ShoppingCart, RotateCcw, TrendingUp, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Header({ hasPlan, profile, onShoppingList, onGlucose, onReset, onProfile, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-800 dark:to-cyan-800 text-white shadow-lg">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/15 backdrop-blur-sm p-2 rounded-xl">
            <Activity size={24} className="text-emerald-100" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight leading-tight">GlicoHack</h1>
            <p className="text-emerald-200 text-xs font-medium">MODY 2 · Plan Nutricional</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasPlan && (
            <>
              <button
                onClick={onGlucose}
                className="p-2.5 bg-white/15 hover:bg-white/25 rounded-xl transition-colors cursor-pointer"
                title="Mis glucosas"
              >
                <TrendingUp size={18} />
              </button>
              <button
                onClick={onShoppingList}
                className="p-2.5 bg-white/15 hover:bg-white/25 rounded-xl transition-colors cursor-pointer"
                title="Lista de la compra"
              >
                <ShoppingCart size={18} />
              </button>
              <button
                onClick={onReset}
                className="p-2.5 bg-white/15 hover:bg-white/25 rounded-xl transition-colors cursor-pointer"
                title="Regenerar plan"
              >
                <RotateCcw size={18} />
              </button>
            </>
          )}

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 bg-white/15 hover:bg-white/25 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              title="Mi perfil"
            >
              <User size={18} />
              {profile?.nombre && (
                <span className="text-xs font-medium hidden sm:inline max-w-[80px] truncate">
                  {profile.nombre}
                </span>
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {profile?.nombre || 'Usuario'}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {profile?.medicacion || 'Synjardy'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onProfile();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors cursor-pointer"
                >
                  <User size={14} />
                  Mi Perfil
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
