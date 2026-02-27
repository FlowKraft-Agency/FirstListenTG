"use client";
import { deleteTrack } from "./actions";
import { useState } from "react";
import { Trash2, Edit2, BarChart2 } from "lucide-react";
import Link from "next/link";

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
        <tr style={{ borderBottom: '1px solid var(--glass-icon-bg)', opacity: loading ? 0.5 : 1 }}>
            <td style={{ padding: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', background: 'var(--surface-color)', overflow: 'hidden' }}>
                    {track.coverImage ? <img src={track.coverImage} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                </div>
            </td>
            <td style={{ padding: '1rem', fontWeight: 600 }}>{track.title}</td>
            <td style={{ padding: '1rem' }}>{track.priceStream} / {track.priceDownload} FCFA</td>
            <td style={{ padding: '1rem' }}>
                {track.status === 'APPROVED' ? <span style={{ color: 'var(--primary-color)' }}>Publié</span> :
                    track.status === 'PENDING' ? <span style={{ color: '#eab308' }}>En attente</span> :
                        <span style={{ color: '#ef4444' }}>Rejeté</span>}
            </td>
            <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <style>{`@keyframes spin-small { to { transform: rotate(360deg); } }`}</style>
                <Link href={`/artist/analytics/${track.id}`} style={{ background: 'var(--primary-alpha-10)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '0.5rem', cursor: 'pointer', textDecoration: 'none' }} title="Statistiques">
                    <BarChart2 size={16} />
                </Link>
                {(track.status === 'PENDING' || track.status === 'REJECTED') && (
                    <Link href={`/artist/edit/${track.id}`} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '0.5rem', cursor: 'pointer', textDecoration: 'none' }} title="Modifier">
                        <Edit2 size={16} />
                    </Link>
                )}
                <button onClick={handleDelete} disabled={loading} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer' }} title="Supprimer">
                    {loading ? (
                        <div style={{ width: '16px', height: '16px', border: '2px solid rgba(239, 68, 68, 0.3)', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin-small 1s linear infinite' }}></div>
                    ) : (
                        <Trash2 size={16} />
                    )}
                </button>
            </td>
        </tr>
    );
}
