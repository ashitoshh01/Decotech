import { Shield } from 'lucide-react';

interface Props {
  verified: boolean;
  count: number;
  size?: 'sm' | 'md';
}

export default function VerifiedBadge({ verified, count, size = 'sm' }: Props) {
  if (!verified) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
        {count}/2 verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
      <Shield size={size === 'sm' ? 11 : 13} />
      Verified
    </span>
  );
}
