export default function ArtistPublicLoading() {
    return (
        <div className="container">
            {/* Artist Header Skeleton */}
            <div style={{ padding: 'var(--space-2xl) 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)' }}>
                <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
                <div>
                    <div className="skeleton" style={{ width: '200px', height: '40px', margin: '0 auto var(--space-sm)' }} />
                    <div className="skeleton" style={{ width: '150px', height: '20px', margin: '0 auto' }} />
                </div>
            </div>

            {/* Tracks List Skeleton */}
            <div className="skeleton" style={{ width: '150px', height: '32px', marginBottom: 'var(--space-xl)', marginTop: 'var(--space-xl)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="glass-panel" style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
                        <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div className="skeleton" style={{ width: '200px', height: '24px', marginBottom: 'var(--space-sm)' }} />
                            <div className="skeleton" style={{ width: '120px', height: '16px' }} />
                        </div>
                        <div className="skeleton" style={{ width: '100px', height: '40px', borderRadius: 'var(--radius-full)' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
