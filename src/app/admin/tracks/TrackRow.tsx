"use client";
import { approveTrack, rejectTrack } from "./actions";
import { Check, X } from "lucide-react";
import { useState } from "react";

export default function TrackRow({ track }: { track: any }) {
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        await approveTrack(track.id);
        setLoading(false);
    };

    const handleReject = async () => {
        setLoading(true);
        await rejectTrack(track.id);
        setLoading(false);
    };

    return (
        <tr style={{ borderBottom: '1px solid var(--glass-icon-bg)', opacity: loading ? 0.5 : 1 }}>
            <td style={{ padding: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', background: 'var(--surface-color)', overflow: 'hidden' }}>
                    {track.coverImage ? <img src={track.coverImage} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                </div>
            </td>
            <td style={{ padding: '1rem', fontWeight: 600 }}>{track.title}</td>
            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{track.artistName || track.artist.name}</td>
            <td style={{ padding: '1rem' }}>{track.priceStream} / {track.priceDownload} FCFA</td>
            <td style={{ padding: '1rem' }}>
                <audio controls src={`/api/stream?admin_preview=${track.id}`} style={{ height: '30px', width: '200px' }} />
            </td>
            <td style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button onClick={handleApprove} disabled={loading} style={{ background: 'var(--primary-alpha-10)', color: 'var(--primary-color)', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }} title="Valider">
                        <Check size={18} />
                    </button>
                    <button onClick={handleReject} disabled={loading} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }} title="Rejeter">
                        <X size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
