import DashboardSidebar from "@/components/DashboardSidebar";

export default function LibraryLoading() {
    return (
        <div className="dashboard-container">
            <DashboardSidebar />
            <main className="dashboard-main">
                <div className="skeleton" style={{ width: '200px', height: '40px', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ width: '300px', height: '20px', marginBottom: 'var(--space-2xl)' }} />

                <div className="grid-responsive">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="track-card">
                            <div className="track-card__image-wrapper skeleton" style={{ background: 'var(--surface-sunken)' }} />
                            <div style={{ padding: 'var(--space-md)' }}>
                                <div className="skeleton" style={{ width: '80%', height: '20px', marginBottom: 'var(--space-sm)' }} />
                                <div className="skeleton" style={{ width: '60%', height: '16px', marginBottom: 'var(--space-sm)' }} />
                                <div className="skeleton" style={{ width: '40px', height: '24px', borderRadius: 'var(--radius-full)' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
