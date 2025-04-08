
import React from 'react';
import { Copy, Trash, CopyPlus, Square, Circle } from 'lucide-react';
import { Node } from '@xyflow/react';
import { useToast } from '@/hooks/use-toast';

interface NodeActionsProps {
  node: Node;
  onDelete: (nodeId: string) => void;
  onDuplicate: (node: Node) => void;
  onChangeShape: (nodeId: string, newShape: string) => void;
}

const NodeActions = ({ node, onDelete, onDuplicate, onChangeShape }: NodeActionsProps) => {
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(node.id);
    toast({
      title: "Node Deleted",
      description: `${node.data.label} has been removed from the canvas.`,
    });
  };

  const handleDuplicate = () => {
    onDuplicate(node);
    toast({
      title: "Node Duplicated",
      description: `${node.data.label} has been duplicated.`,
    });
  };

  const handleChangeShape = (shape: string) => {
    onChangeShape(node.id, shape);
    toast({
      title: "Shape Changed",
      description: `${node.data.label}'s shape has been updated.`,
    });
  };

  return (
    <div className="absolute top-0 right-0 flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-bl-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        onClick={handleDuplicate}
        title="Duplicate"
      >
        <CopyPlus size={14} />
      </button>
      <button
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        onClick={handleDelete}
        title="Delete"
      >
        <Trash size={14} />
      </button>
      <div className="border-l border-gray-200 dark:border-gray-700 flex">
        <button
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          onClick={() => handleChangeShape('square')}
          title="Square shape"
        >
          <Square size={14} />
        </button>
        <button
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          onClick={() => handleChangeShape('circle')}
          title="Circle shape"
        >
          <Circle size={14} />
        </button>
      </div>
    </div>
  );
};

export default NodeActions;
