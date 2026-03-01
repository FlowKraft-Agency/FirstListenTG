export default function ProfileLoading() {
    return (
        <div className="container">
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-lg)' }}>
                <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
                <div className="skeleton" style={{ width: '200px', height: '32px' }} />
                <div className="skeleton" style={{ width: '150px', height: '24px', marginBottom: 'var(--space-md)' }} />

                <div style={{ display: 'flex', gap: 'var(--space-md)', width: '100%', justifyContent: 'center' }}>
                    <div className="skeleton" style={{ width: '120px', height: '48px', borderRadius: 'var(--radius-full)' }} />
                </div>
            </div>
        </div>
    );
}
