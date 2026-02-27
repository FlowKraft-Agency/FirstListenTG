'use client';
import { Share2, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--glass-icon-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', alignSelf: 'flex-start' }}
        >
            {copied ? <Check size={16} color="#0df259" /> : <Share2 size={16} />}
            {copied ? "Lien copié !" : "Partager le morceau"}
        </button>
    );
}
