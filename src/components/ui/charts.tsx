'use client';

import React from 'react';

// Simple chart components using CSS and SVG
// In a real application, you might use libraries like Chart.js, Recharts, or D3.js

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  label: string;
  value: number;
  date: string;
}

interface BarChartProps {
  data: ChartData[];
  title: string;
  height?: number;
  showValues?: boolean;
}

export function BarChart({ data, title, height = 200, showValues = true }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{item.label}</span>
                {showValues && (
                  <span className="text-gray-500 font-medium">{item.value.toLocaleString('tr-TR')}</span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color || `hsl(${(index * 60) % 360}, 70%, 50%)`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: LineChartData[];
  title: string;
  height?: number;
  color?: string;
}

export function LineChart({ data, title, height = 200, color = '#3b82f6' }: LineChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = range > 0 ? 100 - ((item.value - minValue) / range) * 100 : 50;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="relative" style={{ height }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Line chart */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = range > 0 ? 100 - ((item.value - minValue) / range) * 100 : 50;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill={color}
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index} className="transform -rotate-45 origin-left">
              {new Date(item.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface PieChartProps {
  data: ChartData[];
  title: string;
  size?: number;
}

export function PieChart({ data, title, size = 200 }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return {
      ...item,
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
      percentage: percentage.toFixed(1),
      color: item.color || `hsl(${(index * 60) % 360}, 70%, 50%)`
    };
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center space-x-6">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="transform -rotate-90"
          >
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.path}
                fill={segment.color}
                stroke="white"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
        
        <div className="flex-1 space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-700">{segment.label}</span>
              <span className="text-sm text-gray-500 font-medium">
                {segment.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function StatCard({ title, value, change, changeLabel, icon, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    purple: 'text-purple-500'
  };

  const changeColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const getChangeColor = () => {
    if (!change) return changeColorClasses.neutral;
    return change > 0 ? changeColorClasses.positive : changeColorClasses.negative;
  };

  const getChangeIcon = () => {
    if (!change) return null;
    return change > 0 ? '↗' : '↘';
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          {icon && (
            <div className={`flex-shrink-0 ${colorClasses[color]}`}>
              {icon}
            </div>
          )}
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">
                {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
              </dd>
            </dl>
          </div>
        </div>
        {change !== undefined && (
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {getChangeIcon()} {Math.abs(change)}%
            </span>
            {changeLabel && (
              <span className="ml-2 text-sm text-gray-500">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface MetricGridProps {
  children: React.ReactNode;
}

export function MetricGrid({ children }: MetricGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

interface ChartGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
}

export function ChartGrid({ children, cols = 2 }: ChartGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-3'
  };

  return (
    <div className={`grid gap-6 ${gridCols[cols]}`}>
      {children}
    </div>
  );
} 