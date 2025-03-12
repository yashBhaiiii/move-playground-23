
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

const Playground = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

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
      
      // If we don't have all needed data or bounds, return early
      if (!type || !reactFlowBounds || !reactFlowInstance) {
        console.log('Missing data for drop:', { type, label, reactFlowBounds, reactFlowInstance });
        return;
      }

      // Calculate the drop position
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      console.log('Dropping node:', { type, label, position });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label, type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const generateCode = useCallback(() => {
    // Initialize code structure
    let code = 'module SmartContract {\n';
    code += '    use std::signer;\n';
    code += '    use aptos_framework::coin;\n\n';

    // Generate struct definitions based on the nodes
    const structNodes = nodes.filter(node => node.type === 'value' || node.type === 'bound');
    if (structNodes.length > 0) {
      structNodes.forEach(node => {
        code += `    struct ${node.data.label} {\n`;
        code += '        value: u64\n';
        code += '    }\n\n';
      });
    }

    // Generate functions based on action nodes
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
          code += '        // Deposit implementation\n';
          code += '    }\n\n';
          break;
        case 'Withdraw':
          code += '    public entry fun withdraw(\n';
          code += '        account: &signer,\n';
          code += '        amount: u64\n';
          code += '    ) {\n';
          code += '        // Withdraw implementation\n';
          code += '    }\n\n';
          break;
        case 'Transfer':
          code += '    public entry fun transfer(\n';
          code += '        from: &signer,\n';
          code += '        to: address,\n';
          code += '        amount: u64\n';
          code += '    ) {\n';
          code += '        // Transfer implementation\n';
          code += '    }\n\n';
          break;
      }
    });

    // Generate token-related functions if token nodes exist
    const tokenNodes = nodes.filter(node => node.type === 'token');
    if (tokenNodes.length > 0) {
      code += '    public entry fun mint_token(\n';
      code += '        account: &signer,\n';
      code += '        amount: u64\n';
      code += '    ) {\n';
      code += '        // Token minting implementation\n';
      code += '    }\n\n';
    }

    // Close the module
    code += '}';
    return code;
  }, [nodes, edges]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
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
            nodeTypes={nodeTypes}
            fitView
            className="bg-dots-darker"
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div className="w-96">
          <CodePreview code="" generateCode={generateCode} />
        </div>
      </div>
    </div>
  );
};

export default Playground;
