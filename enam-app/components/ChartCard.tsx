'use client';

import dynamic from 'next/dynamic';

interface ChartInnerProps {
  data: Array<Record<string, any>>;
  dataKey: string;
  nameKey: string;
  color: string;
}

const ChartInner = dynamic<ChartInnerProps>(
  () => import('./ChartInner').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-neutral-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    ),
  }
);

interface Props {
  title: string;
  data: Array<Record<string, any>>;
  dataKey: string;
  nameKey: string;
  color?: string;
}

export default function ChartCard({ title, data, dataKey, nameKey, color = '#059669' }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-neutral-100">
      <h3 className="text-sm font-semibold text-neutral-700 mb-4">{title}</h3>
      <ChartInner data={data} dataKey={dataKey} nameKey={nameKey} color={color} />
    </div>
  );
}
