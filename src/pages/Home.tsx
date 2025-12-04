import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './Home.css';

const Home: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <div className="logo">
                    LaundryLink <span className="logo-dot">.</span>
                </div>
                <nav className="home-nav">
                    <Link to="/student/login" className="nav-link">Student Portal</Link>
                    <Link to="/staff/login" className="nav-link">Staff Portal</Link>
                </nav>
                <div className="header-actions">
                    <Link to="/student/login" className="btn btn-outline-header">Log In</Link>
                    <Link to="/student/register" className="btn btn-primary-header">Get Started</Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
                <div className="hero-content">
                    <h1 className="hero-title">
                        Smart Laundry, <br />
                        Made Simple for <br />
                        Campus Life.
                    </h1>
                    <p className="hero-subtitle">
                        Streamlined tracking for Rishihood University.
                    </p>

                    <div className="hero-cta-group">
                        <Link to="/student/register" className="btn btn-black">
                            Get Started
                        </Link>
                        <Link to="/staff/login" className="btn btn-white">
                            Staff Access
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Plans / Features Section */}
            <section className="features-section">
                <div className="features-header">
                    <h2 className="section-title">Key Features</h2>
                    <Link to="/student/register" className="explore-link">Explore All</Link>
                </div>

                <div className="features-grid">
                    {/* Card 1: Green - Student Tracking */}
                    <div className="feature-card card-green">
                        <div className="card-label">STUDENT</div>
                        <h3>Real-time Tracking</h3>
                        <p>Monitor your laundry status from pickup to delivery with instant updates.</p>

                        <div className="card-footer">
                            <div className="stat">
                                <span className="stat-label">Uptime</span>
                                <span className="stat-value">99.9%</span>
                            </div>
                            <div className="card-icon-btn">
                                <FaArrowRight />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Black/Dark - Staff Management */}
                    <div className="feature-card card-dark">
                        <div className="card-label">STAFF</div>
                        <h3>Efficient Management</h3>
                        <p>Streamline operations with a dedicated dashboard for all laundry requests.</p>

                        <div className="card-footer">
                            <div className="stat">
                                <span className="stat-label">Efficiency</span>
                                <span className="stat-value">100%</span>
                            </div>
                            <div className="card-icon-btn light">
                                <FaArrowRight />
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Purple - Notifications */}
                    <div className="feature-card card-purple">
                        <div className="card-label">ALERTS</div>
                        <h3>Smart Notifications</h3>
                        <p>Get notified immediately when your laundry is ready for pickup.</p>

                        <div className="card-footer">
                            <div className="stat">
                                <span className="stat-label">Speed</span>
                                <span className="stat-value">Instant</span>
                            </div>
                            <div className="card-icon-btn">
                                <FaArrowRight />
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Yellow - Security */}
                    <div className="feature-card card-yellow">
                        <div className="card-label">SECURE</div>
                        <h3>Secure & Reliable</h3>
                        <p>Your clothes are handled with care and tracked securely at every step.</p>

                        <div className="card-footer">
                            <div className="stat">
                                <span className="stat-label">Trust</span>
                                <span className="stat-value">Top Rated</span>
                            </div>
                            <div className="card-icon-btn">
                                <FaArrowRight />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="home-footer">
                <div className="footer-content">
                    <span className="footer-text">© 2024 LaundryLink. All rights reserved.</span>
                    <span className="footer-dot">•</span>
                    <span className="footer-text">Rishihood University</span>
                </div>
                <div className="footer-icon">
                    <FaArrowRight />
                </div>
            </footer>
        </div>
    );
};

export default Home;
