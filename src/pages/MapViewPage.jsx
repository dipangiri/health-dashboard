import MapComponent from '../components/MapComponent';

function MapViewPage() {
  return (
    // We use a flexbox container to make the component grow to fill the available space
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Full Map View</h2>
      
      {/* The 'flex-grow' class will make this div expand */}
      <div className="flex-grow">
        <MapComponent />
      </div>
    </div>
  );
}

export default MapViewPage;