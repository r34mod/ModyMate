import { User, Pill, Target, AlertCircle } from 'lucide-react';

export default function UserProfile() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <User size={18} className="text-teal-600" />
        <h3 className="font-bold text-teal-900">Perfil</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-teal-50 rounded-xl p-3 text-center">
          <p className="text-xs text-teal-600 font-medium">Tipo</p>
          <p className="text-sm font-bold text-teal-900 mt-1">MODY 2</p>
        </div>
        <div className="bg-rose-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Pill size={12} className="text-rose-500" />
            <p className="text-xs text-rose-600 font-medium">Medicación</p>
          </div>
          <p className="text-sm font-bold text-rose-900 mt-1">Synjardy</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Target size={12} className="text-amber-500" />
            <p className="text-xs text-amber-600 font-medium">Objetivo</p>
          </div>
          <p className="text-sm font-bold text-amber-900 mt-1">HbA1c &lt; 8%</p>
        </div>
        <div className="bg-sky-50 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <AlertCircle size={12} className="text-sky-500" />
            <p className="text-xs text-sky-600 font-medium">Nota</p>
          </div>
          <p className="text-sm font-bold text-sky-900 mt-1">No integral</p>
        </div>
      </div>
    </div>
  );
}
