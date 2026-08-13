import { type ReactNode } from 'react';

export const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => (
  <div className="flex items-start gap-3 border-b border-gray-50 py-2 last:border-0">
    <span className="w-40 shrink-0 text-xs text-gray-400">{label}</span>
    <span className="text-xs text-gray-700">{value ?? '-'}</span>
  </div>
);
