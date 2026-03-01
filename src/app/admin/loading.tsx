export default function AdminLoading() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', padding: 'var(--space-md)' }}>
            <div className="skeleton" style={{ width: '250px', height: '40px', marginBottom: 'var(--space-sm)' }} />

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

            <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: 'var(--space-md)' }} />
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div className="skeleton" style={{ width: '100%', height: '56px', borderRadius: '0', borderBottom: '1px solid var(--border-color)' }} />
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="skeleton" style={{ width: '100%', height: '64px', borderRadius: '0', borderBottom: i < 5 ? '1px solid var(--border-color)' : 'none' }} />
                ))}
            </div>
        </div>
    );
}
