"use client";
import { deleteTrack } from "./actions";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function TrackActionRow({ track }: { track: any }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Toutes les données associées à ce morceau seront perdues. Voulez-vous vraiment supprimer "${track.title}" ?`)) return;

        setLoading(true);
        try {
            await deleteTrack(track.id);
        } catch (e) {
            alert("Erreur lors de la suppression.");
        }
        setLoading(false);
    };

    return (
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: loading ? 0.5 : 1 }}>
            <td style={{ padding: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', background: 'var(--surface-color)', overflow: 'hidden' }}>
                    {track.coverImage ? <img src={track.coverImage} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                </div>
            </td>
            <td style={{ padding: '1rem', fontWeight: 600 }}>{track.title}</td>
            <td style={{ padding: '1rem' }}>{track.priceStream} / {track.priceDownload} FCFA</td>
            <td style={{ padding: '1rem' }}>
                {track.status === 'APPROVED' ? <span style={{ color: '#0df259' }}>Publié</span> :
                    track.status === 'PENDING' ? <span style={{ color: '#eab308' }}>En attente</span> :
                        <span style={{ color: '#ef4444' }}>Rejeté</span>}
            </td>
            <td style={{ padding: '1rem', textAlign: 'center' }}>
                <button onClick={handleDelete} disabled={loading} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }} title="Supprimer">
                    <Trash2 size={18} />
                </button>
            </td>
        </tr>
    );
}
