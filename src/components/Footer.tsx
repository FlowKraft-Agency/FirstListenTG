import { Music } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__brand">
                <Music size={18} strokeWidth={2.5} />
                <span className="footer__brand-text">FirstListen</span>
            </div>
            <p className="footer__copy">
                &copy; 2026 FirstListen. Tous droits réservés.
            </p>
        </footer>
    );
}
