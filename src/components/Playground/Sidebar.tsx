
import { useState } from 'react';

const nodeCategories = [
  { 
    type: 'contract', 
    label: 'Contracts', 
    color: 'bg-purple-500',
    items: ['Contract', 'When', 'Pay', 'If observation', 'Let', 'Assert', 'Close'] 
  },
  { 
    type: 'observation', 
    label: 'Observations', 
    color: 'bg-cyan-500',
    items: ['And', 'Or', 'Not', 'Party made choice', 'Value >=', 'Value >', 'Value <', 'Value <=', 'Value ==', 'True', 'False'] 
  },
  { 
    type: 'action', 
    label: 'Actions', 
    color: 'bg-amber-500',
    items: ['Deposit', 'Choice', 'Notification'] 
  },
  { 
    type: 'value', 
    label: 'Values', 
    color: 'bg-pink-500',
    items: ['Available currency', 'Constant', 'ConstantParam', 'Use value'] 
  },
  { 
    type: 'payee', 
    label: 'Payee', 
    color: 'bg-indigo-300',
    items: ['Account', 'Party'] 
  },
  { 
    type: 'party', 
    label: 'Party', 
    color: 'bg-violet-300',
    items: ['Role'] 
  },
  { 
    type: 'token', 
    label: 'Token', 
    color: 'bg-orange-500',
    items: ['Currency', 'Token ID'] 
  },
  { 
    type: 'bound', 
    label: 'Bounds', 
    color: 'bg-teal-500',
    items: ['Between', 'Exactly'] 
  },
];

const Sidebar = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryType: string) => {
    if (expandedCategory === categoryType) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryType);
    }
  };

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    // Set individual pieces of data instead of JSON stringifying
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', nodeLabel);
    event.dataTransfer.effectAllowed = 'move';
    
    console.log('Drag started:', { nodeType, nodeLabel });
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-4 border-b border-gray-100 shadow-sm z-10">
        <h2 className="text-lg font-semibold text-gray-700">Components</h2>
      </div>
      <div className="p-4">
        {nodeCategories.map((category) => (
          <div key={category.type} className="mb-3">
            <button
              onClick={() => toggleCategory(category.type)}
              className={`w-full flex items-center p-2 rounded-md ${category.color} text-white text-left`}
            >
              <span className="font-medium">{category.label}</span>
              <span className="ml-auto">
                {expandedCategory === category.type ? '−' : '+'}
              </span>
            </button>
            {expandedCategory === category.type && (
              <div className="grid gap-2 mt-2">
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
