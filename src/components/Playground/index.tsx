import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

import Sidebar from './Sidebar';
import CodePreview from './CodePreview';
import NodeActions from './NodeActions';
import RoleNode from './NodeTypes/RoleNode';
import ActionNode from './NodeTypes/ActionNode';
import ContractNode from './NodeTypes/ContractNode';
import ObservationNode from './NodeTypes/ObservationNode';
import ValueNode from './NodeTypes/ValueNode';
import BoundNode from './NodeTypes/BoundNode';
import TokenNode from './NodeTypes/TokenNode';
import PartyNode from './NodeTypes/PartyNode';
import PayeeNode from './NodeTypes/PayeeNode';
import NodePropertiesDialog from './NodePropertiesDialog';
import CanvasMenu from './CanvasMenu';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { saveCanvas } from '@/services/mongodb';
import { generateCodeForLanguage } from '@/services/codeGenerators';

// Enhance node types with NodeActions
const createNodeWithActions = (NodeComponent: React.ComponentType<any>) => {
  return ({ id, data, ...props }: { id: string, data: any, position: any }) => {
    const nodeRef = useRef(null);
    return (
      <div className="relative" ref={nodeRef}>
        <NodeComponent id={id} data={data} {...props} />
        {data.showActions && (
          <NodeActions 
            node={{ id, data, position: props.position, ...props }} 
            onDelete={data.onDelete} 
            onDuplicate={data.onDuplicate}
            onChangeShape={data.onChangeShape} 
          />
        )}
      </div>
    );
  };
};

// Create enhanced node types with actions
const nodeTypes = {
  role: createNodeWithActions(RoleNode),
  action: createNodeWithActions(ActionNode),
  contract: createNodeWithActions(ContractNode),
  observation: createNodeWithActions(ObservationNode),
  value: createNodeWithActions(ValueNode),
  bound: createNodeWithActions(BoundNode),
  token: createNodeWithActions(TokenNode),
  party: createNodeWithActions(PartyNode),
  payee: createNodeWithActions(PayeeNode)
};

