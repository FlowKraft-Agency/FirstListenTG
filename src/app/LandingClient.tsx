'use client';

import { useState } from 'react';
import { Shield, Lock, Headphones, CreditCard, Search } from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TrackCard from '@/components/TrackCard';
import Footer from '@/components/Footer';

export default function LandingClient({ initialTracks }: { initialTracks: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { data: session } = useSession();

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

    const openModal = (track: any) => {
        setSelectedTrack(track);
        setIsModalOpen(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden', background: 'var(--bg-color)' }}>
            <Navbar />

            <main style={{ flex: 1, position: 'relative', marginTop: '4.5rem' }}>

                {/* HERO SECTION */}
                <div className="landing-hero">
                    <div className="landing-hero__grid">

                        {/* Left: Text content */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }} className="animate-fade-in-up">
                            <div>
                                <div className="landing-hero__badge">
                                    <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                                        <span style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: 'var(--primary-color)', opacity: 0.75 }} />
                                        <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: 'var(--primary-color)' }} />
                                    </span>
                                    Sortie Exclusive
                                </div>
                            </div>

                            <h1 className="landing-hero__title">
                                Écoutez ce son <span>exclusif</span> maintenant
                            </h1>

                            <p className="landing-hero__subtitle">
                                Disponible pour une écoute unique après paiement. Vivez une expérience sonore inédite en haute définition.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                    <span className="landing-hero__price">{heroTrack.priceStream} FCFA</span>
                                    <div style={{ height: '2rem', width: '1px', background: 'var(--border-color)' }} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        <Shield size={18} color="var(--primary-color)" /> Paiement Sécurisé
                                    </div>
                                </div>

                                <button className="landing-hero__cta neon-glow" onClick={() => openModal(heroTrack)}>
                                    Payer et écouter
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginTop: 'var(--space-xs)', opacity: 0.8 }}>
                                    <img alt="Orange Money" style={{ height: '24px', filter: 'grayscale(1)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPk98_BMg1YWkg12iyVdHDe1QHFRfkJdf0v080KhjQVZr4fDbEPbmn8hceo8W1jmplD2q5q9vaNWhJ7Prxg6JBQZS8z4h032vUJuPR0GeisCC91bw-blbiKRJ_nMTkL1T3D2rcO6zYLpB4WGb5ptvex-VR4I6vFEiI-PWE6I_LlebOgBNrEdbWxoR5QmocDr0KU2b_32arbRlBlTYqsJDHURs43oPuBP3pbcqPTIAnFCC4ZcRaD2pirmaNhl2kGImU1Nf8xzw96a_z" />
                                    <img alt="MTN MoMo" style={{ height: '24px', filter: 'grayscale(1)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_x1QfisiRTb5ftdnpx_6diW096cYmjsw09llyY16_VsZYg0oe_rPsrgA8pyJdGMb8I5uO5yiAgDEMvLYHL7VJ450WbBYj7shpwU2U7BD_XQ7NCpsvi2HbcgoWzp2alvojvMCuj7NLZHY4oubatBtCoS8soCKevCpvcuVHFWtVpPjomXDsLu3W-cioyQwWxWBHV5KZRjUeQ5eGsDNiD19iHl9C7WKVTpy2NJBw_uGvx5kOkHPEI_o6_SPnyGT1NMVa1sl9CBGc4nRI" />
                                    <img alt="Wave" style={{ height: '24px', filter: 'grayscale(1)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEv4_yIQT-8czi2l23oFBDRRAXkp_mX1UW2uFCX8yNsS6b1LzYjDWwb2epy_h1aErdRwYQAgmSRqlSkexxboJKEpYbptiuHMOwd8_1dY3dvBPrjlDAJF4-tkWKC8tA89cbv41O0_5aF2WnatCE2P93deu-YAsPS2P1x-Ge-RrPMc-aY9p2D0uxpQ2456rZlDq2bRSzcxVUV5M2MR1edRiUobDrF6NI47bmPCFFIkTfwhdgdIETpClJCYZOFrp-2XIYV83ewEgJjdbD" />
                                </div>
                                <p style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, margin: 0 }}>
                                    * Ce lien est valable pour une lecture unique. Achat définitif disponible pour les membres.
                                </p>
                            </div>
                        </div>

                        {/* Right: Hero card */}
                        <div className="landing-hero__card animate-fade-in-up delay-2">
                            <div className="glass-panel landing-hero__card-inner">
                                <div className="landing-hero__card-image">
                                    {heroTrack.coverImage && <img alt="Audio Artwork" src={heroTrack.coverImage} />}
                                    <div className="landing-hero__card-overlay">
                                        <div className="landing-hero__card-lock">
                                            <Lock size={36} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{heroTrack.title}</h3>
                                        <p style={{ color: 'var(--primary-color)', fontWeight: 500, letterSpacing: '0.025em', textTransform: 'uppercase', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>{heroTrack.artistName || heroTrack.artist?.name}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
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
                    <section id="explorer" className="landing-section" style={{ background: 'var(--surface-color)' }}>
                        <div className="landing-section__inner" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                                <div style={{ maxWidth: '36rem' }}>
                                    <h2 className="landing-section__title">Explorer les exclusivités</h2>
                                    <p className="landing-section__subtitle" style={{ marginTop: 'var(--space-sm)' }}>Découvrez les pépites sonores disponibles pour une écoute éphémère.</p>
                                </div>

                                <div style={{ position: 'relative', maxWidth: '500px' }}>
                                    <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un son ou un artiste..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>

                            {filteredTracks.length === 0 ? (
                                <div className="empty-state">
                                    <p>Aucun morceau trouvé pour &quot;{searchQuery}&quot;</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
                                    <div className="landing-tracks">
                                        {filteredTracks.slice(0, 8).map((track, i) => (
                                            <div key={track.id} className={`animate-fade-in-up delay-${Math.min(i + 1, 4)}`}>
                                                <TrackCard track={track} onClick={() => openModal(track)} />
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Link href="/explore" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                <section id="comment-ca-marche" className="landing-section" style={{ background: 'var(--bg-color)' }}>
                    <div className="landing-section__inner">
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
                            <h2 className="landing-section__title" style={{ textTransform: 'uppercase', letterSpacing: '-0.025em' }}>Comment ça marche ?</h2>
                            <p className="landing-section__subtitle" style={{ marginTop: 'var(--space-sm)' }}>Une expérience simple, rapide et exclusive.</p>
                        </div>

                        <div className="landing-steps">
                            <div className="landing-step animate-fade-in-up delay-1">
                                <div className="landing-step__icon">
                                    <CreditCard size={28} />
                                </div>
                                <div>
                                    <h4 className="landing-step__title">1. Payez {heroTrack.priceStream} FCFA</h4>
                                    <p className="landing-step__text">Utilisez votre Mobile Money (Orange, MTN, Wave) pour un accès rapide.</p>
                                </div>
                            </div>

                            <div className="landing-step animate-fade-in-up delay-2">
                                <div className="landing-step__icon">
                                    <Lock size={28} />
                                </div>
                                <div>
                                    <h4 className="landing-step__title">2. Recevez votre lien</h4>
                                    <p className="landing-step__text">Un lien d'écoute unique vous est instantanément généré après validation.</p>
                                </div>
                            </div>

                            <div className="landing-step animate-fade-in-up delay-3">
                                <div className="landing-step__icon">
                                    <Headphones size={28} />
                                </div>
                                <div>
                                    <h4 className="landing-step__title">3. Écoutez une fois</h4>
                                    <p className="landing-step__text">Lancez la lecture. Attention, le lien expire dès que la musique se termine.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section id="aide" className="landing-section" style={{ background: 'var(--surface-color)', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--space-lg)' }}>
                        <h2 className="landing-section__title" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>Questions fréquentes</h2>

                        <div className="landing-faq">
                            <details className="landing-faq__item">
                                <summary className="landing-faq__question">Puis-je réécouter le morceau ?</summary>
                                <p className="landing-faq__answer">Non, le concept est basé sur l'exclusivité et l'écoute unique. Une fois la lecture terminée, le lien devient invalide.</p>
                            </details>
                            <details className="landing-faq__item">
                                <summary className="landing-faq__question">Quels sont les moyens de paiement ?</summary>
                                <p className="landing-faq__answer">Nous acceptons Orange Money, MTN Mobile Money et Wave. Le paiement est 100% sécurisé.</p>
                            </details>
                            <details className="landing-faq__item">
                                <summary className="landing-faq__question">La qualité audio est-elle bonne ?</summary>
                                <p className="landing-faq__answer">Oui, nous proposons une qualité Studio HD sans compression pour une expérience immersive.</p>
                            </details>
                            <details className="landing-faq__item">
                                <summary className="landing-faq__question">Le lien a expiré avant que je puisse écouter.</summary>
                                <p className="landing-faq__answer">Si vous rencontrez un problème technique, contactez notre support avec votre reçu de paiement.</p>
                            </details>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {isModalOpen && (
                <PaymentModal
                    onCloseAction={() => { setIsModalOpen(false); setSelectedTrack(null); }}
                    trackTitle={selectedTrack?.title}
                    trackId={selectedTrack?.id}
                    priceStream={selectedTrack?.priceStream}
                    priceDownload={selectedTrack?.priceDownload}
                    isLoggedIn={!!session}
                />
            )}
        </div>
    );
}
