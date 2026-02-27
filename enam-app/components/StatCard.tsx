import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'emerald' | 'amber' | 'blue' | 'neutral';
}

const COLOR_MAP = {
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  blue: 'bg-blue-50 text-blue-600',
  neutral: 'bg-neutral-100 text-neutral-600',
};

export default function StatCard({ label, value, icon: Icon, color = 'emerald' }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3 border border-neutral-100">
      <div className={`p-2.5 rounded-xl ${COLOR_MAP[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-neutral-400 font-medium">{label}</p>
        <p className="text-lg font-bold text-neutral-800">{value}</p>
      </div>
    </div>
  );
}
