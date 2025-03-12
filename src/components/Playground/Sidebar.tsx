
import { useState } from 'react';

const nodeTypes = [
  { type: 'role', label: 'Role', items: ['Buyer', 'Seller'] },
  { type: 'action', label: 'Action', items: ['Deposit', 'Pay', 'Close', 'Choice'] },
];

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label: nodeLabel }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Components</h2>
      <div className="space-y-4">
        {nodeTypes.map((category) => (
          <div key={category.type} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">{category.label}</h3>
            <div className="grid gap-2">
              {category.items.map((item) => (
                <div
                  key={item}
                  draggable
                  onDragStart={(e) => onDragStart(e, category.type, item)}
                  className="p-2 bg-white rounded-md shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-shadow duration-200"
                >
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
