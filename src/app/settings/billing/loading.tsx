export default function BillingLoading() {
    return (
        <div className="container">
            <div className="skeleton" style={{ width: '250px', height: '32px', marginBottom: 'var(--space-md)' }} />
            <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: 'var(--space-2xl)' }} />

            <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                    <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                    <div>
                        <div className="skeleton" style={{ width: '150px', height: '20px', marginBottom: 'var(--space-xs)' }} />
                        <div className="skeleton" style={{ width: '200px', height: '16px' }} />
                    </div>
                </div>
                <div className="skeleton" style={{ width: '100%', height: '100px', borderRadius: 'var(--radius-md)' }} />
            </div>

            <div className="skeleton" style={{ width: '200px', height: '24px', marginBottom: 'var(--space-md)' }} />
            <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton" style={{ width: '100%', height: '40px', marginBottom: i < 3 ? 'var(--space-md)' : 0 }} />
                ))}
            </div>
        </div>
    );
}
