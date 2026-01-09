const ProgressBar = ({ value, color = 'blue', label, showLabel = true }) => {
  const colorMap = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600'
  };
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${colorMap[color]}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-600 w-12 text-right">
          {label || `${value}%`}
        </span>
      )}
    </div>
  );
};
export default ProgressBar;