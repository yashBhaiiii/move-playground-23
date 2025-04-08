
import { Handle, Position } from '@xyflow/react';
import NodeWrapper from '../NodeWrapper';

interface ActionNodeProps {
  data: { 
    label: string; 
    type: string;
    description?: string;
  };
  id: string;
  type: string;
}

const ActionNodeComponent = ({ data }: { data: ActionNodeProps['data'] }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-white/90 backdrop-blur-sm border border-green-100 transition-transform duration-200 hover:shadow-xl">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-green-400" />
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-green-400 mr-2" />
        <span className="text-sm font-medium text-gray-700">{data.label}</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">{data.description || data.type}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-green-400" />
    </div>
  );
};

// Using NodeWrapper to handle the hover controls
const ActionNode = (props: ActionNodeProps) => {
  return (
    <NodeWrapper id={props.id} type={props.type}>
      <ActionNodeComponent data={props.data} />
    </NodeWrapper>
  );
};

export default ActionNode;
