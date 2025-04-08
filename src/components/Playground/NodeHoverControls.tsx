
import { useState, useEffect, useRef } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { useReactFlow, Node } from '@xyflow/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NodeHoverControlsProps {
  nodeId: string;
  position: { x: number; y: number };
  type: string;
}

const NodeHoverControls = ({ nodeId, position, type }: NodeHoverControlsProps) => {
  const { getNode, deleteElements, setNodes } = useReactFlow();
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show controls with a slight delay to avoid them showing during normal mouse movement
  useEffect(() => {
    if (position) {
      timeoutRef.current = setTimeout(() => {
        setVisible(true);
      }, 300);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setVisible(false);
    };
  }, [position]);

  // Don't show controls for annotation nodes
  if (type === 'annotation') {
    return null;
  }

  const handleDelete = () => {
    deleteElements({ nodes: [{ id: nodeId }] });
  };

  const handleDuplicate = () => {
    const nodeToDuplicate = getNode(nodeId);
    
    if (nodeToDuplicate) {
      const newNode: Node = {
        ...nodeToDuplicate,
        id: `${nodeToDuplicate.type}-${Date.now()}`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
        selected: false,
      };
      
      setNodes((nds) => [...nds, newNode]);
    }
  };

  if (!visible) return null;

  return (
    <div 
      className="absolute z-50 flex gap-1 -translate-y-full -mt-2 opacity-0 animate-fade-in"
      style={{
        animation: "fade-in 0.2s ease-out forwards",
      }}
    >
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleDuplicate}
              className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md p-1.5 hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Copy size={14} className="text-purple-600" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleDelete}
              className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md p-1.5 hover:bg-red-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NodeHoverControls;
