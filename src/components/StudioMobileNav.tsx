'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

interface NavLink {
    href: string;
    label: string;
    icon: React.ReactNode;
}

interface StudioMobileNavProps {
    logoText: React.ReactNode;
    links: NavLink[];
}

export default function StudioMobileNav({ logoText, links }: StudioMobileNavProps) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <div className="studio-mobile-nav">
                <span className="studio-mobile-nav__logo">{logoText}</span>
                <button
                    className="studio-mobile-nav__toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {menuOpen && (
                <div className="studio-mobile-menu">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`studio-mobile-menu__link ${pathname === link.href ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/signout"
                        className="studio-mobile-menu__link"
                        onClick={() => setMenuOpen(false)}
                        style={{ color: 'var(--error-color)', borderTop: '1px solid var(--border-color)', marginTop: 'var(--space-sm)' }}
                    >
                        <LogOut size={20} />
                        Quitter
                    </Link>
                </div>
            )}
        </>
    );
}
