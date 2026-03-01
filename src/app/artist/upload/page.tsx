"use client";
import { getSignedUploadUrl, saveTrackRecord } from "./actions";
import { useState } from "react";
import { UploadCloud, CheckCircle } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export default function UploadPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStep, setUploadStep] = useState<'idle' | 'preparing' | 'uploading' | 'saving' | 'done'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setUploadProgress(0);
        setUploadStep('preparing');

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const artistName = formData.get("artistName") as string;
        const coverImage = formData.get("coverImage") as string;
        const audioFile = formData.get("audioFile") as File;
        const priceStream = parseInt(formData.get("priceStream") as string);
        const priceDownload = parseInt(formData.get("priceDownload") as string);

        if (!title || !audioFile || audioFile.size === 0) {
            setError("Titre et fichier audio requis");
            setLoading(false);
            setUploadStep('idle');
            return;
        }

        try {
            // 1. Get signed URL for direct upload
            const fileExt = audioFile.name.split('.').pop() || 'mp3';
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            const urlResult = await getSignedUploadUrl(fileName, audioFile.type);

            if (urlResult.error || !urlResult.path || !urlResult.token) {
                setError(urlResult.error || "Erreur lors de la préparation de l'upload");
                setLoading(false);
                setUploadStep('idle');
                return;
            }

            // 2. Upload via XMLHttpRequest for progress tracking
            setUploadStep('uploading');

            const uploadUrl = `${supabaseUrl}/storage/v1/object/upload/sign/audio-tracks/${urlResult.path}?token=${urlResult.token}`;

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        setUploadProgress(percent);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error("Erreur lors de l'envoi du fichier vers le serveur de stockage."));
                    }
                };

                xhr.onerror = () => {
                    reject(new Error("Erreur réseau lors de l'upload."));
                };

                xhr.open('PUT', uploadUrl);
                xhr.setRequestHeader('Content-Type', audioFile.type);
                xhr.send(audioFile);
            });

            // 3. Save the track record in PostgreSQL
            setUploadStep('saving');
            setUploadProgress(100);

            const saveResult = await saveTrackRecord({
                title,
                artistName,
                coverImage,
                audioFileName: fileName,
                priceStream,
                priceDownload
            });

            if (saveResult.error) {
                setError(saveResult.error);
                setUploadStep('idle');
            } else {
                setUploadStep('done');
                setSuccess(true);
            }
        } catch (err: any) {
            console.error("Upload process error:", err);
            setError(err.message || "Erreur lors de l'upload.");
            setUploadStep('idle');
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="animate-fade-in" style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={64} style={{ margin: '0 auto 1rem', color: 'var(--primary-color)' }} />
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-main)' }}>Upload réussi !</h1>
                <p>Votre morceau a été envoyé. Il sera disponible publiquement une fois validé par un modérateur.</p>
                <button onClick={() => { setSuccess(false); setUploadProgress(0); setUploadStep('idle'); }} className="btn btn-secondary" style={{ marginTop: '2rem' }}>
                    Uploader un autre morceau
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: 0 }}>Publier un Son</h1>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Uploadez votre nouveau morceau de manière sécurisée.</p>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {error && <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>{error}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Titre du morceau *</label>
                    <input name="title" required type="text" placeholder="Ex: Midnight Resonance" className="input-base" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Nom d&apos;artiste (Optionnel)</label>
                    <input name="artistName" type="text" placeholder="Laissez vide pour utiliser votre nom de profil" className="input-base" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Image de couverture (Optionnel, URL)</label>
                    <input name="coverImage" type="url" placeholder="https://..." className="input-base" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Fichier Audio (.mp3, .wav) *</label>
                    <input name="audioFile" required type="file" accept="audio/*" className="input-base" style={{ paddingTop: '0.5rem' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Prix Écoute (FCFA)</label>
                        <input name="priceStream" type="number" defaultValue={200} required className="input-base" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Prix Téléchargement (FCFA)</label>
                        <input name="priceDownload" type="number" defaultValue={500} required className="input-base" />
                    </div>
                </div>

                {/* Upload Progress */}
                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        <div className="upload-progress">
                            <div className="upload-progress__bar" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <div className="upload-progress__text">{uploadProgress}%</div>
                        <div className={`upload-step ${uploadStep === 'preparing' ? 'upload-step--active' : ''}`}>
                            {uploadStep === 'preparing' && <div className="loading-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />}
                            {uploadStep === 'preparing' ? 'Préparation...' : (uploadStep === 'uploading' || uploadStep === 'saving' || uploadStep === 'done') ? '✓ Préparation' : 'Préparation'}
                        </div>
                        <div className={`upload-step ${uploadStep === 'uploading' ? 'upload-step--active' : ''}`}>
                            {uploadStep === 'uploading' && <div className="loading-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />}
                            {uploadStep === 'uploading' ? 'Envoi du fichier...' : (uploadStep === 'saving' || uploadStep === 'done') ? '✓ Envoi du fichier' : 'Envoi du fichier'}
                        </div>
                        <div className={`upload-step ${uploadStep === 'saving' ? 'upload-step--active' : ''}`}>
                            {uploadStep === 'saving' && <div className="loading-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />}
                            {uploadStep === 'saving' ? 'Finalisation...' : uploadStep === 'done' ? '✓ Finalisation' : 'Finalisation'}
                        </div>
                    </div>
                )}

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', marginTop: '0.5rem', width: '100%' }}>
                    {loading ? (
                        <>
                            <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }} />
                            Envoi en cours...
                        </>
                    ) : <><UploadCloud size={20} /> Publier le morceau</>}
                </button>
            </form>
        </div>
    );
}
