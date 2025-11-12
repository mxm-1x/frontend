import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>LaundryLink</h1>
                <p className="tagline">Your University Laundry Management System</p>
                <p className="description">
                    Simplifying laundry management for students and staff at Rishihood University
                </p>
            </div>

            <div className="login-options">
                <div className="login-card">
                    <div className="icon">🎓</div>
                    <h3>Student Portal</h3>
                    <p>Track your laundry, request pickups, and monitor delivery status</p>
                    <div className="button-group">
                        <Link to="/student/login" className="btn-primary">Login</Link>
                        <Link to="/student/register" className="btn-secondary">Register</Link>
                    </div>
                </div>

                <div className="login-card">
                    <div className="icon">👔</div>
                    <h3>Staff Portal</h3>
                    <p>Manage laundry operations, update statuses, and track deliveries</p>
                    <div className="button-group">
                        <Link to="/staff/login" className="btn-primary">Login</Link>
                    </div>
                </div>
            </div>

            <div className="features">
                <h2>Features</h2>
                <div className="feature-grid">
                    <div className="feature-item">
                        <span className="feature-icon">📦</span>
                        <h4>Easy Pickup Requests</h4>
                        <p>Submit laundry pickup requests with your bag number</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📊</span>
                        <h4>Track Status</h4>
                        <p>Monitor your laundry status in real-time</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🔔</span>
                        <h4>Get Notifications</h4>
                        <p>Stay updated on pickup and delivery schedules</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">⚡</span>
                        <h4>Fast Service</h4>
                        <p>Quick turnaround times for your laundry</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
