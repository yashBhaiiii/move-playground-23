
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: any[];
  edges: any[];
}

const tokenTemplates: Template[] = [
  {
    id: "erc20",
    name: "ERC-20 Token",
    description: "Standard fungible token template",
    category: "token",
    nodes: [
      {
        id: 'contract-1',
        type: 'contract',
        position: { x: 250, y: 100 },
        data: { label: 'ERC-20 Token', description: 'Standard fungible token' }
      },
      {
        id: 'token-1',
        type: 'token',
        position: { x: 250, y: 250 },
        data: { label: 'Currency', currency: 'MyToken' }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 100, y: 400 },
        data: { label: 'Transfer', description: 'Transfer tokens between accounts' }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 250, y: 400 },
        data: { label: 'Approve', description: 'Approve spending of tokens' }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 400, y: 400 },
        data: { label: 'Mint', description: 'Create new tokens' }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'contract-1', target: 'token-1' },
      { id: 'e2-3', source: 'token-1', target: 'action-1' },
      { id: 'e2-4', source: 'token-1', target: 'action-2' },
      { id: 'e2-5', source: 'token-1', target: 'action-3' }
    ]
  },
  {
    id: "erc721",
    name: "ERC-721 NFT",
    description: "Standard non-fungible token (NFT) contract",
    category: "token",
    nodes: [
      {
        id: 'contract-1',
        type: 'contract',
        position: { x: 250, y: 100 },
        data: { label: 'ERC-721 NFT', description: 'Non-fungible token' }
      },
      {
        id: 'token-1',
        type: 'token',
        position: { x: 250, y: 250 },
        data: { label: 'Token ID', tokenName: 'MyNFT' }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 100, y: 400 },
        data: { label: 'Transfer', description: 'Transfer NFT ownership' }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 250, y: 400 },
        data: { label: 'Mint', description: 'Create new NFT' }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 400, y: 400 },
        data: { label: 'Set Approval', description: 'Approve NFT transfers' }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'contract-1', target: 'token-1' },
      { id: 'e2-3', source: 'token-1', target: 'action-1' },
      { id: 'e2-4', source: 'token-1', target: 'action-2' },
      { id: 'e2-5', source: 'token-1', target: 'action-3' }
    ]
  }
];

const defiTemplates: Template[] = [
  {
    id: "liquidity-pool",
    name: "Liquidity Pool Contract",
    description: "Template for managing liquidity pools",
    category: "defi",
    nodes: [
      {
        id: 'contract-1',
        type: 'contract',
        position: { x: 250, y: 100 },
        data: { label: 'Liquidity Pool', description: 'Manage token pairs' }
      },
      {
        id: 'token-1',
        type: 'token',
        position: { x: 150, y: 250 },
        data: { label: 'Currency', currency: 'TokenA' }
      },
      {
        id: 'token-2',
        type: 'token',
        position: { x: 350, y: 250 },
        data: { label: 'Currency', currency: 'TokenB' }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 100, y: 400 },
        data: { label: 'Add Liquidity', description: 'Add tokens to pool' }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 250, y: 400 },
        data: { label: 'Remove Liquidity', description: 'Withdraw tokens from pool' }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 400, y: 400 },
        data: { label: 'Swap', description: 'Exchange tokens' }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'contract-1', target: 'token-1' },
      { id: 'e1-3', source: 'contract-1', target: 'token-2' },
      { id: 'e2-4', source: 'token-1', target: 'action-1' },
      { id: 'e3-4', source: 'token-2', target: 'action-1' },
      { id: 'e2-5', source: 'token-1', target: 'action-2' },
      { id: 'e3-5', source: 'token-2', target: 'action-2' },
      { id: 'e2-6', source: 'token-1', target: 'action-3' },
      { id: 'e3-6', source: 'token-2', target: 'action-3' }
    ]
  },
  {
    id: "staking",
    name: "Staking Contract",
    description: "Users can stake tokens and earn rewards",
    category: "defi",
    nodes: [
      {
        id: 'contract-1',
        type: 'contract',
        position: { x: 250, y: 100 },
        data: { label: 'Staking Contract', description: 'Stake tokens for rewards' }
      },
      {
        id: 'token-1',
        type: 'token',
        position: { x: 150, y: 250 },
        data: { label: 'Currency', currency: 'StakeToken' }
      },
      {
        id: 'token-2',
        type: 'token',
        position: { x: 350, y: 250 },
        data: { label: 'Currency', currency: 'RewardToken' }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 100, y: 400 },
        data: { label: 'Stake', description: 'Stake tokens' }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 250, y: 400 },
        data: { label: 'Unstake', description: 'Withdraw staked tokens' }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 400, y: 400 },
        data: { label: 'Claim Rewards', description: 'Harvest rewards' }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'contract-1', target: 'token-1' },
      { id: 'e1-3', source: 'contract-1', target: 'token-2' },
      { id: 'e2-4', source: 'token-1', target: 'action-1' },
      { id: 'e2-5', source: 'token-1', target: 'action-2' },
      { id: 'e3-6', source: 'token-2', target: 'action-3' }
    ]
  }
];

