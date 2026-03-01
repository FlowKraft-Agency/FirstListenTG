export default function UploadLoading() {
    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="skeleton" style={{ width: '250px', height: '32px', marginBottom: 'var(--space-md)' }} />
            <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: 'var(--space-2xl)' }} />

            <div className="glass-panel" style={{ padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <div className="skeleton" style={{ width: '100%', height: '150px', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border-color)' }} />
                    <div className="skeleton" style={{ width: '100%', height: '150px', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border-color)' }} />

                    {[1, 2, 3].map(i => (
                        <div key={i}>
                            <div className="skeleton" style={{ width: '120px', height: '20px', marginBottom: 'var(--space-sm)' }} />
                            <div className="skeleton" style={{ width: '100%', height: i === 3 ? '100px' : '48px', borderRadius: 'var(--radius-md)' }} />
                        </div>
                    ))}

                    <div className="skeleton" style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-md)' }} />
                </div>
            </div>
        </div>
    );
}
