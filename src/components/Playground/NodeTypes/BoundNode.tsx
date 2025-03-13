
import { Handle, Position } from '@xyflow/react';

interface BoundNodeProps {
  data: { 
    label: string; 
    min?: string; 
    max?: string;
    value?: string;
  }
}

const BoundNode = ({ data }: BoundNodeProps) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-teal-500 backdrop-blur-sm border border-teal-400 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-teal-400" />
      <div className="flex items-center gap-1 text-white">
        {data.label === 'Between' ? (
          <>
            <span className="text-sm font-medium">{data.label}</span>
            <span className="bg-white text-teal-500 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
              {data.min || '1'}
            </span>
            <span className="text-sm font-medium">and</span>
            <span className="bg-white text-teal-500 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
              {data.max || '2'}
            </span>
          </>
        ) : data.label === 'Exactly' ? (
          <>
            <span className="text-sm font-medium">{data.label}</span>
            <span className="bg-white text-teal-500 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
              {data.value || '1'}
            </span>
          </>
        ) : (
          <span className="text-sm font-medium">{data.label}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-teal-400" />
    </div>
  );
};

export default BoundNode;
