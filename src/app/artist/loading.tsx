export default function Loading() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 100px)',
            width: '100%'
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid var(--border-color)',
                borderTopColor: 'var(--primary-color)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
            }}></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 500 }}>
                Chargement du studio...
            </p>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
