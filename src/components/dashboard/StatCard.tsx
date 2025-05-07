import React from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  name: string;
  count: number;
  path: string;
  icon: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  name,
  count,
  path,
  icon,
  color,
  textColor,
  bgColor,
  borderColor,
}) => {
  return (
    <Link 
      to={path}
      className={`flex overflow-hidden rounded-xl border ${borderColor} ${bgColor} shadow-soft hover:shadow-hard transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className={`w-2 ${color}`}></div>
      <div className="p-5 w-full">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-lg p-3 ${color} text-white text-2xl`}>
            {icon}
          </div>
          <div className="ml-5 flex-1">
            <h3 className={`text-sm font-medium ${textColor} mb-1`}>{name}</h3>
            <p className="text-3xl font-bold text-soil-900">{count}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StatCard; 