const governanceTemplates: Template[] = [
  {
    id: "dao",
    name: "DAO Governance Contract",
    description: "Voting and proposal-based decision-making system",
    category: "governance",
    nodes: [
      {
        id: 'contract-1',
        type: 'contract',
        position: { x: 250, y: 100 },
        data: { label: 'DAO Governance', description: 'Decentralized voting system' }
      },
      {
        id: 'token-1',
        type: 'token',
        position: { x: 250, y: 250 },
        data: { label: 'Currency', currency: 'GovernanceToken' }
      },
      {
        id: 'role-1',
        type: 'role',
        position: { x: 100, y: 250 },
        data: { label: 'Proposer', description: 'Can create proposals' }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 100, y: 400 },
        data: { label: 'Propose', description: 'Create a new proposal' }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 250, y: 400 },
        data: { label: 'Vote', description: 'Vote on proposals' }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 400, y: 400 },
        data: { label: 'Execute', description: 'Execute passed proposals' }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'contract-1', target: 'token-1' },
      { id: 'e1-3', source: 'contract-1', target: 'role-1' },
      { id: 'e3-4', source: 'role-1', target: 'action-1' },
      { id: 'e2-5', source: 'token-1', target: 'action-2' },
      { id: 'e1-6', source: 'contract-1', target: 'action-3' }
    ]
  },
  {
    id: "multisig",
    name: "Multi-Signature Wallet",
    description: "Contract requiring multiple approvals for transactions",
    category: "governance",
    nodes: [
      {
        id: 'contract-1',
        type: 'contract',
        position: { x: 250, y: 100 },
        data: { label: 'Multi-Signature Wallet', description: 'Requires multiple signatures' }
      },
      {
        id: 'role-1',
        type: 'role',
        position: { x: 250, y: 250 },
        data: { label: 'Owner', description: 'Wallet signatory' }
      },
      {
        id: 'value-1',
        type: 'value',
        position: { x: 400, y: 250 },
        data: { label: 'Threshold', value: '2' }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 100, y: 400 },
        data: { label: 'Propose Transaction', description: 'Submit new transaction' }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 250, y: 400 },
        data: { label: 'Confirm', description: 'Approve transaction' }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 400, y: 400 },
        data: { label: 'Execute', description: 'Execute confirmed transaction' }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'contract-1', target: 'role-1' },
      { id: 'e1-3', source: 'contract-1', target: 'value-1' },
      { id: 'e2-4', source: 'role-1', target: 'action-1' },
      { id: 'e2-5', source: 'role-1', target: 'action-2' },
      { id: 'e3-6', source: 'value-1', target: 'action-3' },
      { id: 'e5-6', source: 'action-2', target: 'action-3' }
    ]
  }
];

