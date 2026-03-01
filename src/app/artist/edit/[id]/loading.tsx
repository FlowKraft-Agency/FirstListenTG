export default function ArtistEditLoading() {
    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="skeleton" style={{ width: '250px', height: '32px', marginBottom: 'var(--space-md)' }} />
            <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: 'var(--space-2xl)' }} />

            <div className="glass-panel" style={{ padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i}>
                            <div className="skeleton" style={{ width: '120px', height: '20px', marginBottom: 'var(--space-sm)' }} />
                            <div className="skeleton" style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-md)' }} />
                        </div>
                    ))}
                    <div className="skeleton" style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-md)' }} />
                </div>
            </div>
        </div>
    );
}
