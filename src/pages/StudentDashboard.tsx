import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { laundryService } from '../services/laundryService';
import type { LaundryItem } from '../services/laundryService';
import { MdDashboard, MdLocalLaundryService, MdHistory, MdLogout, MdPerson } from 'react-icons/md';
import './Dashboard.css';

const StudentDashboard: React.FC = () => {
    const [laundryItems, setLaundryItems] = useState<LaundryItem[]>([]);
    const [formData, setFormData] = useState({
        shirts: 0,
        bottoms: 0,
        towels: 0,
        bedsheets: 0,
        others: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editingIssue, setEditingIssue] = useState<number | null>(null);
    const [issueText, setIssueText] = useState<string>('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchLaundry();
    }, []);

    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error]);

    const fetchLaundry = async () => {
        try {
            const data = await laundryService.getMyLaundry();
            setLaundryItems(data);
        } catch (err: any) {
            setError('Failed to fetch laundry items');
        }
    };

    const handleRequestPickup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            await laundryService.createLaundryTicket(formData);
            setSuccessMessage('Laundry ticket created successfully!');
            setFormData({
                shirts: 0,
                bottoms: 0,
                towels: 0,
                bedsheets: 0,
                others: 0
            });
            setShowCreateModal(false);
            fetchLaundry();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create laundry ticket');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value < 0 ? 0 : value
        }));
    };

    const getTotalItems = () => {
        return formData.shirts + formData.bottoms + formData.towels + formData.bedsheets + formData.others;
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getStatusBadge = (status: string) => {
        const statusClass = status.toLowerCase().replace('_', '-');
        return <span className={`status-badge ${statusClass}`}>{status.replace('_', ' ')}</span>;
    };

    const handleMarkAsPickedUp = async (id: number, bagNumber: string) => {
        if (window.confirm(`Are you sure you want to mark Bag #${bagNumber} as picked up?`)) {
            try {
                await laundryService.updateMyLaundryStatus(id, 'PICKED_UP');
                setSuccessMessage('Successfully marked as picked up!');
                fetchLaundry();
            } catch (err: any) {
                setError('Failed to update status');
            }
        }
    };

    const handleIssueUpdate = async (id: number) => {
        try {
            await laundryService.updateMyLaundryIssue(id, issueText);
            setEditingIssue(null);
            setIssueText('');
            fetchLaundry();
        } catch (err: any) {
            setError('Failed to update issue');
        }
    };

    const handleDeleteTicket = async (id: number, bagNumber: string) => {
        if (window.confirm(`Are you sure you want to delete laundry ticket for Bag #${bagNumber}? This action cannot be undone.`)) {
            try {
                await laundryService.deleteLaundryTicket(id);
                setSuccessMessage('Laundry ticket deleted successfully!');
                fetchLaundry();
            } catch (err: any) {
                setError('Failed to delete laundry ticket');
            }
        }
    };

    const handleEditIssue = (id: number, currentIssue: string | null) => {
        setEditingIssue(id);
        setIssueText(currentIssue || '');
    };

    const handleCancelEdit = () => {
        setEditingIssue(null);
        setIssueText('');
    };

    const filteredLaundryItems = laundryItems
        .filter(item => {
            if (activeTab === 'history') {
                if (item.status !== 'PICKED_UP') return false;
            }
            else if (activeTab === 'laundry') {
                if (item.status === 'PICKED_UP') return false;
            }

            const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;

            const matchesSearch = searchQuery === '' ||
                item.bagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                new Date(item.pickupDate).toLocaleDateString().includes(searchQuery);

            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.pickupDate).getTime();
            const dateB = new Date(b.pickupDate).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>LaundryLink</h2>
                    <p className="sidebar-subtitle">Student Portal</p>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <MdDashboard className="sidebar-icon" />
                        <span>Dashboard</span>
                    </button>
                    <button
                        className={`sidebar-item ${activeTab === 'laundry' ? 'active' : ''}`}
                        onClick={() => setActiveTab('laundry')}
                    >
                        <MdLocalLaundryService className="sidebar-icon" />
                        <span>My Laundry</span>
                    </button>
                    <button
                        className={`sidebar-item ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <MdHistory className="sidebar-icon" />
                        <span>History</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-item" onClick={handleLogout}>
                        <MdLogout className="sidebar-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-content">
                        <h1 className="navbar-title">Student Dashboard</h1>
                        <div className="navbar-user">
                            <MdPerson className="user-icon" />
                            <span className="user-name">Student</span>
                        </div>
                    </div>
                </nav>

                {/* Dashboard Content */}
                <div className="dashboard-container">
                    {/* Student Summary Section */}
                    <div className="student-summary">
                        <div className="summary-header">
                            <div>
                                <h2>Welcome Back</h2>
                                <p className="summary-subtitle">Manage your laundry requests</p>
                            </div>
                            <button
                                className="btn-create-ticket"
                                onClick={() => setShowCreateModal(true)}
                            >
                                + Create Ticket
                            </button>
                        </div>

                        <div className="summary-stats">
                            <div className="summary-stat-card">
                                <div className="stat-icon pending">
                                    <MdLocalLaundryService />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Pending</p>
                                    <p className="stat-value">{laundryItems.filter(i => i.status === 'PENDING').length}</p>
                                </div>
                            </div>
                            <div className="summary-stat-card">
                                <div className="stat-icon picked-up">
                                    <MdLocalLaundryService />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Picked Up</p>
                                    <p className="stat-value">{laundryItems.filter(i => i.status === 'PICKED_UP').length}</p>
                                </div>
                            </div>
                            <div className="summary-stat-card">
                                <div className="stat-icon washed">
                                    <MdLocalLaundryService />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Washed</p>
                                    <p className="stat-value">{laundryItems.filter(i => i.status === 'WASHED').length}</p>
                                </div>
                            </div>
                            <div className="summary-stat-card">
                                <div className="stat-icon total">
                                    <MdDashboard />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Total Items</p>
                                    <p className="stat-value">{laundryItems.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-content">
                        <section className="laundry-section">
                            <h2>
                                {activeTab === 'dashboard' && 'My Laundry Status'}
                                {activeTab === 'laundry' && 'Active Laundry'}
                                {activeTab === 'history' && 'Laundry History'}
                            </h2>
                            {error && <div className="error-message">{error}</div>}
                            {successMessage && <div className="success-message">{successMessage}</div>}

                            {laundryItems.length === 0 ? (
                                <div className="empty-state">
                                    <MdLocalLaundryService style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                                    <p>No laundry items yet.</p>
                                    <p style={{ fontSize: '14px', color: '#666' }}>Click "Create Ticket" to get started!</p>
                                </div>
                            ) : (
                                <>
                                    {/* Filter and Search Bar */}
                                    <div className="filter-search-container">
                                        <div className="search-bar">
                                            <input
                                                type="text"
                                                placeholder="Search by bag number or date..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="search-input"
                                            />
                                        </div>
                                        <div className="filter-section">
                                            <select
                                                value={sortOrder}
                                                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                                className="filter-btn"
                                            >
                                                <option value="newest">Newest First</option>
                                                <option value="oldest">Oldest First</option>
                                            </select>
                                            <button
                                                className={`filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
                                                onClick={() => setFilterStatus('ALL')}
                                            >
                                                All
                                            </button>
                                            <button
                                                className={`filter-btn ${filterStatus === 'PENDING' ? 'active' : ''}`}
                                                onClick={() => setFilterStatus('PENDING')}
                                            >
                                                Pending
                                            </button>
                                            <button
                                                className={`filter-btn ${filterStatus === 'PICKED_UP' ? 'active' : ''}`}
                                                onClick={() => setFilterStatus('PICKED_UP')}
                                            >
                                                Picked Up
                                            </button>
                                            <button
                                                className={`filter-btn ${filterStatus === 'WASHED' ? 'active' : ''}`}
                                                onClick={() => setFilterStatus('WASHED')}
                                            >
                                                Washed
                                            </button>
                                        </div>
                                    </div>

                                    {filteredLaundryItems.length === 0 ? (
                                        <div className="empty-state">
                                            <p>No items match your search.</p>
                                        </div>
                                    ) : (
                                        <div className="laundry-grid">
                                            {filteredLaundryItems.map((item) => (
                                                <div key={item.id} className="laundry-card">
                                                    <div className="laundry-header">
                                                        <h3>{new Date(item.pickupDate).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}</h3>
                                                        {getStatusBadge(item.status)}
                                                    </div>
                                                    <div className="laundry-details">
                                                        <p><strong>Bag:</strong> #{item.bagNumber}</p>
                                                        <div className="items-breakdown">
                                                            {item.shirts > 0 && <span className="item-badge">Shirts: {item.shirts}</span>}
                                                            {item.bottoms > 0 && <span className="item-badge">Bottoms: {item.bottoms}</span>}
                                                            {item.towels > 0 && <span className="item-badge">Towels: {item.towels}</span>}
                                                            {item.bedsheets > 0 && <span className="item-badge">Sheets: {item.bedsheets}</span>}
                                                            {item.others > 0 && <span className="item-badge">Others: {item.others}</span>}
                                                        </div>

                                                        {/* Issue Section */}
                                                        <div style={{ marginTop: '12px' }}>
                                                            {editingIssue === item.id ? (
                                                                <div style={{ padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                                                                    <textarea
                                                                        value={issueText}
                                                                        onChange={(e) => setIssueText(e.target.value)}
                                                                        placeholder="Describe issue..."
                                                                        style={{
                                                                            width: '100%',
                                                                            padding: '8px',
                                                                            borderRadius: '6px',
                                                                            border: '1px solid #e5e5e5',
                                                                            marginBottom: '8px'
                                                                        }}
                                                                    />
                                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                                        <button onClick={() => handleIssueUpdate(item.id)} className="btn-create-ticket" style={{ padding: '6px 12px', fontSize: '12px' }}>Save</button>
                                                                        <button onClick={handleCancelEdit} className="filter-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>Cancel</button>
                                                                    </div>
                                                                </div>
                                                            ) : item.issue ? (
                                                                <div style={{ padding: '10px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                                                                    <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600, margin: '0 0 4px 0' }}>Issue Reported:</p>
                                                                    <p style={{ fontSize: '13px', margin: 0 }}>{item.issue}</p>
                                                                    <button onClick={() => handleEditIssue(item.id, item.issue)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '11px', marginTop: '4px', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => handleEditIssue(item.id, null)} style={{ background: 'none', border: 'none', color: '#999', fontSize: '12px', cursor: 'pointer' }}>Report Issue</button>
                                                            )}
                                                        </div>

                                                        {item.status === 'WASHED' && (
                                                            <button
                                                                className="btn-mark-picked"
                                                                onClick={() => handleMarkAsPickedUp(item.id, item.bagNumber)}
                                                            >
                                                                Mark as Picked Up
                                                            </button>
                                                        )}

                                                        {/* Delete Button */}
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => handleDeleteTicket(item.id, item.bagNumber)}
                                                            title="Delete this laundry ticket"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    </div>

                    {/* Create Ticket Modal */}
                    {showCreateModal && (
                        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>New Laundry Ticket</h2>
                                    <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
                                </div>

                                <form onSubmit={handleRequestPickup} className="laundry-ticket-form">
                                    <div className="items-grid">
                                        <div className="form-group">
                                            <label htmlFor="shirts">Shirts</label>
                                            <input type="number" id="shirts" min="0" value={formData.shirts} onChange={(e) => handleInputChange('shirts', parseInt(e.target.value) || 0)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="bottoms">Bottoms</label>
                                            <input type="number" id="bottoms" min="0" value={formData.bottoms} onChange={(e) => handleInputChange('bottoms', parseInt(e.target.value) || 0)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="towels">Towels</label>
                                            <input type="number" id="towels" min="0" value={formData.towels} onChange={(e) => handleInputChange('towels', parseInt(e.target.value) || 0)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="bedsheets">Bedsheets</label>
                                            <input type="number" id="bedsheets" min="0" value={formData.bedsheets} onChange={(e) => handleInputChange('bedsheets', parseInt(e.target.value) || 0)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="others">Others</label>
                                            <input type="number" id="others" min="0" value={formData.others} onChange={(e) => handleInputChange('others', parseInt(e.target.value) || 0)} />
                                        </div>
                                    </div>

                                    <div className="total-items">
                                        Total Items: {getTotalItems()}
                                    </div>

                                    <div className="modal-actions">
                                        <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                        <button type="submit" className="btn-primary" disabled={loading || getTotalItems() === 0}>
                                            {loading ? 'Creating...' : 'Create Ticket'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
