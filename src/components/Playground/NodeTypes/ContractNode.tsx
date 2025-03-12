
import { Handle, Position } from '@xyflow/react';

const ContractNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-purple-500/90 backdrop-blur-sm border border-purple-400 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-purple-400" />
      <div className="flex items-center">
        <span className="text-sm font-medium text-white">{data.label || 'CONTRACT'}</span>
      </div>
      <div className="my-2 text-xs text-white/80">
        {data.description || 'Define smart contract structure'}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-purple-400" />
    </div>
  );
};

export default ContractNode;
