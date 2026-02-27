'use client';

import { useState } from 'react';
import { Shield, Lock, Music, UserCircle, ArrowRight, Headphones, CreditCard, PlayCircle, Search } from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingClient({ initialTracks }: { initialTracks: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: session } = useSession();

    // On prend le dernier morceau comme "Hero" s'il y en a un, sinon un track par défaut
    const heroTrack = initialTracks.length > 0 ? initialTracks[0] : {
        id: 'demo',
        title: 'Midnight Resonance',
        artistName: 'L\'ARTISTE MYSTÈRE',
        priceStream: 200,
        priceDownload: 500,
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWJ_ATKP7m1GNpZVDdauY8J2KB8ynnoyJDcwRb7N4WpSNXjr7Vtg1QcPdP13OP2L22dWmsNELejJtnr3eR_blyB_qb4l7R-B4_rShkB1YmpGsUoUB0NStvbaJIEM74mUb7ZIAYA_cZGx3pwZUpE2FBJhR9D-TMZaYXsMKjLAlXI2B6XSAk7Pfl2ACYLxJl5qCQE9Z5PiGSMRfagoVln-Uhc-L3TZQECmXFvEE2Zs9LhbJQgAkZLGUZjCka1K6_EzOXL98IKTQv94eg'
    };

    const filteredTracks = initialTracks.filter(track => {
        const query = searchQuery.toLowerCase();
        const artist = (track.artistName || track.artist?.name || '').toLowerCase();
        const title = (track.title || '').toLowerCase();
        return artist.includes(query) || title.includes(query);
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden', background: 'var(--bg-color)' }}>
            {/* Navbar v3 */}
            <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color)', backdropFilter: 'blur(10px)' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-main)' }}>
                        <div style={{ background: 'var(--primary-color)', color: 'var(--text-on-primary)', padding: '0.375rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Music size={24} strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.025em' }}>
                            First<span style={{ color: 'var(--primary-color)' }}>Listen</span>
                        </span>
                    </Link>

                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                        <Link href="/explore" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 700 }}>Explorer</Link>
                        <a href="#comment-ca-marche" style={{ color: 'inherit', textDecoration: 'none' }}>Comment ça marche</a>
                        <a href="#aide" style={{ color: 'inherit', textDecoration: 'none' }}>Aide</a>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <ThemeToggle />
                        {session ? (
                            <>
                                <Link href="/library" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                    <Music size={16} /> Bibliothèque
                                </Link>
                                {(session.user as any)?.role === 'ADMIN' && (
                                    <Link href="/admin" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        Admin
                                    </Link>
                                )}
                                {(session.user as any)?.role === 'ARTIST' && (
                                    <Link href="/artist" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'var(--primary-alpha-10)', color: 'var(--primary-color)', border: '1px solid var(--primary-alpha-20)' }}>
                                        Studio
                                    </Link>
                                )}
                                <Link href="/profile" style={{ color: 'var(--text-muted)' }}>
                                    <UserCircle size={24} />
                                </Link>
                            </>
                        ) : (
                            <Link href="/login" style={{ background: 'var(--text-main)', color: 'var(--bg-color)', padding: '0.5rem 1.5rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main style={{ flex: 1, position: 'relative', marginTop: '5rem' }}>

                {/* HERO SECTION */}
                <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '3rem 1.5rem 6rem', position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="hero-grid">
                        <style>{`@media (min-width: 1024px) { .hero-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'var(--primary-alpha-10)', border: '1px solid var(--primary-alpha-20)', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                                        <span style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: 'var(--primary-color)', opacity: 0.75 }}></span>
                                        <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: 'var(--primary-color)' }}></span>
                                    </span>
                                    Sortie Exclusive
                                </div>
                            </div>

                            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em', color: 'var(--text-main)', margin: 0 }}>
                                Écoutez ce son <span style={{ color: 'var(--primary-color)' }}>exclusif</span> maintenant
                            </h1>

                            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.6, maxWidth: '500px', margin: 0 }}>
                                Disponible pour une écoute unique après paiement. Vivez une expérience sonore inédite en haute définition.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{heroTrack.priceStream} FCFA</span>
                                    <div style={{ height: '2rem', width: '1px', background: 'var(--border-color)' }}></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        <Shield size={18} color="var(--primary-color)" /> Paiement Sécurisé
                                    </div>
                                </div>

                                <button
                                    className="neon-glow"
                                    onClick={() => { setSelectedTrack(heroTrack); setIsModalOpen(true); }}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'var(--primary-color)', color: '#000', fontWeight: 700, fontSize: '1.125rem', padding: '1.25rem 2.5rem', borderRadius: '0.75rem', cursor: 'pointer', border: 'none', width: 'fit-content' }}
                                >
                                    Payer et écouter
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
                                    <img alt="Orange Money" style={{ height: '24px', filter: 'grayscale(1)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPk98_BMg1YWkg12iyVdHDe1QHFRfkJdf0v080KhjQVZr4fDbEPbmn8hceo8W1jmplD2q5q9vaNWhJ7Prxg6JBQZS8z4h032vUJuPR0GeisCC91bw-blbiKRJ_nMTkL1T3D2rcO6zYLpB4WGb5ptvex-VR4I6vFEiI-PWE6I_LlebOgBNrEdbWxoR5QmocDr0KU2b_32arbRlBlTYqsJDHURs43oPuBP3pbcqPTIAnFCC4ZcRaD2pirmaNhl2kGImU1Nf8xzw96a_z" />
                                    <img alt="MTN MoMo" style={{ height: '24px', filter: 'grayscale(1)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_x1QfisiRTb5ftdnpx_6diW096cYmjsw09llyY16_VsZYg0oe_rPsrgA8pyJdGMb8I5uO5yiAgDEMvLYHL7VJ450WbBYj7shpwU2U7BD_XQ7NCpsvi2HbcgoWzp2alvojvMCuj7NLZHY4oubatBtCoS8soCKevCpvcuVHFWtVpPjomXDsLu3W-cioyQwWxWBHV5KZRjUeQ5eGsDNiD19iHl9C7WKVTpy2NJBw_uGvx5kOkHPEI_o6_SPnyGT1NMVa1sl9CBGc4nRI" />
                                    <img alt="Wave" style={{ height: '24px', filter: 'grayscale(1)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEv4_yIQT-8czi2l23oFBDRRAXkp_mX1UW2uFCX8yNsS6b1LzYjDWwb2epy_h1aErdRwYQAgmSRqlSkexxboJKEpYbptiuHMOwd8_1dY3dvBPrjlDAJF4-tkWKC8tA89cbv41O0_5aF2WnatCE2P93deu-YAsPS2P1x-Ge-RrPMc-aY9p2D0uxpQ2456rZlDq2bRSzcxVUV5M2MR1edRiUobDrF6NI47bmPCFFIkTfwhdgdIETpClJCYZOFrp-2XIYV83ewEgJjdbD" />
                                </div>
                                <p style={{ fontSize: '0.625rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, margin: 0 }}>
                                    * Ce lien est valable pour une lecture unique. Achat définitif disponible pour les membres.
                                </p>
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', borderRadius: '1.5rem' }}>
                                <div style={{ aspectRatio: '1', width: '100%', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
                                    {heroTrack.coverImage && <img alt="Audio Artwork" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.05)' }} src={heroTrack.coverImage} />}
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: '5rem', height: '5rem', background: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                                            <Lock size={36} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{heroTrack.title}</h3>
                                            <p style={{ color: 'var(--primary-color)', fontWeight: 500, letterSpacing: '0.025em', textTransform: 'uppercase', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>{heroTrack.artistName || heroTrack.artist?.name}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                                        <span>Audio HD Lossless</span>
                                        <span>1k+ Écoutes</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* EXPLORER SECTION */}
                {initialTracks.length > 0 && (
                    <section id="explorer" style={{ background: 'var(--surface-color)', padding: '6rem 0' }}>
                        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '36rem' }}>
                                    <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Explorer les exclusivités</h2>
                                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Découvrez les pépites sonores disponibles pour une écoute éphémère.</p>
                                </div>

                                <div style={{ position: 'relative', maxWidth: '500px' }}>
                                    <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un son ou un artiste..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
                                        className="search-input-hover"
                                    />
                                    <style>{`.search-input-hover:focus { border-color: var(--primary-color) !important; box-shadow: 0 0 0 2px rgba(225, 29, 72, 0.2); }`}</style>
                                </div>
                            </div>

                            {filteredTracks.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                                    <p>Aucun morceau trouvé pour "{searchQuery}"</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                        {filteredTracks.slice(0, 8).map(track => (
                                            <div key={track.id} style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '1rem' }} onClick={() => { setSelectedTrack(track); setIsModalOpen(true); }}>
                                                <div style={{ aspectRatio: '1', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
                                                    {track.coverImage ? (
                                                        <img alt={track.title} src={track.coverImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, var(--bg-color), var(--surface-hover))' }}></div>
                                                    )}
                                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)' }}>
                                                        <PlayCircle size={48} color="#fff" style={{ opacity: 0.8 }} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 style={{ color: 'var(--text-main)', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '1.125rem' }}>{track.title}</h3>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Link
                                                            href={`/a/${encodeURIComponent(track.artistName || track.artist?.name)}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{ color: 'inherit', textDecoration: 'none' }}
                                                            className="hover-underline"
                                                        >
                                                            {track.artistName || track.artist?.name}
                                                        </Link>
                                                        <span>&bull;</span> {track.priceStream} FCFA
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Link href="/explore" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', background: 'var(--glass-icon-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <Search size={20} />
                                            Voir tout le catalogue
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* COMMENT CA MARCHE */}
                <section id="comment-ca-marche" style={{ background: 'var(--bg-color)', padding: '6rem 0' }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '5rem' }}>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '-0.025em', margin: 0 }}>Comment ça marche ?</h2>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Une expérience simple, rapide et exclusive.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', position: 'relative' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '5rem', height: '5rem', borderRadius: '1rem', background: 'var(--primary-color)', color: 'var(--text-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CreditCard size={32} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>1. Payez {heroTrack.priceStream} FCFA</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>Utilisez votre Mobile Money (Orange, MTN, Wave) pour un accès rapide.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '5rem', height: '5rem', borderRadius: '1rem', background: 'var(--primary-color)', color: 'var(--text-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Lock size={32} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>2. Recevez votre lien</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>Un lien d'écoute unique vous est instantanément généré après validation.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '5rem', height: '5rem', borderRadius: '1rem', background: 'var(--primary-color)', color: 'var(--text-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Headphones size={32} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>3. Écoutez une fois</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>Lancez la lecture. Attention, le lien expire dès que la musique se termine.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AIDE / FAQ */}
                <section id="aide" style={{ background: 'var(--surface-color)', padding: '6rem 0', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center', marginBottom: '3rem' }}>Questions fréquentes</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Puis-je réécouter le morceau ?</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>Non, le concept est basé sur l'exclusivité et l'écoute unique. Une fois la lecture terminée, le lien devient invalide.</p>
                            </div>
                            <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Quels sont les moyens de paiement ?</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>Nous acceptons Orange Money, MTN Mobile Money et Wave. Le paiement est 100% sécurisé.</p>
                            </div>
                            <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>La qualité audio est-elle bonne ?</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>Oui, nous proposons une qualité Studio HD sans compression pour une expérience immersive.</p>
                            </div>
                            <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Le lien a expiré avant que je puisse écouter.</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>Si vous rencontrez un problème technique, contactez notre support avec votre reçu de paiement.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)', padding: '3rem 0', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', opacity: 0.5, marginBottom: '1rem' }}>
                    <Music size={18} strokeWidth={2.5} />
                    <span style={{ fontSize: '1.125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.025em' }}>FirstListen</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500, margin: 0 }}>
                    © 2026 FirstListen. Tous droits réservés.
                </p>
            </footer>

            {isModalOpen && <PaymentModal onCloseAction={() => { setIsModalOpen(false); setSelectedTrack(null); }} trackTitle={selectedTrack?.title} trackId={selectedTrack?.id} priceStream={selectedTrack?.priceStream} priceDownload={selectedTrack?.priceDownload} isLoggedIn={!!session} />}
        </div >
    );
}
