
import { useState } from 'react';
import NodePropertiesDialog from './NodePropertiesDialog';

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
    color: 'bg-rose-300',
    items: ['Role'] 
  },
  { 
    type: 'token', 
    label: 'Token', 
    color: 'bg-red-500',
    items: ['Currency', 'Token ID'] 
  },
  { 
    type: 'bound', 
    label: 'Bounds', 
    color: 'bg-teal-500',
    items: ['Between', 'Exactly'] 
  },
];

interface NodeTemplate {
  label: string;
  type: string;
  description?: string;
  value?: string;
  min?: string;
  max?: string;
  currency?: string;
  tokenName?: string;
  role?: string;
  shape?: string;
  handles?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

// Define the props interface with the onNodeTemplateChange function
interface SidebarProps {
  onNodeTemplateChange?: (type: string, label: string, data: NodeTemplate) => void;
}

const Sidebar = ({ onNodeTemplateChange }: SidebarProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<{ type: string; label: string; } | null>(null);
  const [nodeTemplates, setNodeTemplates] = useState<Record<string, Record<string, NodeTemplate>>>({});

  const toggleCategory = (categoryType: string) => {
    if (expandedCategory === categoryType) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryType);
    }
  };

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    // Get the template for this node type and label if it exists
    const template = nodeTemplates[nodeType]?.[nodeLabel] || { label: nodeLabel, type: nodeType };
    
    // Set individual pieces of data instead of JSON stringifying
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', nodeLabel);
    
    // Add custom properties from the template as serialized JSON
    event.dataTransfer.setData('application/reactflow/template', JSON.stringify(template));
    
    event.dataTransfer.effectAllowed = 'move';
    
    console.log('Drag started:', { nodeType, nodeLabel, template });
  };

  const handleEditNode = (nodeType: string, nodeLabel: string) => {
    setEditingNode({ type: nodeType, label: nodeLabel });
  };

  const handleCloseDialog = () => {
    setEditingNode(null);
  };

  const handleSaveNodeTemplate = (data: NodeTemplate) => {
    if (!editingNode) return;
    
    // Update the node template
    setNodeTemplates(prev => {
      const updatedTemplates = { ...prev };
      if (!updatedTemplates[editingNode.type]) {
        updatedTemplates[editingNode.type] = {};
      }
      updatedTemplates[editingNode.type][editingNode.label] = {
        ...data,
        type: editingNode.type,
        label: data.label || editingNode.label
      };
      return updatedTemplates;
    });
    
    // Call the callback if provided
    if (onNodeTemplateChange && editingNode) {
      onNodeTemplateChange(
        editingNode.type, 
        editingNode.label, 
        { ...data, type: editingNode.type, label: data.label || editingNode.label }
      );
    }
  };

  // Get initial data for the form based on node type and label
  const getInitialNodeData = () => {
    if (!editingNode) return { label: '' };
    
    const savedTemplate = nodeTemplates[editingNode.type]?.[editingNode.label];
    
    // Start with the template or default values
    const initialData: NodeTemplate = savedTemplate || {
      label: editingNode.label,
      type: editingNode.type,
      handles: { top: 1, right: 0, bottom: 1, left: 0 }, // Default handle configuration
      shape: 'rounded-lg' // Default shape
    };
    
    return initialData;
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
                    className="p-2 bg-white rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        draggable
                        onDragStart={(e) => onDragStart(e, category.type, item)}
                        className="flex-1 cursor-move text-sm text-gray-700"
                      >
                        {item}
                      </div>
                      <button
                        onClick={() => handleEditNode(category.type, item)}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {editingNode && (
        <NodePropertiesDialog 
          isOpen={!!editingNode}
          onClose={handleCloseDialog}
          nodeType={editingNode.type}
          nodeLabel={editingNode.label}
          initialData={getInitialNodeData()}
          onSubmit={handleSaveNodeTemplate}
        />
      )}
    </div>
  );
};

export default Sidebar;
