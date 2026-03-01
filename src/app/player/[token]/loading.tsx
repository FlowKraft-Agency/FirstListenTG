export default function PlayerLoading() {
    return (
        <main className="player-page container">
            <div className="skeleton" style={{ width: '150px', height: '24px', marginBottom: 'var(--space-2xl)' }} />

            <div style={{ width: '100%', maxWidth: '896px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                {/* Player Interface Skeleton */}
                <div className="glass-panel" style={{ padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)' }}>
                    <div className="skeleton" style={{ width: '250px', height: '250px', borderRadius: 'var(--radius-lg)' }} />
                    <div className="skeleton" style={{ width: '200px', height: '32px' }} />
                    <div className="skeleton" style={{ width: '150px', height: '20px' }} />

                    <div style={{ width: '100%', marginTop: 'var(--space-xl)' }}>
                        <div className="skeleton" style={{ width: '100%', height: '8px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-sm)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className="skeleton" style={{ width: '40px', height: '16px' }} />
                            <div className="skeleton" style={{ width: '40px', height: '16px' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
                        <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                        <div className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
                        <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                    </div>
                </div>

                {/* Track Info Skeleton */}
                <div className="glass-panel player-page__info" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                    <div>
                        <div className="skeleton" style={{ width: '200px', height: '24px', marginBottom: 'var(--space-xs)' }} />
                        <div className="skeleton" style={{ width: '300px', height: '16px' }} />
                    </div>
                </div>
            </div>
        </main>
    );
}
