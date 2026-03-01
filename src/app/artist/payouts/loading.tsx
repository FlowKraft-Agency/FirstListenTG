export default function PayoutsLoading() {
    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <div className="skeleton" style={{ width: '250px', height: '32px', marginBottom: 'var(--space-md)' }} />
            <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: 'var(--space-2xl)' }} />

            <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                    <div>
                        <div className="skeleton" style={{ width: '150px', height: '20px', marginBottom: 'var(--space-xs)' }} />
                        <div className="skeleton" style={{ width: '200px', height: '36px' }} />
                    </div>
                    <div className="skeleton" style={{ width: '140px', height: '48px', borderRadius: 'var(--radius-full)' }} />
                </div>

                <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '0', borderBottom: '1px solid var(--border-color)' }} />
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="skeleton" style={{ width: '100%', height: '56px', borderRadius: '0', borderBottom: i < 5 ? '1px solid var(--border-color)' : 'none' }} />
                ))}
            </div>
        </div>
    );
}
