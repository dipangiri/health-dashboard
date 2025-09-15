import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WaterQualityChart from '../components/WaterQualityChart';

function SensorDetailPage() {
  const { sensorId } = useParams(); // Get sensorId from URL
  const [sensor, setSensor] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch both sensor details and its history at the same time
        const [sensorRes, historyRes] = await Promise.all([
          fetch(`http://localhost:3001/sensors/${sensorId}`),
          fetch(`http://localhost:3001/sensorHistory?sensorId=${sensorId}`)
        ]);
        const sensorData = await sensorRes.json();
        const historyData = await historyRes.json();
        setSensor(sensorData);
        setHistory(historyData);
      } catch (error) {
        console.error("Failed to fetch sensor details:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [sensorId]); // Re-run effect if sensorId changes

  if (loading) return <div>Loading...</div>;
  if (!sensor) return <div>Sensor not found.</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">Sensor Details: {sensor.id}</h2>
      <p className="text-lg text-gray-600">Village: {sensor.village}</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-bold text-gray-600">Status</h4>
          <p className={`text-xl font-bold ${sensor.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
            {sensor.status.toUpperCase()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-bold text-gray-600">Last Reading (pH)</h4>
          <p className="text-xl font-bold text-gray-800">{sensor.readings.ph}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-bold text-gray-600">Last Reading (Turbidity)</h4>
          <p className="text-xl font-bold text-gray-800">{sensor.readings.turbidity} NTU</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-bold text-gray-600">Last Reading (Temp)</h4>
          <p className="text-xl font-bold text-gray-800">{sensor.readings.temperature} °C</p>
        </div>
      </div>

      <div className="mt-6">
        <WaterQualityChart data={history} title={`Historical Data for ${sensor.id}`} />
      </div>
    </div>
  );
}

export default SensorDetailPage;