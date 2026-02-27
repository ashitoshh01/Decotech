'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import {
  Menu,
  X,
  Leaf,
  ChevronDown,
  LogOut,
  User,
  Wallet,
  BarChart2,
  ShoppingBag,
  Coins,
  Home,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/listings', label: 'Marketplace', icon: ShoppingBag },
  { href: '/prices', label: 'Prices', icon: BarChart2 },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart2 },
  { href: '/about', label: 'About', icon: User },
] as const;

export default function Navbar() {
  const { profile, logout } = useAuth();
  const { available } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const initials = profile?.name
    ? profile.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : '??';

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(var(--bg-muted-rgb, 255,255,255), 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border, rgba(0,0,0,0.08))',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, var(--green-600, #16a34a), var(--green-700, #15803d))',
                color: '#fff',
              }}
            >
              <Leaf size={20} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  color: 'var(--text-primary, #111827)',
                  letterSpacing: '-0.02em',
                }}
              >
                AgriTrade Platform
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted, #6b7280)', fontWeight: 500 }}>
                Agri Credit Exchange
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hide-mobile">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--text-secondary, #374151)',
                  textDecoration: 'none',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-muted, #f3f4f6)';
                  e.currentTarget.style.color = 'var(--green-700, #15803d)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary, #374151)';
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {profile ? (
              <>
                {/* AC balance pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'linear-gradient(135deg, rgba(22,163,74,0.1), rgba(21,128,61,0.08))',
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: '1px solid rgba(22,163,74,0.2)',
                  }}
                  className="hidden sm:flex"
                >
                  <Coins size={15} style={{ color: 'var(--green-600, #16a34a)' }} />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--green-700, #15803d)',
                    }}
                  >
                    {available.toLocaleString()} AC
                  </span>
                </div>

                {/* Avatar dropdown */}
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen((p) => !p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '4px 8px 4px 4px',
                      borderRadius: 999,
                      border: '1px solid var(--border, rgba(0,0,0,0.08))',
                      background: 'var(--bg-muted, #f9fafb)',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.15s',
                    }}
                    className="hide-mobile"
                  >
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--green-600, #16a34a), var(--green-700, #15803d))',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {initials}
                    </span>
                    <ChevronDown
                      size={14}
                      style={{
                        color: 'var(--text-muted, #6b7280)',
                        transition: 'transform 0.2s',
                        transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>

                  {dropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        width: 240,
                        background: 'var(--bg-card, #ffffff)',
                        borderRadius: 14,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        zIndex: 110,
                      }}
                    >
                      {/* User info header */}
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary, #111827)', margin: 0 }}>
                          {profile.name || 'Farmer'}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted, #6b7280)', margin: '2px 0 0' }}>
                          {profile.phone}
                        </p>
                        {profile.village && (
                          <p style={{ fontSize: 11, color: 'var(--text-muted, #9ca3af)', margin: '2px 0 0' }}>
                            {profile.village}
                          </p>
                        )}
                      </div>

                      <div style={{ padding: '6px 8px' }}>
                        <DropdownLink href="/dashboard" icon={<BarChart2 size={16} />} label="Dashboard" onClick={() => setDropdownOpen(false)} />
                        <DropdownLink href="/dashboard" icon={<Wallet size={16} />} label="Wallet" onClick={() => setDropdownOpen(false)} />
                        <DropdownLink href="/create" icon={<ShoppingBag size={16} />} label="My Listings" onClick={() => setDropdownOpen(false)} />
                      </div>

                      <div style={{ borderTop: '1px solid var(--border, rgba(0,0,0,0.06))', padding: '6px 8px' }}>
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: 8,
                            border: 'none',
                            background: 'transparent',
                            color: '#dc2626',
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(220,38,38,0.06)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hide-mobile">
                <Link
                  href="/login"
                  style={{
                    padding: '8px 18px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--text-secondary, #374151)',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-muted, #f3f4f6)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  style={{
                    padding: '8px 20px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#fff',
                    background: 'linear-gradient(135deg, var(--green-600, #16a34a), var(--green-700, #15803d))',
                    textDecoration: 'none',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 10,
                border: '1px solid var(--border, rgba(0,0,0,0.08))',
                background: 'var(--bg-muted, #f9fafb)',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              className="hide-desktop"
            >
              {mobileOpen ? (
                <X size={20} style={{ color: 'var(--text-primary, #111827)' }} />
              ) : (
                <Menu size={20} style={{ color: 'var(--text-primary, #111827)' }} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: 64,
            zIndex: 99,
            background: 'rgba(var(--bg-muted-rgb, 255,255,255), 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            overflowY: 'auto',
          }}
        >
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {profile && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0 16px',
                  marginBottom: 8,
                  borderBottom: '1px solid var(--border, rgba(0,0,0,0.06))',
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--green-600, #16a34a), var(--green-700, #15803d))',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary, #111827)', margin: 0 }}>
                    {profile.name || 'Farmer'}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted, #6b7280)', margin: '2px 0 0' }}>
                    {available.toLocaleString()} AC
                  </p>
                </div>
              </div>
            )}

            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--text-secondary, #374151)',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
              >
                <Icon size={18} style={{ color: 'var(--green-600, #16a34a)' }} />
                {label}
              </Link>
            ))}

            {profile ? (
              <>
                <div style={{ height: 1, background: 'var(--border, rgba(0,0,0,0.06))', margin: '8px 0' }} />
                <Link
                  href="/dashboard"
                  onClick={closeMobile}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 500,
                    color: 'var(--text-secondary, #374151)',
                    textDecoration: 'none',
                  }}
                >
                  <Wallet size={18} style={{ color: 'var(--green-600, #16a34a)' }} />
                  Wallet
                </Link>
                <Link
                  href="/create"
                  onClick={closeMobile}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 500,
                    color: 'var(--text-secondary, #374151)',
                    textDecoration: 'none',
                  }}
                >
                  <ShoppingBag size={18} style={{ color: 'var(--green-600, #16a34a)' }} />
                  My Listings
                </Link>
                <button
                  onClick={() => {
                    closeMobile();
                    logout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#dc2626',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                <Link
                  href="/login"
                  onClick={closeMobile}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 500,
                    color: 'var(--text-secondary, #374151)',
                    border: '1px solid var(--border, rgba(0,0,0,0.1))',
                    textDecoration: 'none',
                  }}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobile}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#fff',
                    background: 'linear-gradient(135deg, var(--green-600, #16a34a), var(--green-700, #15803d))',
                    textDecoration: 'none',
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function DropdownLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--text-secondary, #374151)',
        textDecoration: 'none',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-muted, #f3f4f6)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {icon}
      {label}
    </Link>
  );
}
