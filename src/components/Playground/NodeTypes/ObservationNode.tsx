
import { Handle, Position } from '@xyflow/react';

const ObservationNode = ({ data }: { data: { label: string; type?: string } }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-cyan-500/90 backdrop-blur-sm border border-cyan-400 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-cyan-400" />
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-cyan-300 mr-2" />
        <span className="text-sm font-medium text-white">{data.label}</span>
      </div>
      {data.type && <div className="text-xs text-white/80 mt-1">{data.type}</div>}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-cyan-400" />
    </div>
  );
};

export default ObservationNode;
