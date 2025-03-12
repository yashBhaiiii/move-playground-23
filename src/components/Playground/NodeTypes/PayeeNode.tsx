
import { Handle, Position } from '@xyflow/react';

const PayeeNode = ({ data }: { data: { label: string; type?: string } }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-indigo-300/90 backdrop-blur-sm border border-indigo-200 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-indigo-400" />
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-indigo-400 mr-2" />
        <span className="text-sm font-medium text-gray-700">{data.label}</span>
      </div>
      {data.type && <div className="text-xs text-gray-500 mt-1">{data.type}</div>}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-indigo-400" />
    </div>
  );
};

export default PayeeNode;
