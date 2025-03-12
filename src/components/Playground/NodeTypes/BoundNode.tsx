
import { Handle, Position } from '@xyflow/react';

const BoundNode = ({ data }: { data: { label: string; min?: string; max?: string } }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-teal-500/90 backdrop-blur-sm border border-teal-400 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-teal-400" />
      <div className="flex items-center">
        <span className="text-sm font-medium text-white">{data.label}</span>
      </div>
      {(data.min || data.max) && (
        <div className="text-xs text-white/80 mt-1">
          {data.min && data.max ? `between ${data.min} and ${data.max}` : 
            data.min ? `min: ${data.min}` : `max: ${data.max}`}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-teal-400" />
    </div>
  );
};

export default BoundNode;
