export default function ArtistAnalyticsLoading() {
    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <div className="skeleton" style={{ width: '250px', height: '32px', marginBottom: 'var(--space-md)' }} />
            <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: 'var(--space-2xl)' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="glass-panel" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                            <div className="skeleton" style={{ width: '120px', height: '20px' }} />
                            <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)' }} />
                        </div>
                        <div className="skeleton" style={{ width: '150px', height: '36px' }} />
                    </div>
                ))}
            </div>

            <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', height: '400px' }}>
                <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
        </div>
    );
}
