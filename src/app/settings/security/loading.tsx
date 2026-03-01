export default function SecurityLoading() {
    return (
        <div className="container">
            <div className="skeleton" style={{ width: '250px', height: '32px', marginBottom: 'var(--space-md)' }} />
            <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: 'var(--space-2xl)' }} />

            <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i}>
                            <div className="skeleton" style={{ width: '120px', height: '20px', marginBottom: 'var(--space-sm)' }} />
                            <div className="skeleton" style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-md)' }} />
                        </div>
                    ))}
                    <div className="skeleton" style={{ width: '150px', height: '48px', borderRadius: 'var(--radius-full)', marginTop: 'var(--space-md)' }} />
                </div>
            </div>
        </div>
    );
}
