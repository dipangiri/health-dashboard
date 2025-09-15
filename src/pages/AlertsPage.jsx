import { useState, useEffect } from 'react';
import AlertsTable from '../components/AlertsTable';

function AlertsPage() {
  const [allAlerts, setAllAlerts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('http://localhost:3001/alerts');
        const data = await response.json();
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAllAlerts(data);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };
    fetchAlerts();
  }, []);

  const handleAcknowledge = async (alertId) => {
    try {
      const response = await fetch(`http://localhost:3001/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acknowledged: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to acknowledge the alert.');
      }

      setAllAlerts(currentAlerts =>
        currentAlerts.map(alert =>
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        )
      );
    } catch (error) {
      console.error("Acknowledge error:", error);
    }
  };

  const filteredAlerts = allAlerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.level === filter;
  });

  const getButtonClass = (level) => {
    return filter === level 
      ? 'px-4 py-2 text-sm font-medium text-white bg-gray-600 border-gray-600 rounded-md focus:outline-none'
      : 'px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none';
  };

  return (
    <div>
      {/* Filtering Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Alert History</h2>
        <div className="flex space-x-2">
          <button onClick={() => setFilter('all')} className={getButtonClass('all')}>All</button>
          <button onClick={() => setFilter('critical')} className={getButtonClass('critical')}>Critical</button>
          <button onClick={() => setFilter('warning')} className={getButtonClass('warning')}>Warning</button>
          <button onClick={() => setFilter('info')} className={getButtonClass('info')}>Info</button>
        </div>
      </div>

      {/* Reusable AlertsTable Component */}
      <AlertsTable 
        alerts={filteredAlerts} 
        title="All Alerts"
        onAcknowledge={handleAcknowledge} 
      />
    </div>
  );
}

export default AlertsPage;