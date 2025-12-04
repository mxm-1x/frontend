import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { laundryService } from '../services/laundryService';
import type { LaundryItem } from '../services/laundryService';
import { MdDashboard, MdLocalLaundryService, MdPeople, MdLogout, MdPerson } from 'react-icons/md';
import './Dashboard.css';

const StaffDashboard: React.FC = () => {
    const [laundryItems, setLaundryItems] = useState<LaundryItem[]>([]);
    const [filter, setFilter] = useState<string>('ALL');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingIssue, setEditingIssue] = useState<number | null>(null);
    const [issueText, setIssueText] = useState<string>('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllLaundry();
    }, []);

    const fetchAllLaundry = async () => {
        setLoading(true);
        try {
            const data = await laundryService.getAllLaundry();
            setLaundryItems(data);
        } catch (err: any) {
            setError('Failed to fetch laundry items');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await laundryService.updateLaundryStatus(id, newStatus);
            fetchAllLaundry();
        } catch (err: any) {
            setError('Failed to update status');
        }
    };

    const handleIssueUpdate = async (id: number) => {
        try {
            await laundryService.updateLaundryIssue(id, issueText);
            setEditingIssue(null);
            setIssueText('');
            fetchAllLaundry();
        } catch (err: any) {
            setError('Failed to update issue');
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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getStatusBadge = (status: string) => {
        const statusClass = status.toLowerCase().replace('_', '-');
        return <span className={`status-badge ${statusClass}`}>{status.replace('_', ' ')}</span>;
    };

    const filteredItems = filter === 'ALL'
        ? laundryItems
        : laundryItems.filter(item => item.status === filter);

    // Staff can only set status to PENDING or WASHED
    const staffStatusOptions = ['PENDING', 'WASHED'];

    // All statuses for filtering
    const allStatusOptions = ['PENDING', 'PICKED_UP', 'WASHED', 'DELIVERED'];

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>LaundryLink</h2>
                    <p className="sidebar-subtitle">Staff Portal</p>
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
                        <span>All Laundry</span>
                    </button>
                    <button
                        className={`sidebar-item ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => setActiveTab('students')}
                    >
                        <MdPeople className="sidebar-icon" />
                        <span>Students</span>
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
                        <h1 className="navbar-title">Staff Dashboard</h1>
                        <div className="navbar-user">
                            <MdPerson className="user-icon" />
                            <span className="user-name">Staff</span>
                        </div>
                    </div>
                </nav>

                {/* Dashboard Content */}
                <div className="dashboard-container">
                    {/* Stats Section */}
                    <div className="student-summary">
                        <div className="summary-header">
                            <div>
                                <h2>Overview</h2>
                                <p className="summary-subtitle">Laundry management statistics</p>
                            </div>
                        </div>

                        <div className="summary-stats">
                            <div className="summary-stat-card">
                                <div className="stat-icon total">
                                    <MdLocalLaundryService />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Total Items</p>
                                    <p className="stat-value">{laundryItems.length}</p>
                                </div>
                            </div>
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
                        </div>
                    </div>

                    <div className="dashboard-content">
                        <section className="laundry-section">
                            <h2>Laundry Management</h2>

                            {/* Filter Section */}
                            <div className="filter-search-container">
                                <div className="filter-section">
                                    <button
                                        className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
                                        onClick={() => setFilter('ALL')}
                                    >
                                        All
                                    </button>
                                    {allStatusOptions.map(status => (
                                        <button
                                            key={status}
                                            className={`filter-btn ${filter === status ? 'active' : ''}`}
                                            onClick={() => setFilter(status)}
                                        >
                                            {status.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            {loading ? (
                                <p>Loading...</p>
                            ) : filteredItems.length === 0 ? (
                                <div className="empty-state">
                                    <p>No laundry items found.</p>
                                </div>
                            ) : (
                                <div className="laundry-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Student</th>
                                                <th>Bag #</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Pickup Date</th>
                                                <th>Status</th>
                                                <th>Issue</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td>#{item.id}</td>
                                                    <td>
                                                        <div style={{ fontWeight: 600 }}>{item.student?.name || item.Student?.name || 'N/A'}</div>
                                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                                            {item.student?.gender || item.Student?.gender || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td>{item.bagNumber}</td>
                                                    <td>
                                                        <div className="items-breakdown">
                                                            {item.shirts > 0 && <span className="item-badge">Shirts: {item.shirts}</span>}
                                                            {item.bottoms > 0 && <span className="item-badge">Bottoms: {item.bottoms}</span>}
                                                            {item.towels > 0 && <span className="item-badge">Towels: {item.towels}</span>}
                                                            {item.bedsheets > 0 && <span className="item-badge">Sheets: {item.bedsheets}</span>}
                                                            {item.others > 0 && <span className="item-badge">Others: {item.others}</span>}
                                                        </div>
                                                    </td>
                                                    <td><strong>{item.totalItems}</strong></td>
                                                    <td>{new Date(item.pickupDate).toLocaleDateString()}</td>
                                                    <td>{getStatusBadge(item.status)}</td>
                                                    <td>
                                                        {editingIssue === item.id ? (
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                <input
                                                                    type="text"
                                                                    value={issueText}
                                                                    onChange={(e) => setIssueText(e.target.value)}
                                                                    placeholder="Enter issue..."
                                                                    style={{
                                                                        padding: '6px',
                                                                        borderRadius: '4px',
                                                                        border: '1px solid #e5e5e5',
                                                                        fontSize: '13px',
                                                                        width: '120px'
                                                                    }}
                                                                />
                                                                <button
                                                                    onClick={() => handleIssueUpdate(item.id)}
                                                                    className="btn-create-ticket"
                                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelEdit}
                                                                    className="filter-btn"
                                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                <span style={{
                                                                    color: item.issue ? '#ef4444' : '#666',
                                                                    fontSize: '13px',
                                                                    fontWeight: item.issue ? 600 : 400
                                                                }}>
                                                                    {item.issue || 'No issues'}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleEditIssue(item.id, item.issue)}
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        color: '#999',
                                                                        fontSize: '12px',
                                                                        cursor: 'pointer',
                                                                        textDecoration: 'underline'
                                                                    }}
                                                                >
                                                                    {item.issue ? 'Edit' : 'Add'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <select
                                                            value={item.status}
                                                            onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                                                            className="status-select"
                                                        >
                                                            {staffStatusOptions.map(status => (
                                                                <option key={status} value={status}>
                                                                    {status.replace('_', ' ')}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
