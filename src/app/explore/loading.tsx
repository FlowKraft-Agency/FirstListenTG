export default function ExploreLoading() {
    return (
        <div className="container">
            <div className="skeleton" style={{ width: '200px', height: '40px', marginBottom: 'var(--space-md)' }} />
            <div className="skeleton" style={{ width: '300px', height: '24px', marginBottom: 'var(--space-2xl)' }} />

            <div className="grid-responsive">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="track-card">
                        <div className="track-card__image-wrapper skeleton" style={{ background: 'var(--surface-sunken)' }} />
                        <div style={{ padding: 'var(--space-md)' }}>
                            <div className="skeleton" style={{ width: '80%', height: '20px', marginBottom: 'var(--space-sm)' }} />
                            <div className="skeleton" style={{ width: '60%', height: '16px' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
