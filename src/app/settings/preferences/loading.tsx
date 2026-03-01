export default function PreferencesLoading() {
    return (
        <div className="container">
            <div className="skeleton" style={{ width: '250px', height: '32px', marginBottom: 'var(--space-md)' }} />
            <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: 'var(--space-2xl)' }} />

            <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: i < 3 ? '1px solid var(--border-color)' : 'none' }}>
                        <div>
                            <div className="skeleton" style={{ width: '150px', height: '20px', marginBottom: 'var(--space-xs)' }} />
                            <div className="skeleton" style={{ width: '250px', height: '16px' }} />
                        </div>
                        <div className="skeleton" style={{ width: '48px', height: '24px', borderRadius: 'var(--radius-full)' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
