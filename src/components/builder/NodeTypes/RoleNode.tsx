
import { Handle, Position } from '@xyflow/react';
import NodeWrapper from '../NodeWrapper';

const RoleNodeComponent = ({ data }: { data: { label: string } }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-white/90 backdrop-blur-sm border border-blue-100 transition-all duration-200 hover:shadow-xl">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-blue-400" />
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-blue-400 mr-2" />
        <span className="text-sm font-medium text-gray-700">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-blue-400" />
    </div>
  );
};

// Using NodeWrapper to handle the hover controls
const RoleNode = (props: any) => {
  return (
    <NodeWrapper id={props.id} type={props.type}>
      <RoleNodeComponent {...props} />
    </NodeWrapper>
  );
};

export default RoleNode;
