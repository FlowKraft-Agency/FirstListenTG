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

    const iconBtnStyle = (bg: string, color: string): React.CSSProperties => ({
        background: bg,
        color: color,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '34px',
        height: '34px',
        borderRadius: 'var(--radius-sm)',
        cursor: loading ? 'not-allowed' : 'pointer',
        textDecoration: 'none',
        transition: 'opacity var(--transition-fast)',
    });

    return (
        <tr style={{ opacity: loading ? 0.5 : 1 }}>
            <td>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-hover)', overflow: 'hidden' }}>
                    {track.coverImage ? <img src={track.coverImage} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                </div>
            </td>
            <td style={{ fontWeight: 600 }}>{track.title}</td>
            <td>{track.priceStream} / {track.priceDownload} FCFA</td>
            <td>
                {track.status === 'APPROVED' ? (
                    <span className="badge badge--success">Publié</span>
                ) : track.status === 'PENDING' ? (
                    <span className="badge badge--warning">En attente</span>
                ) : (
                    <span className="badge badge--error">Rejeté</span>
                )}
            </td>
            <td style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center' }}>
                    <Link href={`/artist/analytics/${track.id}`} style={iconBtnStyle('var(--primary-alpha-10)', 'var(--primary-color)')} title="Statistiques">
                        <BarChart2 size={16} />
                    </Link>
                    {(track.status === 'PENDING' || track.status === 'REJECTED') && (
                        <Link href={`/artist/edit/${track.id}`} style={iconBtnStyle('rgba(59, 130, 246, 0.1)', '#3b82f6')} title="Modifier">
                            <Edit2 size={16} />
                        </Link>
                    )}
                    <button onClick={handleDelete} disabled={loading} style={iconBtnStyle('rgba(239, 68, 68, 0.1)', '#ef4444')} title="Supprimer">
                        {loading ? (
                            <div style={{ width: '16px', height: '16px', border: '2px solid rgba(239, 68, 68, 0.3)', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <Trash2 size={16} />
                        )}
                    </button>
                </div>
            </td>
        </tr>
    );
}
