import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import SensorDetailPage from './pages/SensorDetailPage';
import MapViewPage from './pages/MapViewPage';
import SettingsPage from './pages/SettingsPage';

// An Outlet is a placeholder for where the page content will be rendered
import { Outlet } from 'react-router-dom';

function App() {
  const location = useLocation();

  const getHeaderTitle = (pathname) => {
    switch (true) {
      case pathname === '/':
        return 'Dashboard Overview';
      case pathname === '/alerts':
        return 'Alerts';
      case pathname === '/map-view':
        return 'Map View';
      case pathname === '/settings':
        return 'Settings';
      case pathname.startsWith('/sensors/'):
        return 'Sensor Details';
      default:
        return 'Dashboard';
    }
  };
  const headerTitle = getHeaderTitle(location.pathname);
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5 flex flex-col">
        <h1 className="text-2xl font-bold">Health Dashboard</h1>
        <nav className="mt-10">
          {/* Use NavLink for active styling */}
          <NavLink to="/" className={({ isActive }) => isActive ? "block py-2.5 px-4 rounded bg-gray-700" : "block py-2.5 px-4 rounded hover:bg-gray-700"}>Dashboard</NavLink>
          <NavLink to="/alerts" className={({ isActive }) => isActive ? "block py-2.5 px-4 rounded bg-gray-700" : "block py-2.5 px-4 rounded hover:bg-gray-700"}>Alerts</NavLink>
          <NavLink to="/map-view" className={({ isActive }) => isActive ? "block py-2.5 px-4 rounded bg-gray-700" : "block py-2.5 px-4 rounded hover:bg-gray-700"}>Map View</NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "block py-2.5 px-4 rounded bg-gray-700" : "block py-2.5 px-4 rounded hover:bg-gray-700"}>Settings</NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow p-4">
          {/* This header could be dynamic later */}
          <h2 className="text-xl font-semibold text-gray-800">{headerTitle}</h2>
        </header>
        <main className="flex flex-col flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/sensors/:sensorId" element={<SensorDetailPage />} />
            <Route path="/map-view" element={<MapViewPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;