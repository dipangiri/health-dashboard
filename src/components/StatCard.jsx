function StatCard({ title, value, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-gray-500 font-medium">{title}</h4>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-gray-400 text-sm mt-1">{description}</p>
    </div>
  );
}

export default StatCard;