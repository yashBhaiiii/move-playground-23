
import { useState, useCallback, useRef } from 'react';
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

import Sidebar from './Sidebar';
import CodePreview from './CodePreview';
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

const nodeTypes = {
  role: RoleNode,
  action: ActionNode,
  contract: ContractNode,
  observation: ObservationNode,
  value: ValueNode,
  bound: BoundNode,
  token: TokenNode,
  party: PartyNode,
  payee: PayeeNode
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
}

const Playground = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeTemplates, setNodeTemplates] = useState<Record<string, Record<string, NodeTemplate>>>({});

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
      
      // If we don't have all needed data or bounds, return early
      if (!type || !reactFlowBounds || !reactFlowInstance) {
        console.log('Missing data for drop:', { type, label, reactFlowBounds, reactFlowInstance });
        return;
      }

      // Parse template data if available
      let templateData = {};
      try {
        if (templateJson) {
          templateData = JSON.parse(templateJson);
        }
      } catch (error) {
        console.error('Error parsing template data:', error);
      }

      // Calculate the drop position
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      console.log('Dropping node:', { type, label, position, templateData });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          ...templateData,
          label, 
          type 
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

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

  // Helper function to identify relationship types
  const identifyRelationships = useCallback(() => {
    const relationships = {
      oneToMany: [],
      manyToOne: []
    };

    // Create a map of target nodes and their source connections
    const targetToSources: Record<string, string[]> = {};
    // Create a map of source nodes and their target connections
    const sourceToTargets: Record<string, string[]> = {};

    edges.forEach(edge => {
      if (!targetToSources[edge.target]) {
        targetToSources[edge.target] = [];
      }
      targetToSources[edge.target].push(edge.source);

      if (!sourceToTargets[edge.source]) {
        sourceToTargets[edge.source] = [];
      }
      sourceToTargets[edge.source].push(edge.target);
    });

    // Find many-to-one relationships: multiple sources connecting to one target
    Object.keys(targetToSources).forEach(targetId => {
      if (targetToSources[targetId].length > 1) {
        const targetNode = nodes.find(n => n.id === targetId);
        const sourceNodes = targetToSources[targetId].map(sourceId => 
          nodes.find(n => n.id === sourceId)
        ).filter(Boolean);
        
        if (targetNode && sourceNodes.length > 1) {
          relationships.manyToOne.push({
            target: targetNode,
            sources: sourceNodes
          });
        }
      }
    });

    // Find one-to-many relationships: one source connecting to multiple targets
    Object.keys(sourceToTargets).forEach(sourceId => {
      if (sourceToTargets[sourceId].length > 1) {
        const sourceNode = nodes.find(n => n.id === sourceId);
        const targetNodes = sourceToTargets[sourceId].map(targetId => 
          nodes.find(n => n.id === targetId)
        ).filter(Boolean);
        
        if (sourceNode && targetNodes.length > 1) {
          relationships.oneToMany.push({
            source: sourceNode,
            targets: targetNodes
          });
        }
      }
    });

    return relationships;
  }, [nodes, edges]);

  const generateCode = useCallback(() => {
    // Initialize code structure
    let code = 'module SmartContract {\n';
    code += '    use std::signer;\n';
    code += '    use std::vector;\n';
    code += '    use aptos_framework::coin;\n';
    code += '    use aptos_framework::account;\n\n';

    // Identify relationships for more complex code generation
    const relationships = identifyRelationships();
    console.log('Identified relationships:', relationships);

    // Generate struct definitions based on the nodes
    const structNodes = nodes.filter(node => node.type === 'value' || node.type === 'bound');
    if (structNodes.length > 0) {
      structNodes.forEach(node => {
        code += `    struct ${node.data.label} {\n`;
        code += '        value: u64\n';
        code += '    }\n\n';
      });
    }

    // Generate relationship structs
    if (relationships.oneToMany.length > 0) {
      relationships.oneToMany.forEach((rel, idx) => {
        const sourceName = rel.source.data.label.replace(/\s+/g, '');
        code += `    // One-to-many relationship for ${sourceName}\n`;
        code += `    struct ${sourceName}Collection {\n`;
        code += '        owner: address,\n';
        code += '        items: vector<u64>\n';
        code += '    }\n\n';
      });
    }

    // Generate resource account struct if we have many-to-one relationships
    if (relationships.manyToOne.length > 0) {
      code += '    // Resource account for many-to-one relationships\n';
      code += '    struct ResourceAccount {\n';
      code += '        signer_cap: account::SignerCapability\n';
      code += '    }\n\n';
    }

    // Generate token structures if token nodes exist
    const tokenNodes = nodes.filter(node => node.type === 'token');
    if (tokenNodes.length > 0) {
      code += '    // Token definitions\n';
      code += '    struct CoinType {}\n\n';
      
      code += '    // Token capabilities\n';
      code += '    struct TokenCapabilities {\n';
      code += '        mint_cap: coin::MintCapability<CoinType>,\n';
      code += '        burn_cap: coin::BurnCapability<CoinType>\n';
      code += '    }\n\n';
    }

    // Generate action functions
    const actionNodes = nodes.filter(node => node.type === 'action');
    actionNodes.forEach(node => {
      const connectedEdges = edges.filter(edge => edge.source === node.id || edge.target === node.id);
      const connectedNodes = new Set(
        connectedEdges.flatMap(edge => [
          nodes.find(n => n.id === edge.source),
          nodes.find(n => n.id === edge.target)
        ]).filter(Boolean)
      );

      switch (node.data.label) {
        case 'Deposit':
          code += '    public entry fun deposit(\n';
          code += '        account: &signer,\n';
          code += '        amount: u64\n';
          code += '    ) {\n';
          code += '        // Check if account has enough balance\n';
          code += '        // Handle deposit logic\n';
          code += '    }\n\n';
          break;
        case 'Withdraw':
          code += '    public entry fun withdraw(\n';
          code += '        account: &signer,\n';
          code += '        amount: u64\n';
          code += '    ) {\n';
          code += '        // Verify account has enough deposited\n';
          code += '        // Handle withdrawal logic\n';
          code += '    }\n\n';
          break;
        case 'Transfer':
          code += '    public entry fun transfer(\n';
          code += '        from: &signer,\n';
          code += '        to: address,\n';
          code += '        amount: u64\n';
          code += '    ) {\n';
          code += '        // Verify sender authorization\n';
          code += '        // Handle transfer logic\n';
          code += '    }\n\n';
          break;
        case 'Choice':
          code += '    public entry fun make_choice(\n';
          code += '        account: &signer,\n';
          code += '        choice_id: u64,\n';
          code += '        choice_value: u64\n';
          code += '    ) {\n';
          code += '        // Record the choice made by the account\n';
          code += '    }\n\n';
          break;
        case 'Notification':
          code += '    public entry fun notify(\n';
          code += '        account: &signer,\n';
          code += '        message: vector<u8>\n';
          code += '    ) {\n';
          code += '        // Emit notification event\n';
          code += '    }\n\n';
          break;
      }
    });

    // Generate relationship functions
    if (relationships.oneToMany.length > 0) {
      code += '    // Functions for one-to-many relationships\n';
      code += '    public fun add_to_collection(\n';
      code += '        owner: &signer,\n';
      code += '        collection_name: vector<u8>,\n';
      code += '        item_id: u64\n';
      code += '    ) {\n';
      code += '        // Add item to the collection\n';
      code += '    }\n\n';
      
      code += '    public fun remove_from_collection(\n';
      code += '        owner: &signer,\n';
      code += '        collection_name: vector<u8>,\n';
      code += '        item_id: u64\n';
      code += '    ) {\n';
      code += '        // Remove item from the collection\n';
      code += '    }\n\n';
    }

    if (relationships.manyToOne.length > 0) {
      code += '    // Functions for many-to-one relationships\n';
      code += '    public fun initialize_resource_account(\n';
      code += '        admin: &signer,\n';
      code += '        seed: vector<u8>\n';
      code += '    ) {\n';
      code += '        // Create a resource account and store its capability\n';
      code += '    }\n\n';
      
      code += '    public fun execute_as_resource(\n';
      code += '        admin: &signer,\n';
      code += '        action: u64\n';
      code += '    ) {\n';
      code += '        // Execute actions as the resource account\n';
      code += '    }\n\n';
    }

    // Generate token-related functions if token nodes exist
    if (tokenNodes.length > 0) {
      code += '    // Initialize and mint tokens\n';
      code += '    public fun initialize_token(\n';
      code += '        admin: &signer,\n';
      code += '        name: vector<u8>,\n';
      code += '        symbol: vector<u8>,\n';
      code += '        decimals: u8\n';
      code += '    ) {\n';
      code += '        // Initialize token with metadata\n';
      code += '    }\n\n';
      
      code += '    public entry fun mint_token(\n';
      code += '        admin: &signer,\n';
      code += '        to: address,\n';
      code += '        amount: u64\n';
      code += '    ) {\n';
      code += '        // Mint tokens to the specified address\n';
      code += '    }\n\n';
      
      code += '    public entry fun burn_token(\n';
      code += '        owner: &signer,\n';
      code += '        amount: u64\n';
      code += '    ) {\n';
      code += '        // Burn tokens from the owner\n';
      code += '    }\n\n';
    }

    // Close the module
    code += '}';
    return code;
  }, [nodes, edges, identifyRelationships]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNodeTemplateChange={handleNodeTemplateChange} />
      <div className="flex-1 flex">
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
            nodeTypes={nodeTypes}
            fitView
            className="bg-dots-darker"
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div className="w-96">
          <CodePreview code={generateCode()} generateCode={generateCode} />
        </div>
      </div>

      {selectedNode && (
        <NodePropertiesDialog
          isOpen={!!selectedNode}
          onClose={handleCloseNodeEdit}
          nodeType={selectedNode.type}
          nodeLabel={selectedNode.data.label}
          initialData={selectedNode.data}
          onSubmit={handleUpdateNode}
        />
      )}
    </div>
  );
};

export default Playground;