const utilityTemplates: Template[] = [
  {
    id: "timelock",
    name: "Time-Locked Wallet",
    description: "Funds are locked until a set timestamp",
    category: "utility",
    nodes: [
      {
        id: 'contract-1',
        type: 'contract',
        position: { x: 250, y: 100 },
        data: { label: 'Time-Locked Wallet', description: 'Time-controlled funds' }
      },
      {
        id: 'token-1',
        type: 'token',
        position: { x: 150, y: 250 },
        data: { label: 'Currency', currency: 'LockedToken' }
      },
      {
        id: 'observation-1',
        type: 'observation',
        position: { x: 350, y: 250 },
        data: { label: 'Time Check', type: 'Timestamp comparison' }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 150, y: 400 },
        data: { label: 'Deposit', description: 'Lock tokens' }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 350, y: 400 },
        data: { label: 'Withdraw', description: 'Unlock tokens after time' }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'contract-1', target: 'token-1' },
      { id: 'e1-3', source: 'contract-1', target: 'observation-1' },
      { id: 'e2-4', source: 'token-1', target: 'action-1' },
      { id: 'e2-5', source: 'token-1', target: 'action-2' },
      { id: 'e3-5', source: 'observation-1', target: 'action-2' }
    ]
  },
  {
    id: "escrow",
    name: "Escrow Contract",
    description: "Holds funds until both parties fulfill conditions",
    category: "utility",
    nodes: [
      {
        id: 'contract-1',
        type: 'contract',
        position: { x: 250, y: 100 },
        data: { label: 'Escrow', description: 'Conditional fund holding' }
      },
      {
        id: 'party-1',
        type: 'party',
        position: { x: 100, y: 250 },
        data: { label: 'Buyer' }
      },
      {
        id: 'party-2',
        type: 'party',
        position: { x: 400, y: 250 },
        data: { label: 'Seller' }
      },
      {
        id: 'token-1',
        type: 'token',
        position: { x: 250, y: 250 },
        data: { label: 'Currency', currency: 'PaymentToken' }
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 100, y: 400 },
        data: { label: 'Deposit', description: 'Buyer deposits funds' }
      },
      {
        id: 'action-2',
        type: 'action',
        position: { x: 250, y: 400 },
        data: { label: 'Confirm Delivery', description: 'Buyer confirms receipt' }
      },
      {
        id: 'action-3',
        type: 'action',
        position: { x: 400, y: 400 },
        data: { label: 'Release Payment', description: 'Release funds to seller' }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'contract-1', target: 'party-1' },
      { id: 'e1-3', source: 'contract-1', target: 'party-2' },
      { id: 'e1-4', source: 'contract-1', target: 'token-1' },
      { id: 'e2-5', source: 'party-1', target: 'action-1' },
      { id: 'e4-5', source: 'token-1', target: 'action-1' },
      { id: 'e2-6', source: 'party-1', target: 'action-2' },
      { id: 'e6-7', source: 'action-2', target: 'action-3' },
      { id: 'e3-7', source: 'party-2', target: 'action-3' },
      { id: 'e4-7', source: 'token-1', target: 'action-3' }
    ]
  }
];

const Templates = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("token");

  const handleUseTemplate = (template: Template) => {
    // Store template data in localStorage to be used by the Playground component
    localStorage.setItem('selectedTemplate', JSON.stringify({
      nodes: template.nodes,
      edges: template.edges,
      name: template.name
    }));
    
    toast({
      title: "Template selected",
      description: `${template.name} template loaded. Redirecting to editor...`,
    });

    // Navigate to the smart-contract-builder instead of home page
    setTimeout(() => {
      navigate('/smart-contract-builder');
    }, 1000);
  };

  const renderTemplateCards = (templates: Template[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-gray-500">
                {template.nodes.length} nodes, {template.edges.length} connections
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleUseTemplate(template)}
                className="w-full"
              >
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto pt-20 pb-10">
      <h1 className="text-3xl font-bold mb-6">Smart Contract Templates</h1>
      <p className="text-gray-600 mb-8">
        Choose from a variety of pre-made templates to jumpstart your smart contract development.
        These templates are fully modifiable in the editor.
      </p>
      
      <Tabs defaultValue="token" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="token">Token Contracts</TabsTrigger>
          <TabsTrigger value="defi">DeFi Contracts</TabsTrigger>
          <TabsTrigger value="governance">Governance & DAOs</TabsTrigger>
          <TabsTrigger value="utility">Utility & Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="token">
          <h2 className="text-xl font-semibold mb-4">Token Contract Templates</h2>
          {renderTemplateCards(tokenTemplates)}
        </TabsContent>
        
        <TabsContent value="defi">
          <h2 className="text-xl font-semibold mb-4">DeFi Contract Templates</h2>
          {renderTemplateCards(defiTemplates)}
        </TabsContent>
        
        <TabsContent value="governance">
          <h2 className="text-xl font-semibold mb-4">Governance & DAO Templates</h2>
          {renderTemplateCards(governanceTemplates)}
        </TabsContent>
        
        <TabsContent value="utility">
          <h2 className="text-xl font-semibold mb-4">Utility & Security Templates</h2>
          {renderTemplateCards(utilityTemplates)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Templates;
