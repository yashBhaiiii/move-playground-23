
import React from 'react';
import NodePropertiesForm from '@/components/Playground/NodePropertiesForm';

interface NodePropertiesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: string;
  nodeLabel: string;
  initialData: any;
  onSubmit: (data: any) => void;
  developerMode?: boolean;
}

export const NodePropertiesDialog = ({ 
  isOpen, 
  onClose, 
  nodeType, 
  nodeLabel, 
  initialData, 
  onSubmit,
  developerMode = false
}: NodePropertiesDialogProps) => {
  if (!isOpen) return null;

  const handleSubmit = (data: any) => {
    onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit {nodeLabel}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <NodePropertiesForm 
          nodeType={nodeType} 
          nodeLabel={nodeLabel} 
          initialData={initialData} 
          onSubmit={handleSubmit}
          developerMode={developerMode}
        />
      </div>
    </div>
  );
};

export default NodePropertiesDialog;
