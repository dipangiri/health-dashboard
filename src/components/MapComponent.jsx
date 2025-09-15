import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Link } from 'react-router-dom'; 

function MapComponent() {
  const [sensors, setSensors] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sensorsRes, reportsRes] = await Promise.all([
          fetch('http://localhost:3001/sensors'),
          fetch('http://localhost:3001/healthReports')
        ]);
        const sensorsData = await sensorsRes.json();
        const reportsData = await reportsRes.json();
        setSensors(sensorsData);
        setReports(reportsData);
      } catch (error) {
        console.error("Failed to fetch map data:", error);
      }
    };

    fetchData();
  }, []);

  // Find the location of the report by matching village names
  const getReportLocation = (village) => {
    const sensorInVillage = sensors.find(s => s.village === village);
    return sensorInVillage ? sensorInVillage.location : null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-96">
      <MapContainer center={[26.0, 92.9]} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render sensor markers */}
        {sensors.map(sensor => (
          <Marker key={sensor.id} position={[sensor.location.lat, sensor.location.lng]}>
            <Popup>
              <b>Sensor ID:</b> {sensor.id}<br />
              <b>Village:</b> {sensor.village}<br />
              <b>Status:</b> <span className={sensor.status === 'online' ? 'text-green-600' : 'text-red-600'}>{sensor.status}</span><br/>
              <b>Temperature:</b> {sensor.readings.temperature} °C<br/>
              <Link to={`/sensors/${sensor.id}`} className="text-blue-600 hover:underline">
                View Details
              </Link>
            </Popup>
          </Marker>
        ))}

        {/* Render health report circles (hotspots) */}
        {reports.map(report => {
          const location = getReportLocation(report.village);
          if (!location) return null; // Don't render if we can't find a location

          return (
            <Circle
              key={report.id}
              center={[location.lat, location.lng]}
              pathOptions={{ color: 'red', fillColor: 'red' }}
              radius={report.cases * 1000} // Radius in meters, scaled by number of cases
            >
              <Popup>
                <b>Health Alert!</b><br />
                <b>Village:</b> {report.village}<br />
                <b>Cases Reported:</b> {report.cases}<br />
                <b>Symptoms:</b> {report.symptoms.join(', ')}
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapComponent;