const AlertLevelBadge = ({ level }) => {
  const levelStyles = {
    critical: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };
  const style = levelStyles[level] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${style}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

// The main component now accepts 'alerts' as a prop
function AlertsTable({ alerts, title }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
         <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
         <p className="text-gray-500">No alerts to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Timestamp</th>
              <th scope="col" className="px-6 py-3">Message</th>
              <th scope="col" className="px-6 py-3">Level</th>
              <th scope="col" className="px-6 py-3">Actions</th> {/* 2. Add Actions header */}
            </tr>
          </thead>
          <tbody>
            {alerts.map(alert => (
              // 3. Add a class to gray out acknowledged alerts
              <tr key={alert.id} className={`bg-white border-b hover:bg-gray-50 ${alert.acknowledged ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4">{new Date(alert.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4">{alert.message}</td>
                <td className="px-6 py-4"><AlertLevelBadge level={alert.level} /></td>
                <td className="px-6 py-4">
                  {/* 4. Conditionally render the button or a confirmation message */}
                  {alert.acknowledged ? (
                    <span className="flex items-center text-green-600 font-semibold">
                      Acknowledged
                    </span>
                  ) : (
                    <button 
                      onClick={() => onAcknowledge(alert.id)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Acknowledge
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlertsTable;