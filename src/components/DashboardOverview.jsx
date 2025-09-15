import { useState, useEffect } from 'react';
import StatCard from './StatCard';

function DashboardOverview() {
  const [stats, setStats] = useState({
    sensorsOnline: 0,
    totalSensors: 0,
    activeAlerts: 0,
    healthReports: 0,
  });

  useEffect(() => {
    // Fetch data from all endpoints
    const fetchData = async () => {
      try {
        const [sensorsRes, alertsRes, reportsRes] = await Promise.all([
          fetch('http://localhost:3001/sensors'),
          fetch('http://localhost:3001/alerts'),
          fetch('http://localhost:3001/healthReports')
        ]);

        const sensors = await sensorsRes.json();
        const alerts = await alertsRes.json();
        const reports = await reportsRes.json();

        // Calculate stats
        const online = sensors.filter(s => s.status === 'online').length;

        setStats({
          sensorsOnline: online,
          totalSensors: sensors.length,
          activeAlerts: alerts.length,
          healthReports: reports.length,
        });

      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Sensors Online" 
        value={`${stats.sensorsOnline} / ${stats.totalSensors}`}
        description="All active water quality sensors"
      />
      <StatCard 
        title="Active Alerts" 
        value={stats.activeAlerts}
        description="High-priority warnings"
      />
      <StatCard 
        title="Health Reports Today" 
        value={stats.healthReports}
        description="New symptom reports"
      />
      <StatCard 
        title="Water Quality Index" 
        value="82"
        description="Average score: Good"
      />
    </div>
  );
}

export default DashboardOverview;