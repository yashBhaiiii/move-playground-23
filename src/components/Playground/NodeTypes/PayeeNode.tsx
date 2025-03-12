
import { Handle, Position } from '@xyflow/react';

const PayeeNode = ({ data }: { data: { label: string; type?: string } }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-indigo-300 backdrop-blur-sm border border-indigo-200 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-indigo-400" />
      <div className="flex items-center gap-1">
        {data.label === 'Account' ? (
          <>
            <span className="text-sm font-medium text-white bg-blue-500 py-1 px-2 rounded">Account of</span>
            <span className="bg-white text-blue-500 h-6 w-6 flex items-center justify-center rounded-md text-xs font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
          </>
        ) : data.label === 'Party' ? (
          <>
            <span className="text-sm font-medium text-white bg-blue-500 py-1 px-2 rounded">Party</span>
            <span className="bg-white text-blue-500 h-6 w-6 flex items-center justify-center rounded-md text-xs font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
          </>
        ) : (
          <span className="text-sm font-medium text-gray-700">{data.label}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-indigo-400" />
    </div>
  );
};

export default PayeeNode;
