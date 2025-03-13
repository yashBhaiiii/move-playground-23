
import { Handle, Position } from '@xyflow/react';

interface PartyNodeProps {
  data: { 
    label: string; 
    type?: string;
    role?: string;
  }
}

const PartyNode = ({ data }: PartyNodeProps) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-rose-300 backdrop-blur-sm border border-rose-200 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-rose-400" />
      <div className="flex items-center gap-1">
        {data.label === 'Role' ? (
          <>
            <span className="text-sm font-medium text-white bg-rose-500 py-1 px-2 rounded">Role</span>
            <span className="text-sm font-medium text-gray-700">{data.role || 'role'}</span>
          </>
        ) : (
          <span className="text-sm font-medium text-gray-700">{data.label}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-rose-400" />
    </div>
  );
};

export default PartyNode;
