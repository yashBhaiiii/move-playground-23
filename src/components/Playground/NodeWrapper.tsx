
import { useState, memo, ReactNode } from 'react';
import { Node } from '@xyflow/react';
import NodeHoverControls from './NodeHoverControls';

interface NodeWrapperProps {
  children: ReactNode;
  id: string;
  type: string;
}

const NodeWrapper = ({ children, id, type }: NodeWrapperProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const handleMouseEnter = (event: React.MouseEvent) => {
    setIsHovering(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2, 
      y: rect.top
    });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setPosition(null);
  };

  return (
    <div 
      className="node-wrapper relative" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isHovering && position && (
        <NodeHoverControls nodeId={id} position={position} type={type} />
      )}
    </div>
  );
};

export default memo(NodeWrapper);
