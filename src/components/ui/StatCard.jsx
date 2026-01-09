import React from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import Card from "./Card";

const StatCard = ({ title, value, change, changeLabel, icon, trend = 'up', color = 'blue' }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const trendBg = trend === 'up' ? 'bg-green-50' : trend === 'down' ? 'bg-red-50' : 'bg-gray-50';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;
  
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };
  
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          {change && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendColor} ${trendBg}`}>
              <TrendIcon className="w-3 h-3" />
              {change} {changeLabel && <span className="text-gray-500">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;