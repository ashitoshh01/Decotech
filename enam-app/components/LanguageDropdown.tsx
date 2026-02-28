'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageDropdown() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className="hide-mobile">
            <Globe size={16} style={{ position: 'absolute', left: 8, color: 'var(--text-secondary, #374151)', pointerEvents: 'none' }} />
            <select
                defaultValue={locale}
                onChange={onSelectChange}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 24px 8px 32px',
                    borderRadius: 8,
                    border: '1px solid var(--border, rgba(0,0,0,0.08))',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--text-secondary, #374151)',
                    appearance: 'none',
                }}
            >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="es">Español</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 8, color: 'var(--text-secondary, #374151)', pointerEvents: 'none' }} />
        </div>
    );
}
