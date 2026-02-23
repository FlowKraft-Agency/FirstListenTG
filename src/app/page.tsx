'use client';

import { useState } from 'react';
import { Shield, Lock, Music, UserCircle, ArrowRight, Headphones, CreditCard, PlayCircle } from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const { data: session } = useSession();

  const MOCK_TRACKS = [
    { id: '1', title: "Urban Sunset", artist: "Dj Nex", price: 100, color: "#9333ea", cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWJ_ATKP7m1GNpZVDdauY8J2KB8ynnoyJDcwRb7N4WpSNXjr7Vtg1QcPdP13OP2L22dWmsNELejJtnr3eR_blyB_qb4l7R-B4_rShkB1YmpGsUoUB0NStvbaJIEM74mUb7ZIAYA_cZGx3pwZUpE2FBJhR9D-TMZaYXsMKjLAlXI2B6XSAk7Pfl2ACYLxJl5qCQE9Z5PiGSMRfagoVln-Uhc-L3TZQECmXFvEE2Zs9LhbJQgAkZLGUZjCka1K6_EzOXL98IKTQv94eg" },
    { id: '2', title: "Ocean Breeze", artist: "Serene Sound", price: 100, color: "#3b82f6", cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWJ_ATKP7m1GNpZVDdauY8J2KB8ynnoyJDcwRb7N4WpSNXjr7Vtg1QcPdP13OP2L22dWmsNELejJtnr3eR_blyB_qb4l7R-B4_rShkB1YmpGsUoUB0NStvbaJIEM74mUb7ZIAYA_cZGx3pwZUpE2FBJhR9D-TMZaYXsMKjLAlXI2B6XSAk7Pfl2ACYLxJl5qCQE9Z5PiGSMRfagoVln-Uhc-L3TZQECmXFvEE2Zs9LhbJQgAkZLGUZjCka1K6_EzOXL98IKTQv94eg" },
    { id: '3', title: "Ethereal Beat", artist: "The Ghost", price: 100, color: "#eab308", cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWJ_ATKP7m1GNpZVDdauY8J2KB8ynnoyJDcwRb7N4WpSNXjr7Vtg1QcPdP13OP2L22dWmsNELejJtnr3eR_blyB_qb4l7R-B4_rShkB1YmpGsUoUB0NStvbaJIEM74mUb7ZIAYA_cZGx3pwZUpE2FBJhR9D-TMZaYXsMKjLAlXI2B6XSAk7Pfl2ACYLxJl5qCQE9Z5PiGSMRfagoVln-Uhc-L3TZQECmXFvEE2Zs9LhbJQgAkZLGUZjCka1K6_EzOXL98IKTQv94eg" },
    { id: '4', title: "Neon City", artist: "Cyber Vibes", price: 100, color: "#ef4444", cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWJ_ATKP7m1GNpZVDdauY8J2KB8ynnoyJDcwRb7N4WpSNXjr7Vtg1QcPdP13OP2L22dWmsNELejJtnr3eR_blyB_qb4l7R-B4_rShkB1YmpGsUoUB0NStvbaJIEM74mUb7ZIAYA_cZGx3pwZUpE2FBJhR9D-TMZaYXsMKjLAlXI2B6XSAk7Pfl2ACYLxJl5qCQE9Z5PiGSMRfagoVln-Uhc-L3TZQECmXFvEE2Zs9LhbJQgAkZLGUZjCka1K6_EzOXL98IKTQv94eg" },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }} className="bg-abstract">
      {/* Navbar v3 */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,12,9,0.8)', backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: '#fff' }}>
            <div style={{ background: 'var(--primary-color)', color: '#000', padding: '0.375rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Music size={24} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.025em' }}>
              First<span style={{ color: 'var(--primary-color)' }}>Listen</span>
            </span>
          </Link>

          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            <a href="#explorer" style={{ color: 'inherit', textDecoration: 'none' }}>Explorer</a>
            <a href="#comment-ca-marche" style={{ color: 'inherit', textDecoration: 'none' }}>Comment ça marche</a>
            <a href="#aide" style={{ color: 'inherit', textDecoration: 'none' }}>Aide</a>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {session ? (
              <>
                <Link href="/library" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  <Music size={16} /> Bibliothèque
                </Link>
                <Link href="/profile" style={{ color: 'var(--text-muted)' }}>
                  <UserCircle size={24} />
                </Link>
              </>
            ) : (
              <Link href="/login" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none' }}>
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
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(13, 242, 89, 0.1)', border: '1px solid rgba(13, 242, 89, 0.2)', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                    <span style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: 'var(--primary-color)', opacity: 0.75 }}></span>
                    <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: 'var(--primary-color)' }}></span>
                  </span>
                  Sortie Exclusive
                </div>
              </div>

              <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', margin: 0 }}>
                Écoutez ce son <span style={{ color: 'var(--primary-color)' }}>exclusif</span> maintenant
              </h1>

              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.6, maxWidth: '500px', margin: 0 }}>
                Disponible pour une écoute unique après paiement. Vivez une expérience sonore inédite en haute définition.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff' }}>100 FCFA</span>
                  <div style={{ height: '2rem', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <Shield size={18} color="var(--primary-color)" /> Paiement Sécurisé
                  </div>
                </div>

                <button
                  className="neon-glow"
                  onClick={() => { setSelectedTrack("Midnight Resonance"); setIsModalOpen(true); }}
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
                  <img alt="Audio Artwork" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(4px)', transform: 'scale(1.05)' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWJ_ATKP7m1GNpZVDdauY8J2KB8ynnoyJDcwRb7N4WpSNXjr7Vtg1QcPdP13OP2L22dWmsNELejJtnr3eR_blyB_qb4l7R-B4_rShkB1YmpGsUoUB0NStvbaJIEM74mUb7ZIAYA_cZGx3pwZUpE2FBJhR9D-TMZaYXsMKjLAlXI2B6XSAk7Pfl2ACYLxJl5qCQE9Z5PiGSMRfagoVln-Uhc-L3TZQECmXFvEE2Zs9LhbJQgAkZLGUZjCka1K6_EzOXL98IKTQv94eg" />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(8,12,9,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '5rem', height: '5rem', background: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                      <Lock size={36} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>Midnight Resonance</h3>
                      <p style={{ color: 'var(--primary-color)', fontWeight: 500, letterSpacing: '0.025em', textTransform: 'uppercase', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: 0 }}>L'ARTISTE MYSTÈRE</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                    <span>Audio HD Lossless</span>
                    <span>2.4k Écoutes</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* EXPLORER SECTION */}
        <section id="explorer" style={{ maxWidth: '1280px', margin: '0 auto', padding: '6rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '36rem' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.025em', margin: 0 }}>Explorer</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Découvrez d'autres pépites musicales exclusives prêtes à être débloquées.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {MOCK_TRACKS.map(track => (
                <div key={track.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', borderRadius: '1rem' }} onClick={() => { setSelectedTrack(track.title); setIsModalOpen(true); }}>
                  <div style={{ aspectRatio: '1', borderRadius: '0.75rem', overflow: 'hidden', position: 'relative' }}>
                    <img alt={track.title} src={track.cover} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(8px)', background: track.color }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                      <Lock size={32} color="#fff" />
                    </div>
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontWeight: 700, margin: 0 }}>{track.title}</h4>
                    <p style={{ color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.25rem', marginBottom: 0 }}>{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMMENT CA MARCHE */}
        <section id="comment-ca-marche" style={{ background: 'var(--surface-color)', padding: '6rem 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.025em', margin: 0 }}>Comment ça marche</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Une expérience simple, rapide et exclusive.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
                <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: 'rgba(13, 242, 89, 0.1)', border: '2px solid rgba(13, 242, 89, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--primary-color)', color: '#000', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>1</div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Choisissez</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>Naviguez dans notre catalogue et trouvez la pépite qui vous fait vibrer.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
                <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: 'rgba(13, 242, 89, 0.1)', border: '2px solid rgba(13, 242, 89, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--primary-color)', color: '#000', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>2</div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Payez</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>Réglez via Mobile Money en un clic. Transaction sécurisée et instantanée.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
                <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: 'rgba(13, 242, 89, 0.1)', border: '2px solid rgba(13, 242, 89, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--primary-color)', color: '#000', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>3</div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Écoutez</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>Profitez de votre écoute unique HD ou ajoutez le définitivement à Ma Musique.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - AIDE */}
        <section id="aide" style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.025em', margin: 0 }}>Aide</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Des questions ? Nous avons les réponses.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem', marginTop: 0 }}>Puis-je réécouter le morceau plus tard ?</h5>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Le ticket à 200 FCFA est valable pour 30 minutes après achat. Pour une conservation illimitée dans "Ma Musique", vous pouvez opter pour l'achat définitif (500 FCFA) en vous connectant.</p>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem', marginTop: 0 }}>Quels sont les moyens de paiement acceptés ?</h5>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Nous acceptons les principaux services Mobile Money : Flooz, TMoney, et Mixx by Yas.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'var(--bg-color)', padding: '3rem 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', opacity: 0.5, marginBottom: '1rem' }}>
          <Music size={18} strokeWidth={2.5} />
          <span style={{ fontSize: '1.125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.025em' }}>FirstListen</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500, margin: 0 }}>
          © 2026 FirstListen. Tous droits réservés.
        </p>
      </footer>

      {isModalOpen && <PaymentModal onCloseAction={() => { setIsModalOpen(false); setSelectedTrack(null); }} trackTitle={selectedTrack} isLoggedIn={!!session} />}
    </div>
  );
}
