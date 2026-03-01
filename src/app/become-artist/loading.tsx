export default function BecomeArtistLoading() {
    return (
        <div className="container" style={{ maxWidth: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
            <div className="glass-card" style={{ width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
                <div className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto var(--space-xl)' }} />

                <div className="skeleton" style={{ width: '250px', height: '32px', margin: '0 auto var(--space-md)' }} />
                <div className="skeleton" style={{ width: '80%', height: '20px', margin: '0 auto var(--space-md)' }} />
                <div className="skeleton" style={{ width: '70%', height: '20px', margin: '0 auto var(--space-2xl)' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div className="skeleton" style={{ width: '100%', height: '56px', borderRadius: 'var(--radius-full)' }} />
                    <div className="skeleton" style={{ width: '100%', height: '56px', borderRadius: 'var(--radius-full)' }} />
                </div>
            </div>
        </div>
    );
}
