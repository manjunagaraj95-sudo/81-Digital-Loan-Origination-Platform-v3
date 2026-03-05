
import React, { useState, useEffect } from 'react';

const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  VIEWER: 'VIEWER'
};

const USER_PERMISSIONS = {
  ADMIN: {
    canView: ['DASHBOARD', 'PRODUCTS', 'ORDERS', 'SETTINGS', 'USERS'],
    canEdit: ['PRODUCTS', 'ORDERS', 'USERS'],
    canDelete: ['PRODUCTS', 'ORDERS', 'USERS']
  },
  USER: {
    canView: ['DASHBOARD', 'PRODUCTS', 'ORDERS'],
    canEdit: ['ORDERS'],
    canDelete: []
  },
  VIEWER: {
    canView: ['DASHBOARD', 'PRODUCTS'],
    canEdit: [],
    canDelete: []
  }
};

const MOCK_AUTH_USER = {
  id: 'user-123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: ROLES.ADMIN, // Set to ADMIN for full access in prototype
};

const App = () => {
  const [user, setUser] = useState(MOCK_AUTH_USER);
  const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For prototype, start authenticated
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // State for mobile sidebar

  const canAccess = (screen, action = 'canView') => {
    if (!user || !user.role) return false;
    const permissions = USER_PERMISSIONS[user.role];
    return permissions?.[action]?.includes(screen) || false;
  };

  useEffect(() => {
    // Simulate auth check on mount
    if (!isAuthenticated) {
      setView({ screen: 'LOGIN', params: {} });
    }
  }, [isAuthenticated]);

  const handleLogin = (credentials) => {
    // In a real app, this would involve API calls
    console.log('Attempting login with:', credentials);
    setIsAuthenticated(true);
    setUser(MOCK_AUTH_USER); // Assume successful login for prototype
    setView({ screen: 'DASHBOARD', params: {} });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setView({ screen: 'LOGIN', params: {} });
    setIsMobileSidebarOpen(false); // Close sidebar on logout
  };

  const handleNavClick = (screenName, params = {}) => {
    if (canAccess(screenName)) {
      setView({ screen: screenName, params });
      setIsMobileSidebarOpen(false); // Close sidebar after navigation on mobile
    } else {
      alert(`Access Denied: You do not have permission to view ${screenName}.`);
    }
  };

  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  // --- Mock Data for Dashboard ---
  const keyMetrics = [
    { title: 'Total Revenue', value: '$124,567', trend: '+12% vs last month', icon: '💰' },
    { title: 'New Orders', value: '1,234', trend: '+8% vs last month', icon: '📦' },
    { title: 'Active Users', value: '876', trend: '+5% vs last month', icon: '👤' },
    { title: 'Conversion Rate', value: '3.4%', trend: '-0.2% vs last month', icon: '📈' },
  ];

  const recentTransactions = [
    { id: 'T001', item: 'Product A', amount: '$49.99', status: 'Completed', date: '2023-10-26' },
    { id: 'T002', item: 'Service B', amount: '$199.00', status: 'Pending', date: '2023-10-25' },
    { id: 'T003', item: 'Product C', amount: '$12.50', status: 'Completed', date: '2023-10-25' },
    { id: 'T004', item: 'Product D', amount: '$24.99', status: 'Shipped', date: '2023-10-24' },
    { id: 'T005', item: 'Service E', amount: '$50.00', status: 'Cancelled', date: '2023-10-23' },
  ];

  // --- Utility Components (Simplified for prototype) ---
  const Card = ({ children, className = '' }) => (
    <div className={`card ${className}`}>
      {children}
    </div>
  );

  const Table = ({ data, columns }) => (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns?.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data?.map(row => (
            <tr key={row.id}>
              {Object.keys(row).filter(key => key !== 'id').map(key => (
                <td key={`${row.id}-${key}`}>
                  {key === 'status' ? (
                    <span className={`status-badge ${row[key].toLowerCase()}`}>
                      {row[key]}
                    </span>
                  ) : (
                    row[key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // --- Screen Components ---
  const DashboardScreen = () => (
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-main)' }}>Dashboard Overview</h1>

      <div className="dashboard-grid">
        {/* Key Metrics */}
        <div className="metric-cards-container">
          {keyMetrics?.map((metric, index) => (
            <Card key={`metric-${index}`} className="metric-card">
              <span className="metric-icon">{metric.icon}</span>
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--text-secondary)' }}>{metric.title}</h3>
                <p className="metric-value">{metric.value}</p>
                <p className={`metric-trend ${metric.trend.includes('-') ? 'negative' : 'positive'}`}>{metric.trend}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Sales Overview Chart (simple representation) */}
        <Card className="sales-overview-card">
          <h2 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-main)' }}>Sales Overview (Q4)</h2>
          <div className="sales-chart">
            <div className="chart-bar" style={{ height: '70%', backgroundColor: 'var(--primary-color)' }} title="October Sales"></div>
            <div className="chart-bar" style={{ height: '85%', backgroundColor: 'var(--secondary-color)' }} title="November Sales"></div>
            <div className="chart-bar" style={{ height: '60%', backgroundColor: 'var(--accent-color)' }} title="December Sales"></div>
            <div className="chart-bar" style={{ height: '95%', backgroundColor: 'var(--primary-hover)' }} title="Q4 Target"></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
            <span>Target</span>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="recent-transactions-card">
          <h2 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-main)' }}>Recent Transactions</h2>
          <Table data={recentTransactions} columns={['Item', 'Amount', 'Status', 'Date']} />
        </Card>
      </div>
    </div>
  );

  const ProductsScreen = ({ params }) => (
    <div className="content-placeholder">
      <h1 style={{ color: 'var(--text-main)' }}>Products {params?.id ? `(ID: ${params.id})` : ''}</h1>
      <p style={{ color: 'var(--text-secondary)' }}>View and manage your product catalog.</p>
    </div>
  );

  const OrdersScreen = () => (
    <div className="content-placeholder">
      <h1 style={{ color: 'var(--text-main)' }}>Orders</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Manage customer orders.</p>
    </div>
  );

  const UsersScreen = () => (
    <div className="content-placeholder">
      <h1 style={{ color: 'var(--text-main)' }}>Users</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Administer user accounts and roles.</p>
    </div>
  );

  const SettingsScreen = () => (
    <div className="content-placeholder">
      <h1 style={{ color: 'var(--text-main)' }}>Settings</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Configure application settings.</p>
    </div>
  );

  const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin({ username, password });
    };

    return (
      <div className="login-container">
        <Card className="login-form-card">
          <form onSubmit={handleSubmit} className="login-form">
            <h1>Login to Dashboard</h1>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </Card>
      </div>
    );
  };

  const renderScreen = () => {
    switch (view.screen) {
      case 'DASHBOARD':
        return <DashboardScreen />;
      case 'PRODUCTS':
        return <ProductsScreen params={view.params} />;
      case 'ORDERS':
        return <OrdersScreen />;
      case 'SETTINGS':
        return <SettingsScreen />;
      case 'USERS':
        return <UsersScreen />;
      case 'LOGIN':
        return <LoginScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="app-container">
      {isMobileSidebarOpen && <div className="overlay" onClick={handleToggleMobileSidebar}></div>}
      <div className={`sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div>
          <div className="sidebar-header">
            Ocean View HQ
          </div>
          <ul className="nav-menu">
            {canAccess('DASHBOARD') && (
              <li className="nav-item">
                <button
                  onClick={() => handleNavClick('DASHBOARD')}
                  className={`nav-button ${view.screen === 'DASHBOARD' ? 'active' : ''}`}
                >
                  <span className="nav-button-icon">📊</span> Dashboard
                </button>
              </li>
            )}
            {canAccess('PRODUCTS') && (
              <li className="nav-item">
                <button
                  onClick={() => handleNavClick('PRODUCTS')}
                  className={`nav-button ${view.screen === 'PRODUCTS' ? 'active' : ''}`}
                >
                  <span className="nav-button-icon">📦</span> Products
                </button>
              </li>
            )}
            {canAccess('ORDERS') && (
              <li className="nav-item">
                <button
                  onClick={() => handleNavClick('ORDERS')}
                  className={`nav-button ${view.screen === 'ORDERS' ? 'active' : ''}`}
                >
                  <span className="nav-button-icon">📋</span> Orders
                </button>
              </li>
            )}
            {canAccess('USERS') && (
              <li className="nav-item">
                <button
                  onClick={() => handleNavClick('USERS')}
                  className={`nav-button ${view.screen === 'USERS' ? 'active' : ''}`}
                >
                  <span className="nav-button-icon">👥</span> Users
                </button>
              </li>
            )}
            {canAccess('SETTINGS') && (
              <li className="nav-item">
                <button
                  onClick={() => handleNavClick('SETTINGS')}
                  className={`nav-button ${view.screen === 'SETTINGS' ? 'active' : ''}`}
                >
                  <span className="nav-button-icon">⚙️</span> Settings
                </button>
              </li>
            )}
          </ul>
        </div>
        <div className="sidebar-footer">
          {user?.name && <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Logged in as {user.name} ({user.role})</p>}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="main-content">
        <div className="header">
          <button className="sidebar-toggle-button" onClick={handleToggleMobileSidebar}>
            ☰
          </button>
          <h2 style={{ color: 'var(--text-main)' }}>{view.screen.charAt(0) + view.screen.slice(1).toLowerCase()}</h2>
          {user && (
            <div className="user-info">
              <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span style={{ color: 'var(--text-secondary)' }}>{user.name}</span>
            </div>
          )}
        </div>
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;