interface NodeTemplate {
  label: string;
  type: string;
  description?: string;
  value?: string;
  min?: string;
  max?: string;
  currency?: string;
  tokenName?: string;
  role?: string;
  shape?: string;
  handles?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const Playground = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeTemplates, setNodeTemplates] = useState<Record<string, Record<string, NodeTemplate>>>({});
  const [canvasName, setCanvasName] = useState<string>("Untitled Canvas");
  const [showCanvasMenu, setShowCanvasMenu] = useState<boolean>(false);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [codePreviewWidth, setCodePreviewWidth] = useState<number>(400);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("move");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  const developerMode = false;

  // Load template data from localStorage if available
  useEffect(() => {
    const storedTemplate = localStorage.getItem('selectedTemplate');
    
    if (storedTemplate) {
      try {
        const templateData = JSON.parse(storedTemplate);
        setNodes(templateData.nodes || []);
        setEdges(templateData.edges || []);
        if (templateData.name) {
          setCanvasName(templateData.name);
        }
        toast({
          title: "Template loaded",
          description: `${templateData.name || "Template"} has been loaded into the editor.`,
        });
        // Clear the localStorage after loading
        localStorage.removeItem('selectedTemplate');
      } catch (error) {
        console.error('Error loading template data:', error);
      }
    }
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');
      const templateJson = event.dataTransfer.getData('application/reactflow/template');
      
      if (!type || !reactFlowBounds || !reactFlowInstance) {
        console.log('Missing data for drop:', { type, label, reactFlowBounds, reactFlowInstance });
        return;
      }

      let templateData = {};
      try {
        if (templateJson) {
          templateData = JSON.parse(templateJson);
        }
      } catch (error) {
        console.error('Error parsing template data:', error);
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          ...templateData,
          label,
          type,
          onDelete: handleDeleteNode,
          onDuplicate: handleDuplicateNode,
          onChangeShape: handleChangeNodeShape
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node) => {
    setHoveredNode(node.id);
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            data: {
              ...n.data,
              showActions: true,
            },
          };
        }
        return n;
      })
    );
  }, [setNodes]);

  const onNodeMouseLeave = useCallback((event: React.MouseEvent, node: Node) => {
    setHoveredNode(null);
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            data: {
              ...n.data,
              showActions: false,
            },
          };
        }
        return n;
      })
    );
  }, [setNodes]);

  const handleCloseNodeEdit = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleUpdateNode = useCallback((updatedData: any) => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updatedData,
            },
          };
        }
        return node;
      })
    );
  }, [selectedNode, setNodes]);

  const handleNodeTemplateChange = useCallback((type: string, label: string, data: NodeTemplate) => {
    setNodeTemplates((prev) => {
      const updated = { ...prev };
      if (!updated[type]) {
        updated[type] = {};
      }
      updated[type][label] = data;
      return updated;
    });
  }, []);

  const handleNewCanvas = useCallback(() => {
    if (nodes.length > 0 || edges.length > 0) {
      // Ask for confirmation if there are items on the canvas
      if (window.confirm("Are you sure you want to clear the canvas? All unsaved changes will be lost.")) {
        setNodes([]);
        setEdges([]);
        setCanvasName("Untitled Canvas");
        toast({
          title: "Canvas cleared",
          description: "Started a new canvas.",
        });
      }
    } else {
      // If canvas is already empty, just reset the name
      setCanvasName("Untitled Canvas");
    }
  }, [nodes, edges, setNodes, setEdges]);

  const handleSaveCanvas = useCallback(async () => {
    // Save the current canvas to MongoDB
    const canvasData = {
      name: canvasName,
      nodes,
      edges
    };
    
    const canvasId = await saveCanvas(canvasData);
    if (canvasId) {
      toast({
        title: "Canvas Saved",
        description: `Canvas "${canvasName}" has been saved successfully.`,
      });
      console.log(`Canvas saved with ID: ${canvasId}`);
    }
  }, [canvasName, nodes, edges]);

  const handleCanvasSelect = useCallback((canvas: any) => {
    setNodes(canvas.nodes || []);
    setEdges(canvas.edges || []);
    setCanvasName(canvas.name || "Loaded Canvas");
    toast({
      title: "Canvas Loaded",
      description: `Canvas "${canvas.name}" has been loaded.`,
    });
  }, [setNodes, setEdges]);

  const handleLanguageChange = useCallback((language: string) => {
    setSelectedLanguage(language);
  }, []);

  const generateCode = useCallback((language: string) => {
    return generateCodeForLanguage(language, nodes, edges);
  }, [nodes, edges]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Node manipulation functions
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const handleDuplicateNode = useCallback((nodeToDuplicate: Node) => {
    const newNode = {
      ...nodeToDuplicate,
      id: `${nodeToDuplicate.type}-${Date.now()}`,
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const handleChangeNodeShape = useCallback((nodeId: string, shape: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              shape: shape
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 pt-14">
      <Sidebar 
        onNodeTemplateChange={handleNodeTemplateChange} 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNewCanvas}
            className="mr-2"
          >
            <FilePlus className="h-4 w-4 mr-1" />
            New Canvas
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveCanvas}
            className="mr-2"
          >
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowCanvasMenu(true)}
            className="mr-4"
          >
            Open
          </Button>
          <input
            type="text"
            value={canvasName}
            onChange={(e) => setCanvasName(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded px-2 py-1 text-sm"
            placeholder="Canvas Name"
          />
          <div className="ml-auto">
            <ThemeSwitcher />
          </div>
        </div>
        <div className="flex-1 flex h-full">
          <div className="flex-1 h-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              nodeTypes={nodeTypes}
              fitView
              className="bg-dots-darker dark:bg-gray-900"
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
          <CodePreview 
            code={generateCode(selectedLanguage)} 
            generateCode={() => generateCode(selectedLanguage)}
            width={codePreviewWidth}
            onResize={setCodePreviewWidth}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </div>

      {selectedNode && (
        <NodePropertiesDialog
          isOpen={!!selectedNode}
          onClose={handleCloseNodeEdit}
          nodeType={selectedNode.type}
          nodeLabel={selectedNode.data.label as string}
          initialData={selectedNode.data}
          onSubmit={handleUpdateNode}
          developerMode={developerMode}
        />
      )}

      <CanvasMenu 
        isOpen={showCanvasMenu}
        onClose={() => setShowCanvasMenu(false)}
        onCanvasSelect={handleCanvasSelect}
      />
    </div>
  );
};

export default Playground;
