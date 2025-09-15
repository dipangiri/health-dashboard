import React, { useState, useEffect } from 'react';
import DashboardOverview from '../components/DashboardOverview';
import MapComponent from '../components/MapComponent';
import WaterQualityChart from '../components/WaterQualityChart';
import AlertsTable from '../components/AlertsTable';

function DashboardPage() {
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [sensors, setSensors] = useState([]); // 1. New state to hold the list of all sensors
  const [selectedSensorId, setSelectedSensorId] = useState(''); // 2. New state for the selected sensor ID

  // This useEffect now fetches the list of all sensors
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('http://localhost:3001/alerts');
        const data = await response.json();
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRecentAlerts(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    const fetchSensors = async () => {
      try {
        const response = await fetch('http://localhost:3001/sensors');
        const sensorsData = await response.json();
        setSensors(sensorsData);
        // 3. Set the default selected sensor to the first one in the list
        if (sensorsData.length > 0) {
          setSelectedSensorId(sensorsData[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch sensors:", error);
      }
    };

    fetchAlerts();
    fetchSensors();
  }, []); // This effect runs once on component mount

  // 4. A new useEffect that runs ONLY when the selectedSensorId changes
  useEffect(() => {
    // Don't fetch if no sensor is selected yet
    if (!selectedSensorId) return;

    const fetchChartData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/sensorHistory?sensorId=${selectedSensorId}`);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        setChartData([]); // Clear data on error
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, [selectedSensorId]); // Dependency array ensures this runs when selectedSensorId changes

  return (
    <>
      <DashboardOverview />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Live Sensor & Health Report Map</h3>
          <MapComponent />
        </div>
        <div>
          {/* 5. Add the sensor selection dropdown */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Water Quality Trends</h3>
            <select
              value={selectedSensorId}
              onChange={(e) => setSelectedSensorId(e.target.value)}
              className="block w-48 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            >
              {sensors.map(sensor => (
                <option key={sensor.id} value={sensor.id}>
                  {sensor.id} - ({sensor.village})
                </option>
              ))}
            </select>
          </div>
          <WaterQualityChart 
            data={chartData} 
            title={`Historical Data for ${selectedSensorId}`} 
          />
        </div>
      </div>

      <div className="mt-6">
        <AlertsTable alerts={recentAlerts} title="Recent Alerts" />
      </div>
    </>
  );
}

export default DashboardPage;