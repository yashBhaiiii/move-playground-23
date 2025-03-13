
import { Handle, Position } from '@xyflow/react';

interface ValueNodeProps {
  data: { 
    label: string; 
    type?: string;
    value?: string;
  }
}

const ValueNode = ({ data }: ValueNodeProps) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-pink-500/90 backdrop-blur-sm border border-pink-400 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-pink-400" />
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-pink-300 mr-2" />
        <span className="text-sm font-medium text-white">{data.label}</span>
      </div>
      {data.type && <div className="text-xs text-white/80 mt-1">{data.type}</div>}
      {data.value && (
        <div className="text-xs bg-white/20 text-white mt-1 py-1 px-2 rounded">
          Value: {data.value}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-pink-400" />
    </div>
  );
};

export default ValueNode;
