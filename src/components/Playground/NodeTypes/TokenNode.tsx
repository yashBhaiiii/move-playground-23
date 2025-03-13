
import { Handle, Position } from '@xyflow/react';

interface TokenNodeProps {
  data: { 
    label: string; 
    currency?: string; 
    tokenName?: string;
  }
}

const TokenNode = ({ data }: TokenNodeProps) => {
  // Custom label for display
  const getDisplayContent = () => {
    if (data.label === 'Currency') {
      return (
        <span className="text-sm font-medium text-white bg-red-500 py-1 px-2 rounded">
          {data.currency || 'lovelace'}
        </span>
      );
    } else if (data.label === 'Token ID') {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-white bg-red-500 py-1 px-2 rounded">Token with currency</span>
          <div className="flex items-center gap-1">
            <span className="bg-white text-red-500 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">$</span>
            <span className="text-sm font-medium text-white">{data.currency || 'currency'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-white">and token name</span>
            <span className="bg-white text-red-500 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">T</span>
            <span className="text-sm font-medium text-white">{data.tokenName || 'token'}</span>
          </div>
        </div>
      );
    }
    return <span className="text-sm font-medium text-white">{data.label}</span>;
  };

  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-red-500 backdrop-blur-sm border border-red-400 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-red-400" />
      <div className="flex items-center">
        {getDisplayContent()}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-red-400" />
    </div>
  );
};

export default TokenNode;
