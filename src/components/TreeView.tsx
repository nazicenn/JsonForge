import React, { useState } from 'react';

interface TreeViewProps {
  data: unknown;
  level?: number;
  keyName?: string;
}

export const TreeView: React.FC<TreeViewProps> = ({ data, level = 0, keyName = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const getTypeColor = (value: unknown): string => {
    if (value === null) return '#94a3b8';
    if (typeof value === 'string') return '#4ade80';
    if (typeof value === 'number') return '#60a5fa';
    if (typeof value === 'boolean') return '#f472b6';
    return '#2dd4bf';
  };

  const getTypeIcon = (value: unknown): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return `[${value.length}]`;
    if (typeof value === 'object') return `{${Object.keys(value as object).length}}`;
    return typeof value;
  };

  if (typeof data !== 'object' || data === null) {
    return (
      <div style={{ marginLeft: `${level * 20}px`, padding: '2px 0' }}>
        <span style={{ color: '#2dd4bf', fontSize: '12px' }}>{keyName}</span>
        <span style={{ color: '#94a3b8', margin: '0 4px' }}>:</span>
        <span style={{ color: getTypeColor(data), fontSize: '12px' }}>
          {typeof data === 'string' ? `"${data}"` : String(data)}
        </span>
        <span style={{ color: '#475569', fontSize: '10px', marginLeft: '8px' }}>
          {getTypeIcon(data)}
        </span>
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const items = Object.entries(data as Record<string, unknown>);
  const displayName = keyName || (isArray ? 'root[]' : 'root');

  return (
    <div>
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ 
          marginLeft: `${level * 20}px`, 
          padding: '4px 0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <span style={{ color: '#2dd4bf', fontSize: '12px' }}>
          {isCollapsed ? '▶' : '▼'}
        </span>
        <span style={{ color: '#fbbf24', fontSize: '12px' }}>{displayName}</span>
        <span style={{ color: '#475569', fontSize: '11px' }}>
          {isArray ? `array[${items.length}]` : `object{${items.length}}`}
        </span>
      </div>
      
      {!isCollapsed && (
        <div>
          {items.map(([key, value]) => (
            <TreeView 
              key={key} 
              data={value} 
              level={level + 1} 
              keyName={key}
            />
          ))}
        </div>
      )}
    </div>
  );
};