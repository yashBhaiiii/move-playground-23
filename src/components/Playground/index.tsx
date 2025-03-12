
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
    // Generate Move code based on the nodes and edges
    let code = 'module ExampleContract {\n';
    
    // Check if we have any deposit actions
    const hasDeposit = nodes.some(node => 
      node.type === 'action' && node.data.label === 'Deposit'
    );
    
    if (hasDeposit) {
      code += '    public fun deposit(collateral: u64, account: address) {\n';
      code += '        assert!(collateral >= 1 && collateral <= 2, Errors::INVALID_COLLATERAL);\n';
      code += '        // Transfer collateral to account\n';
      code += '    }\n\n';
    }
    
    // Check if we have any pay actions
    const hasPay = nodes.some(node => 
      node.type === 'contract' && node.data.label === 'Pay'
    );
    
    if (hasPay) {
      code += '    public fun pay(payee: address, amount: u64, currency: string) {\n';
      code += '        // Transfer amount of currency to payee\n';
      code += '    }\n\n';
    }
    
    // Add close function if there's a close node
    const hasClose = nodes.some(node => 
      node.type === 'contract' && node.data.label === 'Close'
    );
    
    if (hasClose) {
      code += '    public fun close() {\n';
      code += '        // Close the contract\n';
      code += '    }\n\n';
    }
    
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
