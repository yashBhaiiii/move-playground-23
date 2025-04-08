
import { Handle, Position } from '@xyflow/react';
import NodeWrapper from '../NodeWrapper';

interface ContractNodeProps {
  data: { 
    label: string; 
    description?: string;
    shape?: string;
    handles?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  };
  id: string;
  type: string;
}

const ContractNodeComponent = ({ data }: { data: ContractNodeProps['data'] }) => {
  // Determine shape class based on data.shape or default to rounded-lg
  const shapeClass = data.shape || 'rounded-lg';
  const baseClass = "px-4 py-2 shadow-lg bg-purple-500/90 backdrop-blur-sm border border-purple-400 min-w-[150px]";
  
  // Special case for diamond shape
  if (shapeClass === 'diamond') {
    return (
      <div className="relative transform rotate-45">
        {/* Render top handles */}
        {Array.from({ length: data.handles?.top || 1 }).map((_, i) => (
          <Handle 
            key={`top-${i}`}
            type="target"
            position={Position.Top}
            id={`top-${i}`}
            className="w-2 h-2 !bg-purple-400"
            style={{ left: `${(i + 1) * 100 / (data.handles?.top || 1 + 1)}%` }}
          />
        ))}
        
        <div className={`${baseClass} rounded-lg`}>
          <div className="transform -rotate-45">
            <div className="flex items-center">
              <span className="text-sm font-medium text-white">{data.label || 'CONTRACT'}</span>
            </div>
            <div className="my-2 text-xs text-white/80">
              {data.description || 'Define smart contract structure'}
            </div>
          </div>
        </div>
        
        {/* Render bottom handles */}
        {Array.from({ length: data.handles?.bottom || 1 }).map((_, i) => (
          <Handle 
            key={`bottom-${i}`}
            type="source"
            position={Position.Bottom}
            id={`bottom-${i}`}
            className="w-2 h-2 !bg-purple-400"
            style={{ left: `${(i + 1) * 100 / (data.handles?.bottom || 1 + 1)}%` }}
          />
        ))}
        
        {/* Render right handles */}
        {Array.from({ length: data.handles?.right || 0 }).map((_, i) => (
          <Handle 
            key={`right-${i}`}
            type="source"
            position={Position.Right}
            id={`right-${i}`}
            className="w-2 h-2 !bg-purple-400"
            style={{ top: `${(i + 1) * 100 / (data.handles?.right || 0 + 1)}%` }}
          />
        ))}
        
        {/* Render left handles */}
        {Array.from({ length: data.handles?.left || 0 }).map((_, i) => (
          <Handle 
            key={`left-${i}`}
            type="target"
            position={Position.Left}
            id={`left-${i}`}
            className="w-2 h-2 !bg-purple-400"
            style={{ top: `${(i + 1) * 100 / (data.handles?.left || 0 + 1)}%` }}
          />
        ))}
      </div>
    );
  }
  
  // Special case for hexagon shape
  if (shapeClass === 'hexagon') {
    return (
      <div className="relative">
        {/* Render top handles */}
        {Array.from({ length: data.handles?.top || 1 }).map((_, i) => (
          <Handle 
            key={`top-${i}`}
            type="target"
            position={Position.Top}
            id={`top-${i}`}
            className="w-2 h-2 !bg-purple-400"
            style={{ left: `${(i + 1) * 100 / (data.handles?.top || 1 + 1)}%` }}
          />
        ))}
        
        <div className="px-4 py-2 shadow-lg bg-purple-500/90 backdrop-blur-sm min-w-[150px] relative">
          <div className="absolute inset-0" style={{
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            backgroundColor: 'rgba(168, 85, 247, 0.9)',
            border: '1px solid #c084fc'
          }}></div>
          <div className="relative z-10">
            <div className="flex items-center">
              <span className="text-sm font-medium text-white">{data.label || 'CONTRACT'}</span>
            </div>
            <div className="my-2 text-xs text-white/80">
              {data.description || 'Define smart contract structure'}
            </div>
          </div>
        </div>
        
        {/* Handles rendering code... */}
        {Array.from({ length: data.handles?.bottom || 1 }).map((_, i) => (
          <Handle 
            key={`bottom-${i}`}
            type="source"
            position={Position.Bottom}
            id={`bottom-${i}`}
            className="w-2 h-2 !bg-purple-400"
            style={{ left: `${(i + 1) * 100 / (data.handles?.bottom || 1 + 1)}%` }}
          />
        ))}
        
        {Array.from({ length: data.handles?.right || 0 }).map((_, i) => (
          <Handle 
            key={`right-${i}`}
            type="source"
            position={Position.Right}
            id={`right-${i}`}
            className="w-2 h-2 !bg-purple-400"
            style={{ top: `${(i + 1) * 100 / (data.handles?.right || 0 + 1)}%` }}
          />
        ))}
        
        {Array.from({ length: data.handles?.left || 0 }).map((_, i) => (
          <Handle 
            key={`left-${i}`}
            type="target"
            position={Position.Left}
            id={`left-${i}`}
            className="w-2 h-2 !bg-purple-400"
            style={{ top: `${(i + 1) * 100 / (data.handles?.left || 0 + 1)}%` }}
          />
        ))}
      </div>
    );
  }

  // Default case for regular shapes
  return (
    <div className={`${baseClass} ${shapeClass}`}>
      {/* Render top handles */}
      {Array.from({ length: data.handles?.top || 1 }).map((_, i) => (
        <Handle 
          key={`top-${i}`}
          type="target"
          position={Position.Top}
          id={`top-${i}`}
          className="w-2 h-2 !bg-purple-400"
          style={{ left: `${(i + 1) * 100 / (data.handles?.top || 1 + 1)}%` }}
        />
      ))}
      
      <div className="flex items-center">
        <span className="text-sm font-medium text-white">{data.label || 'CONTRACT'}</span>
      </div>
      <div className="my-2 text-xs text-white/80">
        {data.description || 'Define smart contract structure'}
      </div>
      
      {/* Render bottom handles */}
      {Array.from({ length: data.handles?.bottom || 1 }).map((_, i) => (
        <Handle 
          key={`bottom-${i}`}
          type="source"
          position={Position.Bottom}
          id={`bottom-${i}`}
          className="w-2 h-2 !bg-purple-400"
          style={{ left: `${(i + 1) * 100 / (data.handles?.bottom || 1 + 1)}%` }}
        />
      ))}
      
      {/* Render right/left handles... */}
      {Array.from({ length: data.handles?.right || 0 }).map((_, i) => (
        <Handle 
          key={`right-${i}`}
          type="source"
          position={Position.Right}
          id={`right-${i}`}
          className="w-2 h-2 !bg-purple-400"
          style={{ top: `${(i + 1) * 100 / (data.handles?.right || 0 + 1)}%` }}
        />
      ))}
      
      {Array.from({ length: data.handles?.left || 0 }).map((_, i) => (
        <Handle 
          key={`left-${i}`}
          type="target"
          position={Position.Left}
          id={`left-${i}`}
          className="w-2 h-2 !bg-purple-400"
          style={{ top: `${(i + 1) * 100 / (data.handles?.left || 0 + 1)}%` }}
        />
      ))}
    </div>
  );
};

const ContractNode = (props: ContractNodeProps) => {
  return (
    <NodeWrapper id={props.id} type={props.type}>
      <ContractNodeComponent data={props.data} />
    </NodeWrapper>
  );
};

export default ContractNode;
