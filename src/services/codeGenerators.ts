
// Code generators for different blockchain languages

// Helper functions for code generation
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const camelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

const snakeCase = (str: string): string => {
  return str
    .replace(/\s+/g, '_')
    .toLowerCase();
};

// Generic node identification function
export const identifyRelationships = (nodes: any[], edges: any[]) => {
  type RelationshipNode = { id: string; data: { label: string } };
  
  const relationships = {
    oneToMany: [] as { source: RelationshipNode; targets: RelationshipNode[] }[],
    manyToOne: [] as { target: RelationshipNode; sources: RelationshipNode[] }[]
  };

  const targetToSources: Record<string, string[]> = {};
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

  Object.keys(targetToSources).forEach(targetId => {
    if (targetToSources[targetId].length > 1) {
      const targetNode = nodes.find(n => n.id === targetId);
      const sourceNodes = targetToSources[targetId]
        .map(sourceId => nodes.find(n => n.id === sourceId))
        .filter(Boolean);
      
      if (targetNode && sourceNodes.length > 1) {
        relationships.manyToOne.push({
          target: targetNode as RelationshipNode,
          sources: sourceNodes as RelationshipNode[]
        });
      }
    }
  });

  Object.keys(sourceToTargets).forEach(sourceId => {
    if (sourceToTargets[sourceId].length > 1) {
      const sourceNode = nodes.find(n => n.id === sourceId);
      const targetNodes = sourceToTargets[sourceId]
        .map(targetId => nodes.find(n => n.id === targetId))
        .filter(Boolean);
      
      if (sourceNode && targetNodes.length > 1) {
        relationships.oneToMany.push({
          source: sourceNode as RelationshipNode,
          targets: targetNodes as RelationshipNode[]
        });
      }
    }
  });

  return relationships;
};

// Generate Move code
export const generateMoveCode = (nodes: any[], edges: any[]) => {
  let code = 'module SmartContract {\n';
  code += '    use std::signer;\n';
  code += '    use std::vector;\n';
  code += '    use aptos_framework::coin;\n';
  code += '    use aptos_framework::account;\n\n';

  const relationships = identifyRelationships(nodes, edges);
  console.log('Identified relationships:', relationships);

  const structNodes = nodes.filter(node => node.type === 'value' || node.type === 'bound');
  if (structNodes.length > 0) {
    structNodes.forEach(node => {
      const nodeLabel = node.data.label as string;
      code += `    struct ${nodeLabel} {\n`;
      code += '        value: u64\n';
      code += '    }\n\n';
    });
  }

  if (relationships.oneToMany.length > 0) {
    relationships.oneToMany.forEach((rel) => {
      const sourceName = (rel.source.data.label as string).replace(/\s+/g, '');
      code += `    // One-to-many relationship for ${sourceName}\n`;
      code += `    struct ${sourceName}Collection {\n`;
      code += '        owner: address,\n';
      code += '        items: vector<u64>\n';
      code += '    }\n\n';
    });
  }

  if (relationships.manyToOne.length > 0) {
    code += '    // Resource account for many-to-one relationships\n';
    code += '    struct ResourceAccount {\n';
    code += '        signer_cap: account::SignerCapability\n';
    code += '    }\n\n';
  }

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

  const actionNodes = nodes.filter(node => node.type === 'action');
  actionNodes.forEach(node => {
    const connectedEdges = edges.filter(edge => edge.source === node.id || edge.target === node.id);
    const connectedNodes = new Set(
      connectedEdges.flatMap(edge => [
        nodes.find(n => n.id === edge.source),
        nodes.find(n => n.id === edge.target)
      ]).filter(Boolean)
    );

    const nodeLabel = node.data.label as string;
    switch (nodeLabel) {
      case 'Deposit':
        code += '    public entry fun deposit(\n';
        code += '        account: &signer,\n';
        code += '        amount: u64\n';
        code += '    ) {\n';
        code += '        // Check if account has enough balance\n';
        code += '        // Handle deposit logic\n';
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
      default:
        code += `    public entry fun ${nodeLabel.toLowerCase().replace(/\s+/g, '_')}(\n`;
        code += '        account: &signer\n';
        code += '    ) {\n';
        code += `        // Implementation for ${nodeLabel}\n`;
        code += '    }\n\n';
    }
  });

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

  code += '}';
  return code;
};

// Generate Solidity code
export const generateSolidityCode = (nodes: any[], edges: any[]) => {
  let code = '// SPDX-License-Identifier: MIT\n';
  code += 'pragma solidity ^0.8.20;\n\n';
  
  code += 'contract SmartContract {\n';
  
  // Define events
  const actionNodes = nodes.filter(node => node.type === 'action');
  if (actionNodes.length > 0) {
    code += '    // Events\n';
    actionNodes.forEach(node => {
      const nodeLabel = node.data.label as string;
      const eventName = capitalizeFirstLetter(nodeLabel);
      code += `    event ${eventName}(`
      if (nodeLabel === 'Deposit') {
        code += 'address indexed from, uint256 amount);\n';
      } else if (nodeLabel === 'Choice') { 
        code += 'address indexed participant, uint256 choiceId, uint256 choiceValue);\n';
      } else if (nodeLabel === 'Notification') {
        code += 'address indexed from, string message);\n';
      } else {
        code += 'address indexed from);\n';
      }
    });
    code += '\n';
  }
  
  // Define state variables
  const structNodes = nodes.filter(node => node.type === 'value' || node.type === 'bound');
  if (structNodes.length > 0) {
    code += '    // State variables\n';
    structNodes.forEach(node => {
      const nodeLabel = node.data.label as string;
      const variableName = camelCase(nodeLabel);
      code += `    uint256 public ${variableName};\n`;
    });
    code += '\n';
  }
  
  // Token implementation for ERC20-like tokens
  const tokenNodes = nodes.filter(node => node.type === 'token');
  if (tokenNodes.length > 0) {
    code += '    // Token implementation\n';
    code += '    string public name;\n';
    code += '    string public symbol;\n';
    code += '    uint8 public decimals;\n';
    code += '    uint256 public totalSupply;\n';
    code += '    mapping(address => uint256) public balanceOf;\n';
    code += '    mapping(address => mapping(address => uint256)) public allowance;\n\n';
    
    code += '    // Token events\n';
    code += '    event Transfer(address indexed from, address indexed to, uint256 value);\n';
    code += '    event Approval(address indexed owner, address indexed spender, uint256 value);\n\n';
  }

  // Constructor
  code += '    constructor() {\n';
  if (tokenNodes.length > 0) {
    code += '        name = "SmartToken";\n';
    code += '        symbol = "SMT";\n';
    code += '        decimals = 18;\n';
  }
  code += '    }\n\n';
  
  // Implement functions based on action nodes
  actionNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const functionName = camelCase(nodeLabel);
    
    if (nodeLabel === 'Deposit') {
      code += '    function deposit() public payable {\n';
      code += '        require(msg.value > 0, "Amount must be greater than 0");\n';
      code += '        emit Deposit(msg.sender, msg.value);\n';
      code += '    }\n\n';
    } else if (nodeLabel === 'Choice') {
      code += '    function makeChoice(uint256 choiceId, uint256 choiceValue) public {\n';
      code += '        emit Choice(msg.sender, choiceId, choiceValue);\n';
      code += '    }\n\n';
    } else if (nodeLabel === 'Notification') {
      code += '    function notify(string memory message) public {\n';
      code += '        emit Notification(msg.sender, message);\n';
      code += '    }\n\n';
    } else {
      code += `    function ${functionName}() public {\n`;
      code += `        emit ${capitalizeFirstLetter(nodeLabel)}(msg.sender);\n`;
      code += '    }\n\n';
    }
  });
  
  // Implement token functions if token nodes exist
  if (tokenNodes.length > 0) {
    code += '    function transfer(address to, uint256 amount) public returns (bool) {\n';
    code += '        require(balanceOf[msg.sender] >= amount, "Insufficient balance");\n';
    code += '        balanceOf[msg.sender] -= amount;\n';
    code += '        balanceOf[to] += amount;\n';
    code += '        emit Transfer(msg.sender, to, amount);\n';
    code += '        return true;\n';
    code += '    }\n\n';
    
    code += '    function approve(address spender, uint256 amount) public returns (bool) {\n';
    code += '        allowance[msg.sender][spender] = amount;\n';
    code += '        emit Approval(msg.sender, spender, amount);\n';
    code += '        return true;\n';
    code += '    }\n\n';
    
    code += '    function transferFrom(address from, address to, uint256 amount) public returns (bool) {\n';
    code += '        require(balanceOf[from] >= amount, "Insufficient balance");\n';
    code += '        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");\n';
    code += '        balanceOf[from] -= amount;\n';
    code += '        balanceOf[to] += amount;\n';
    code += '        allowance[from][msg.sender] -= amount;\n';
    code += '        emit Transfer(from, to, amount);\n';
    code += '        return true;\n';
    code += '    }\n\n';
    
    code += '    function mint(address to, uint256 amount) public {\n';
    code += '        // Add appropriate access control\n';
    code += '        balanceOf[to] += amount;\n';
    code += '        totalSupply += amount;\n';
    code += '        emit Transfer(address(0), to, amount);\n';
    code += '    }\n\n';
    
    code += '    function burn(uint256 amount) public {\n';
    code += '        require(balanceOf[msg.sender] >= amount, "Insufficient balance");\n';
    code += '        balanceOf[msg.sender] -= amount;\n';
    code += '        totalSupply -= amount;\n';
    code += '        emit Transfer(msg.sender, address(0), amount);\n';
    code += '    }\n';
  }
  
  code += '}';
  return code;
};

// Generate Rust code
export const generateRustCode = (nodes: any[], edges: any[]) => {
  let code = '//! Smart contract implemented in Ink! for Substrate\n\n';
  code += '#![cfg_attr(not(feature = "std"), no_std)]\n\n';
  code += 'use ink_lang as ink;\n\n';
  
  code += '#[ink::contract]\n';
  code += 'mod smart_contract {\n';
  code += '    use ink_prelude::vec::Vec;\n';
  code += '    use ink_storage::{collections::HashMap};\n\n';
  
  // Define storage
  code += '    #[ink(storage)]\n';
  code += '    pub struct SmartContract {\n';
  
  const structNodes = nodes.filter(node => node.type === 'value' || node.type === 'bound');
  structNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const variableName = snakeCase(nodeLabel);
    code += `        ${variableName}: u128,\n`;
  });
  
  const tokenNodes = nodes.filter(node => node.type === 'token');
  if (tokenNodes.length > 0) {
    code += '        // Token related storage\n';
    code += '        total_supply: u128,\n';
    code += '        balances: HashMap<AccountId, u128>,\n';
    code += '        allowances: HashMap<(AccountId, AccountId), u128>,\n';
  }
  
  const relationships = identifyRelationships(nodes, edges);
  if (relationships.oneToMany.length > 0 || relationships.manyToOne.length > 0) {
    code += '        // Relationship mappings\n';
    code += '        relationships: HashMap<AccountId, Vec<AccountId>>,\n';
  }
  
  code += '    }\n\n';
  
  // Events
  const actionNodes = nodes.filter(node => node.type === 'action');
  if (actionNodes.length > 0) {
    code += '    // Events\n';
    actionNodes.forEach(node => {
      const nodeLabel = node.data.label as string;
      code += '    #[ink(event)]\n';
      code += `    pub struct ${capitalizeFirstLetter(nodeLabel)} {\n`;
      code += '        #[ink(topic)]\n';
      code += '        from: AccountId,\n';
      if (nodeLabel === 'Deposit') {
        code += '        amount: u128,\n';
      } else if (nodeLabel === 'Choice') {
        code += '        choice_id: u128,\n';
        code += '        choice_value: u128,\n';
      } else if (nodeLabel === 'Notification') {
        code += '        message: Vec<u8>,\n';
      }
      code += '    }\n\n';
    });
  }
  
  // Implement token events if needed
  if (tokenNodes.length > 0) {
    code += '    // Token events\n';
    code += '    #[ink(event)]\n';
    code += '    pub struct Transfer {\n';
    code += '        #[ink(topic)]\n';
    code += '        from: Option<AccountId>,\n';
    code += '        #[ink(topic)]\n';
    code += '        to: Option<AccountId>,\n';
    code += '        value: u128,\n';
    code += '    }\n\n';
    
    code += '    #[ink(event)]\n';
    code += '    pub struct Approval {\n';
    code += '        #[ink(topic)]\n';
    code += '        owner: AccountId,\n';
    code += '        #[ink(topic)]\n';
    code += '        spender: AccountId,\n';
    code += '        value: u128,\n';
    code += '    }\n\n';
  }
  
  // Implementation
  code += '    impl SmartContract {\n';
  
  // Constructor
  code += '        #[ink(constructor)]\n';
  code += '        pub fn new() -> Self {\n';
  code += '            Self {\n';
  
  structNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const variableName = snakeCase(nodeLabel);
    code += `                ${variableName}: 0,\n`;
  });
  
  if (tokenNodes.length > 0) {
    code += '                total_supply: 0,\n';
    code += '                balances: HashMap::new(),\n';
    code += '                allowances: HashMap::new(),\n';
  }
  
  if (relationships.oneToMany.length > 0 || relationships.manyToOne.length > 0) {
    code += '                relationships: HashMap::new(),\n';
  }
  
  code += '            }\n';
  code += '        }\n\n';
  
  // Implement functions for action nodes
  actionNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const functionName = snakeCase(nodeLabel);
    
    code += '        #[ink(message)]\n';
    
    if (nodeLabel === 'Deposit') {
      code += '        pub fn deposit(&mut self, amount: u128) {\n';
      code += '            let caller = self.env().caller();\n';
      code += '            self.env().emit_event(Deposit {\n';
      code += '                from: caller,\n';
      code += '                amount,\n';
      code += '            });\n';
      code += '        }\n\n';
    } else if (nodeLabel === 'Choice') {
      code += '        pub fn make_choice(&mut self, choice_id: u128, choice_value: u128) {\n';
      code += '            let caller = self.env().caller();\n';
      code += '            self.env().emit_event(Choice {\n';
      code += '                from: caller,\n';
      code += '                choice_id,\n';
      code += '                choice_value,\n';
      code += '            });\n';
      code += '        }\n\n';
    } else if (nodeLabel === 'Notification') {
      code += '        pub fn notify(&mut self, message: Vec<u8>) {\n';
      code += '            let caller = self.env().caller();\n';
      code += '            self.env().emit_event(Notification {\n';
      code += '                from: caller,\n';
      code += '                message,\n';
      code += '            });\n';
      code += '        }\n\n';
    } else {
      code += `        pub fn ${functionName}(&mut self) {\n`;
      code += '            let caller = self.env().caller();\n';
      code += `            self.env().emit_event(${capitalizeFirstLetter(nodeLabel)} {\n`;
      code += '                from: caller,\n';
      code += '            });\n';
      code += '        }\n\n';
    }
  });
  
  // Token functions if needed
  if (tokenNodes.length > 0) {
    code += '        // Token related functions\n';
    code += '        #[ink(message)]\n';
    code += '        pub fn transfer(&mut self, to: AccountId, value: u128) -> bool {\n';
    code += '            let from = self.env().caller();\n';
    code += '            self.transfer_from_to(from, to, value)\n';
    code += '        }\n\n';
    
    code += '        #[ink(message)]\n';
    code += '        pub fn approve(&mut self, spender: AccountId, value: u128) -> bool {\n';
    code += '            let owner = self.env().caller();\n';
    code += '            self.allowances.insert((owner, spender), value);\n';
    code += '            self.env().emit_event(Approval {\n';
    code += '                owner,\n';
    code += '                spender,\n';
    code += '                value,\n';
    code += '            });\n';
    code += '            true\n';
    code += '        }\n\n';
    
    code += '        fn transfer_from_to(&mut self, from: AccountId, to: AccountId, value: u128) -> bool {\n';
    code += '            let from_balance = self.balance_of_or_zero(&from);\n';
    code += '            if from_balance < value {\n';
    code += '                return false\n';
    code += '            }\n';
    code += '            self.balances.insert(from, from_balance - value);\n';
    code += '            let to_balance = self.balance_of_or_zero(&to);\n';
    code += '            self.balances.insert(to, to_balance + value);\n';
    code += '            self.env().emit_event(Transfer {\n';
    code += '                from: Some(from),\n';
    code += '                to: Some(to),\n';
    code += '                value,\n';
    code += '            });\n';
    code += '            true\n';
    code += '        }\n\n';
    
    code += '        fn balance_of_or_zero(&self, owner: &AccountId) -> u128 {\n';
    code += '            *self.balances.get(owner).unwrap_or(&0)\n';
    code += '        }\n';
  }
  
  code += '    }\n';
  code += '}';
  
  return code;
};

// Generate Go code for Hyperledger Fabric
export const generateGoCode = (nodes: any[], edges: any[]) => {
  let code = 'package main\n\n';
  code += 'import (\n';
  code += '	"encoding/json"\n';
  code += '	"fmt"\n';
  code += '	"strconv"\n\n';
  code += '	"github.com/hyperledger/fabric-contract-api-go/contractapi"\n';
  code += ')\n\n';
  
  // Define SmartContract struct
  code += '// SmartContract provides functions for managing assets\n';
  code += 'type SmartContract struct {\n';
  code += '	contractapi.Contract\n';
  code += '}\n\n';
  
  // Define asset struct based on value/bound nodes
  const structNodes = nodes.filter(node => node.type === 'value' || node.type === 'bound');
  if (structNodes.length > 0) {
    code += '// Asset describes basic details of an asset\n';
    code += 'type Asset struct {\n';
    code += '	ID             string `json:"ID"`\n';
    structNodes.forEach(node => {
      const nodeLabel = node.data.label as string;
      const fieldName = capitalizeFirstLetter(camelCase(nodeLabel));
      code += `	${fieldName}      int    \`json:"${camelCase(nodeLabel)}"\`\n`;
    });
    code += '	Owner          string `json:"owner"`\n';
    code += '}\n\n';
  }
  
  // Define token if token nodes exist
  const tokenNodes = nodes.filter(node => node.type === 'token');
  if (tokenNodes.length > 0) {
    code += '// Token represents a token asset\n';
    code += 'type Token struct {\n';
    code += '	Symbol       string `json:"symbol"`\n';
    code += '	Name         string `json:"name"`\n';
    code += '	TotalSupply  int    `json:"totalSupply"`\n';
    code += '	Decimals     int    `json:"decimals"`\n';
    code += '	OwnerBalance map[string]int `json:"ownerBalance"`\n';
    code += '}\n\n';
  }
  
  // Initialize function
  code += '// InitLedger adds a base set of assets to the ledger\n';
  code += 'func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {\n';
  
  if (structNodes.length > 0) {
    code += '	assets := []Asset{\n';
    code += '		{\n';
    code += '			ID:    "asset1",\n';
    structNodes.forEach(node => {
      const nodeLabel = node.data.label as string;
      const fieldName = capitalizeFirstLetter(camelCase(nodeLabel));
      code += `			${fieldName}: 100,\n`;
    });
    code += '			Owner: "Alice",\n';
    code += '		},\n';
    code += '	}\n\n';
    
    code += '	for _, asset := range assets {\n';
    code += '		assetJSON, err := json.Marshal(asset)\n';
    code += '		if err != nil {\n';
    code += '			return err\n';
    code += '		}\n\n';
    code += '		err = ctx.GetStub().PutState(asset.ID, assetJSON)\n';
    code += '		if err != nil {\n';
    code += '			return fmt.Errorf("failed to put to world state: %v", err)\n';
    code += '		}\n';
    code += '	}\n';
  }
  
  if (tokenNodes.length > 0) {
    code += '\n	// Initialize token\n';
    code += '	token := Token{\n';
    code += '		Symbol:      "TKN",\n';
    code += '		Name:        "Example Token",\n';
    code += '		TotalSupply: 1000000,\n';
    code += '		Decimals:    18,\n';
    code += '		OwnerBalance: map[string]int{\n';
    code += '			"Alice": 1000000,\n';
    code += '		},\n';
    code += '	}\n\n';
    
    code += '	tokenJSON, err := json.Marshal(token)\n';
    code += '	if err != nil {\n';
    code += '		return err\n';
    code += '	}\n\n';
    code += '	err = ctx.GetStub().PutState("TOKEN", tokenJSON)\n';
    code += '	if err != nil {\n';
    code += '		return fmt.Errorf("failed to put token to world state: %v", err)\n';
    code += '	}\n';
  }
  
  code += '	return nil\n';
  code += '}\n\n';
  
  // Implement action functions
  const actionNodes = nodes.filter(node => node.type === 'action');
  actionNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const functionName = capitalizeFirstLetter(camelCase(nodeLabel));
    
    if (nodeLabel === 'Deposit') {
      code += '// Deposit allows a user to deposit value\n';
      code += 'func (s *SmartContract) Deposit(ctx contractapi.TransactionContextInterface, id string, amount int) error {\n';
      code += '	// Get the asset\n';
      code += '	asset, err := s.ReadAsset(ctx, id)\n';
      code += '	if err != nil {\n';
      code += '		return err\n';
      code += '	}\n\n';
      code += '	// Add to the asset value\n';
      if (structNodes.length > 0) {
        const valueNode = structNodes.find(n => n.type === "value");
        if (valueNode) {
          const fieldName = capitalizeFirstLetter(camelCase(valueNode.data.label));
          code += `	asset.${fieldName} += amount\n\n`;
        } else {
          code += '	// Increase asset value\n\n';
        }
      }
      code += '	// Update the asset\n';
      code += '	assetJSON, err := json.Marshal(asset)\n';
      code += '	if err != nil {\n';
      code += '		return err\n';
      code += '	}\n\n';
      code += '	return ctx.GetStub().PutState(id, assetJSON)\n';
      code += '}\n\n';
    } else if (nodeLabel === 'Choice') {
      code += '// MakeChoice records a choice for an asset\n';
      code += 'func (s *SmartContract) MakeChoice(ctx contractapi.TransactionContextInterface, id string, choiceID int, choiceValue int) error {\n';
      code += '	// Get the asset\n';
      code += '	exists, err := s.AssetExists(ctx, id)\n';
      code += '	if err != nil {\n';
      code += '		return err\n';
      code += '	}\n';
      code += '	if !exists {\n';
      code += '		return fmt.Errorf("the asset %s does not exist", id)\n';
      code += '	}\n\n';
      code += '	// Record choice in a new key\n';
      code += '	choiceKey := id + "-choice-" + strconv.Itoa(choiceID)\n';
      code += '	return ctx.GetStub().PutState(choiceKey, []byte(strconv.Itoa(choiceValue)))\n';
      code += '}\n\n';
    } else if (nodeLabel === 'Notification') {
      code += '// Notify emits a notification event\n';
      code += 'func (s *SmartContract) Notify(ctx contractapi.TransactionContextInterface, id string, message string) error {\n';
      code += '	// Emit notification event\n';
      code += '	return ctx.GetStub().SetEvent("Notification", []byte(message))\n';
      code += '}\n\n';
    } else {
      code += `// ${functionName} implements the ${nodeLabel} action\n`;
      code += `func (s *SmartContract) ${functionName}(ctx contractapi.TransactionContextInterface, id string) error {\n`;
      code += '	// Get the asset\n';
      code += '	exists, err := s.AssetExists(ctx, id)\n';
      code += '	if err != nil {\n';
      code += '		return err\n';
      code += '	}\n';
      code += '	if !exists {\n';
      code += '		return fmt.Errorf("the asset %s does not exist", id)\n';
      code += '	}\n\n';
      code += `	// Set an event for ${nodeLabel}\n`;
      code += `	return ctx.GetStub().SetEvent("${nodeLabel}", []byte(id))\n`;
      code += '}\n\n';
    }
  });
  
  // Token related functions
  if (tokenNodes.length > 0) {
    code += '// TransferTokens transfers tokens between accounts\n';
    code += 'func (s *SmartContract) TransferTokens(ctx contractapi.TransactionContextInterface, from string, to string, amount int) error {\n';
    code += '	// Get token\n';
    code += '	tokenJSON, err := ctx.GetStub().GetState("TOKEN")\n';
    code += '	if err != nil {\n';
    code += '		return fmt.Errorf("failed to read from world state: %v", err)\n';
    code += '	}\n';
    code += '	if tokenJSON == nil {\n';
    code += '		return fmt.Errorf("token does not exist")\n';
    code += '	}\n\n';
    code += '	var token Token\n';
    code += '	err = json.Unmarshal(tokenJSON, &token)\n';
    code += '	if err != nil {\n';
    code += '		return err\n';
    code += '	}\n\n';
    code += '	// Check if from has enough balance\n';
    code += '	if token.OwnerBalance[from] < amount {\n';
    code += '		return fmt.Errorf("insufficient balance")\n';
    code += '	}\n\n';
    code += '	// Transfer tokens\n';
    code += '	token.OwnerBalance[from] -= amount\n';
    code += '	token.OwnerBalance[to] += amount\n\n';
    code += '	// Update token in world state\n';
    code += '	tokenJSON, err = json.Marshal(token)\n';
    code += '	if err != nil {\n';
    code += '		return err\n';
    code += '	}\n\n';
    code += '	return ctx.GetStub().PutState("TOKEN", tokenJSON)\n';
    code += '}\n\n';
    
    code += '// MintTokens creates new tokens\n';
    code += 'func (s *SmartContract) MintTokens(ctx contractapi.TransactionContextInterface, to string, amount int) error {\n';
    code += '	// Get token\n';
    code += '	tokenJSON, err := ctx.GetStub().GetState("TOKEN")\n';
    code += '	if err != nil {\n';
    code += '		return fmt.Errorf("failed to read from world state: %v", err)\n';
    code += '	}\n';
    code += '	if tokenJSON == nil {\n';
    code += '		return fmt.Errorf("token does not exist")\n';
    code += '	}\n\n';
    code += '	var token Token\n';
    code += '	err = json.Unmarshal(tokenJSON, &token)\n';
    code += '	if err != nil {\n';
    code += '		return err\n';
    code += '	}\n\n';
    code += '	// Mint tokens\n';
    code += '	token.TotalSupply += amount\n';
    code += '	token.OwnerBalance[to] += amount\n\n';
    code += '	// Update token in world state\n';
    code += '	tokenJSON, err = json.Marshal(token)\n';
    code += '	if err != nil {\n';
    code += '		return err\n';
    code += '	}\n\n';
    code += '	return ctx.GetStub().PutState("TOKEN", tokenJSON)\n';
    code += '}\n\n';
  }
  
  // Add utility functions
  if (structNodes.length > 0) {
    code += '// ReadAsset returns the asset stored in the world state with given id\n';
    code += 'func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {\n';
    code += '	assetJSON, err := ctx.GetStub().GetState(id)\n';
    code += '	if err != nil {\n';
    code += '		return nil, fmt.Errorf("failed to read from world state: %v", err)\n';
    code += '	}\n';
    code += '	if assetJSON == nil {\n';
    code += '		return nil, fmt.Errorf("the asset %s does not exist", id)\n';
    code += '	}\n\n';
    code += '	var asset Asset\n';
    code += '	err = json.Unmarshal(assetJSON, &asset)\n';
    code += '	if err != nil {\n';
    code += '		return nil, err\n';
    code += '	}\n\n';
    code += '	return &asset, nil\n';
    code += '}\n\n';
    
    code += '// AssetExists returns true when asset with given ID exists in world state\n';
    code += 'func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {\n';
    code += '	assetJSON, err := ctx.GetStub().GetState(id)\n';
    code += '	if err != nil {\n';
    code += '		return false, fmt.Errorf("failed to read from world state: %v", err)\n';
    code += '	}\n\n';
    code += '	return assetJSON != nil, nil\n';
    code += '}\n\n';
  }
  
  // Main function
  code += 'func main() {\n';
  code += '	chaincode, err := contractapi.NewChaincode(&SmartContract{})\n';
  code += '	if err != nil {\n';
  code += '		fmt.Printf("Error creating smart contract: %s", err.Error())\n';
  code += '		return\n';
  code += '	}\n\n';
  code += '	if err := chaincode.Start(); err != nil {\n';
  code += '		fmt.Printf("Error starting smart contract: %s", err.Error())\n';
  code += '	}\n';
  code += '}';
  
  return code;
};

// Generate Vyper code
export const generateVyperCode = (nodes: any[], edges: any[]) => {
  let code = '# @version ^0.3.0\n\n';
  
  // Define events
  const actionNodes = nodes.filter(node => node.type === 'action');
  if (actionNodes.length > 0) {
    code += '# Events\n';
    actionNodes.forEach(node => {
      const nodeLabel = node.data.label as string;
      if (nodeLabel === 'Deposit') {
        code += 'event Deposit:\n';
        code += '    sender: indexed(address)\n';
        code += '    amount: uint256\n\n';
      } else if (nodeLabel === 'Choice') {
        code += 'event Choice:\n';
        code += '    sender: indexed(address)\n';
        code += '    choice_id: uint256\n';
        code += '    choice_value: uint256\n\n';
      } else if (nodeLabel === 'Notification') {
        code += 'event Notification:\n';
        code += '    sender: indexed(address)\n';
        code += '    message: String[100]\n\n';
      } else {
        code += `event ${capitalizeFirstLetter(nodeLabel)}:\n`;
        code += '    sender: indexed(address)\n\n';
      }
    });
  }
  
  // Token events if needed
  const tokenNodes = nodes.filter(node => node.type === 'token');
  if (tokenNodes.length > 0) {
    code += '# Token events\n';
    code += 'event Transfer:\n';
    code += '    sender: indexed(address)\n';
    code += '    receiver: indexed(address)\n';
    code += '    amount: uint256\n\n';
    
    code += 'event Approval:\n';
    code += '    owner: indexed(address)\n';
    code += '    spender: indexed(address)\n';
    code += '    amount: uint256\n\n';
  }
  
  // Define storage variables
  code += '# Storage variables\n';
  
  const structNodes = nodes.filter(node => node.type === 'value' || node.type === 'bound');
  structNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const variableName = snakeCase(nodeLabel);
    code += `${variableName}: public(uint256)\n`;
  });
  
  if (tokenNodes.length > 0) {
    code += '\n# Token storage variables\n';
    code += 'name: public(String[32])\n';
    code += 'symbol: public(String[8])\n';
    code += 'decimals: public(uint8)\n';
    code += 'totalSupply: public(uint256)\n';
    code += 'balanceOf: public(HashMap[address, uint256])\n';
    code += 'allowance: public(HashMap[address, HashMap[address, uint256]])\n';
  }
  
  const relationships = identifyRelationships(nodes, edges);
  if (relationships.oneToMany.length > 0) {
    code += '\n# One-to-many relationships\n';
    code += 'relationships: HashMap[address, DynArray[address, 100]]\n';
  }
  
  // Initialize function
  code += '\n@external\ndef __init__():\n';
  
  structNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const variableName = snakeCase(nodeLabel);
    code += `    self.${variableName} = 0\n`;
  });
  
  if (tokenNodes.length > 0) {
    code += '\n    # Initialize token\n';
    code += '    self.name = "Example Token"\n';
    code += '    self.symbol = "EXTKN"\n';
    code += '    self.decimals = 18\n';
    code += '    self.totalSupply = 0\n';
  }
  
  code += '\n';
  
  // Implement functions for action nodes
  actionNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const functionName = snakeCase(nodeLabel);
    
    if (nodeLabel === 'Deposit') {
      code += '@external\n';
      code += '@payable\n';
      code += 'def deposit():\n';
      code += '    assert msg.value > 0, "Amount must be greater than 0"\n';
      code += '    log Deposit(msg.sender, msg.value)\n\n';
    } else if (nodeLabel === 'Choice') {
      code += '@external\n';
      code += 'def make_choice(choice_id: uint256, choice_value: uint256):\n';
      code += '    log Choice(msg.sender, choice_id, choice_value)\n\n';
    } else if (nodeLabel === 'Notification') {
      code += '@external\n';
      code += 'def notify(message: String[100]):\n';
      code += '    log Notification(msg.sender, message)\n\n';
    } else {
      code += '@external\n';
      code += `def ${functionName}():\n`;
      code += `    log ${capitalizeFirstLetter(nodeLabel)}(msg.sender)\n\n`;
    }
  });
  
  // Token functions if needed
  if (tokenNodes.length > 0) {
    code += '# Token functions\n';
    code += '@external\n';
    code += 'def transfer(to: address, amount: uint256) -> bool:\n';
    code += '    assert self.balanceOf[msg.sender] >= amount, "Insufficient balance"\n';
    code += '    self.balanceOf[msg.sender] -= amount\n';
    code += '    self.balanceOf[to] += amount\n';
    code += '    log Transfer(msg.sender, to, amount)\n';
    code += '    return True\n\n';
    
    code += '@external\n';
    code += 'def approve(spender: address, amount: uint256) -> bool:\n';
    code += '    self.allowance[msg.sender][spender] = amount\n';
    code += '    log Approval(msg.sender, spender, amount)\n';
    code += '    return True\n\n';
    
    code += '@external\n';
    code += 'def transferFrom(sender: address, recipient: address, amount: uint256) -> bool:\n';
    code += '    assert self.balanceOf[sender] >= amount, "Insufficient balance"\n';
    code += '    assert self.allowance[sender][msg.sender] >= amount, "Insufficient allowance"\n';
    code += '    self.balanceOf[sender] -= amount\n';
    code += '    self.balanceOf[recipient] += amount\n';
    code += '    self.allowance[sender][msg.sender] -= amount\n';
    code += '    log Transfer(sender, recipient, amount)\n';
    code += '    return True\n\n';
    
    code += '@external\n';
    code += 'def mint(to: address, amount: uint256):\n';
    code += '    # Add appropriate access control\n';
    code += '    self.totalSupply += amount\n';
    code += '    self.balanceOf[to] += amount\n';
    code += '    log Transfer(ZERO_ADDRESS, to, amount)\n\n';
    
    code += '@external\n';
    code += 'def burn(amount: uint256):\n';
    code += '    assert self.balanceOf[msg.sender] >= amount, "Insufficient balance"\n';
    code += '    self.balanceOf[msg.sender] -= amount\n';
    code += '    self.totalSupply -= amount\n';
    code += '    log Transfer(msg.sender, ZERO_ADDRESS, amount)\n';
  }
  
  return code;
};

// Generate TypeScript code (for Ethereum with ethers.js)
export const generateTypescriptCode = (nodes: any[], edges: any[]) => {
  let code = '// Smart Contract in TypeScript for Ethereum using ethers.js\n';
  code += 'import { ethers } from "ethers";\n\n';
  
  // Define contract interface based on actions
  const actionNodes = nodes.filter(node => node.type === 'action');
  if (actionNodes.length > 0) {
    code += 'export interface ContractInterface {\n';
    actionNodes.forEach(node => {
      const nodeLabel = node.data.label as string;
      const functionName = camelCase(nodeLabel);
      
      if (nodeLabel === 'Deposit') {
        code += '  deposit(amount: ethers.BigNumber): Promise<ethers.ContractTransaction>;\n';
      } else if (nodeLabel === 'Choice') {
        code += '  makeChoice(choiceId: ethers.BigNumber, choiceValue: ethers.BigNumber): Promise<ethers.ContractTransaction>;\n';
      } else if (nodeLabel === 'Notification') {
        code += '  notify(message: string): Promise<ethers.ContractTransaction>;\n';
      } else {
        code += `  ${functionName}(): Promise<ethers.ContractTransaction>;\n`;
      }
    });
    
    // Add token methods if needed
    const tokenNodes = nodes.filter(node => node.type === 'token');
    if (tokenNodes.length > 0) {
      code += '  // Token methods\n';
      code += '  name(): Promise<string>;\n';
      code += '  symbol(): Promise<string>;\n';
      code += '  decimals(): Promise<number>;\n';
      code += '  totalSupply(): Promise<ethers.BigNumber>;\n';
      code += '  balanceOf(account: string): Promise<ethers.BigNumber>;\n';
      code += '  transfer(to: string, amount: ethers.BigNumber): Promise<ethers.ContractTransaction>;\n';
      code += '  allowance(owner: string, spender: string): Promise<ethers.BigNumber>;\n';
      code += '  approve(spender: string, amount: ethers.BigNumber): Promise<ethers.ContractTransaction>;\n';
      code += '  transferFrom(from: string, to: string, amount: ethers.BigNumber): Promise<ethers.ContractTransaction>;\n';
    }
    
    code += '}\n\n';
  }
  
  // Define contract events interface
  code += 'export interface ContractEvents {\n';
  actionNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const eventName = capitalizeFirstLetter(nodeLabel);
    
    if (nodeLabel === 'Deposit') {
      code += `  ${eventName}: (from: string, amount: ethers.BigNumber) => void;\n`;
    } else if (nodeLabel === 'Choice') {
      code += `  ${eventName}: (from: string, choiceId: ethers.BigNumber, choiceValue: ethers.BigNumber) => void;\n`;
    } else if (nodeLabel === 'Notification') {
      code += `  ${eventName}: (from: string, message: string) => void;\n`;
    } else {
      code += `  ${eventName}: (from: string) => void;\n`;
    }
  });
  
  // Add token events if needed
  const tokenNodes = nodes.filter(node => node.type === 'token');
  if (tokenNodes.length > 0) {
    code += '  // Token events\n';
    code += '  Transfer: (from: string, to: string, value: ethers.BigNumber) => void;\n';
    code += '  Approval: (owner: string, spender: string, value: ethers.BigNumber) => void;\n';
  }
  
  code += '}\n\n';
  
  // Create contract factory class
  code += 'export class SmartContractFactory {\n';
  code += '  private static _abi: string[] = [\n';
  
  // Generate basic ABI
  actionNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const functionName = camelCase(nodeLabel);
    
    if (nodeLabel === 'Deposit') {
      code += '    "function deposit() payable",\n';
      code += '    "event Deposit(address indexed from, uint256 amount)",\n';
    } else if (nodeLabel === 'Choice') {
      code += '    "function makeChoice(uint256 choiceId, uint256 choiceValue)",\n';
      code += '    "event Choice(address indexed from, uint256 choiceId, uint256 choiceValue)",\n';
    } else if (nodeLabel === 'Notification') {
      code += '    "function notify(string message)",\n';
      code += '    "event Notification(address indexed from, string message)",\n';
    } else {
      code += `    "function ${functionName}()",\n`;
      code += `    "event ${capitalizeFirstLetter(nodeLabel)}(address indexed from)",\n`;
    }
  });
  
  // Add token ABI if needed
  if (tokenNodes.length > 0) {
    code += '    // Token ABI\n';
    code += '    "function name() view returns (string)",\n';
    code += '    "function symbol() view returns (string)",\n';
    code += '    "function decimals() view returns (uint8)",\n';
    code += '    "function totalSupply() view returns (uint256)",\n';
    code += '    "function balanceOf(address owner) view returns (uint256)",\n';
    code += '    "function transfer(address to, uint256 amount) returns (bool)",\n';
    code += '    "function allowance(address owner, address spender) view returns (uint256)",\n';
    code += '    "function approve(address spender, uint256 amount) returns (bool)",\n';
    code += '    "function transferFrom(address from, address to, uint256 amount) returns (bool)",\n';
    code += '    "event Transfer(address indexed from, address indexed to, uint256 value)",\n';
    code += '    "event Approval(address indexed owner, address indexed spender, uint256 value)",\n';
  }
  
  code += '  ];\n\n';
  
  // Add bytecode for deployment
  code += '  private static _bytecode = "0x...";\n\n';
  
  // Create connect method
  code += '  public static connect(address: string, signerOrProvider: ethers.Signer | ethers.providers.Provider): SmartContract {\n';
  code += '    return new ethers.Contract(address, this._abi, signerOrProvider) as SmartContract;\n';
  code += '  }\n\n';
  
  // Create deploy method
  code += '  public static async deploy(signer: ethers.Signer): Promise<SmartContract> {\n';
  code += '    const factory = new ethers.ContractFactory(this._abi, this._bytecode, signer);\n';
  code += '    const contract = await factory.deploy() as SmartContract;\n';
  code += '    await contract.deployed();\n';
  code += '    return contract;\n';
  code += '  }\n';
  code += '}\n\n';
  
  // Create class for main contract type
  code += 'export type SmartContract = ethers.Contract & ContractInterface;\n\n';
  
  // Add usage example
  code += '// Usage example:\n';
  code += 'async function example() {\n';
  code += '  // Connect to provider\n';
  code += '  const provider = new ethers.providers.Web3Provider(window.ethereum);\n';
  code += '  await provider.send("eth_requestAccounts", []);\n';
  code += '  const signer = provider.getSigner();\n\n';
  
  code += '  // Deploy a new contract\n';
  code += '  const contract = await SmartContractFactory.deploy(signer);\n';
  code += '  console.log(`Contract deployed at: ${contract.address}`);\n\n';
  
  // Example function calls
  if (actionNodes.length > 0) {
    code += '  // Example function calls\n';
    const exampleNode = actionNodes[0];
    const exampleLabel = exampleNode.data.label;
    const exampleFunction = camelCase(exampleLabel);
    
    if (exampleLabel === 'Deposit') {
      code += '  // Deposit 1 ETH\n';
      code += '  const tx = await contract.deposit({ value: ethers.utils.parseEther("1") });\n';
      code += '  await tx.wait();\n';
    } else if (exampleLabel === 'Choice') {
      code += '  // Make a choice\n';
      code += '  const tx = await contract.makeChoice(1, 42);\n';
      code += '  await tx.wait();\n';
    } else if (exampleLabel === 'Notification') {
      code += '  // Send a notification\n';
      code += '  const tx = await contract.notify("Hello, blockchain!");\n';
      code += '  await tx.wait();\n';
    } else {
      code += `  // Call ${exampleLabel}\n`;
      code += `  const tx = await contract.${exampleFunction}();\n`;
      code += '  await tx.wait();\n';
    }
  }
  
  // Listen for events example
  code += '\n  // Listen for events\n';
  code += '  contract.on("Deposit", (from, amount) => {\n';
  code += '    console.log(`Deposit received from ${from}: ${ethers.utils.formatEther(amount)} ETH`);\n';
  code += '  });\n';
  
  code += '}\n';
  
  return code;
};

// Generate JavaScript code
export const generateJavascriptCode = (nodes: any[], edges: any[]) => {
  let code = '// Smart Contract in JavaScript for Ethereum using web3.js\n';
  code += 'const Web3 = require("web3");\n\n';
  
  // Contract ABI based on nodes
  code += 'class SmartContractManager {\n';
  code += '  constructor(provider) {\n';
  code += '    this.web3 = new Web3(provider || "http://localhost:8545");\n';
  code += '    this.abi = [\n';
  
  // Define ABI
  const actionNodes = nodes.filter(node => node.type === 'action');
  actionNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const functionName = camelCase(nodeLabel);
    
    code += '      {\n';
    
    if (nodeLabel === 'Deposit') {
      code += '        "name": "deposit",\n';
      code += '        "type": "function",\n';
      code += '        "inputs": [],\n';
      code += '        "outputs": [],\n';
      code += '        "stateMutability": "payable"\n';
    } else if (nodeLabel === 'Choice') {
      code += '        "name": "makeChoice",\n';
      code += '        "type": "function",\n';
      code += '        "inputs": [\n';
      code += '          { "name": "choiceId", "type": "uint256" },\n';
      code += '          { "name": "choiceValue", "type": "uint256" }\n';
      code += '        ],\n';
      code += '        "outputs": [],\n';
      code += '        "stateMutability": "nonpayable"\n';
    } else if (nodeLabel === 'Notification') {
      code += '        "name": "notify",\n';
      code += '        "type": "function",\n';
      code += '        "inputs": [\n';
      code += '          { "name": "message", "type": "string" }\n';
      code += '        ],\n';
      code += '        "outputs": [],\n';
      code += '        "stateMutability": "nonpayable"\n';
    } else {
      code += `        "name": "${functionName}",\n`;
      code += '        "type": "function",\n';
      code += '        "inputs": [],\n';
      code += '        "outputs": [],\n';
      code += '        "stateMutability": "nonpayable"\n';
    }
    
    code += '      },\n';
  });
  
  // Add event definitions to ABI
  actionNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const eventName = capitalizeFirstLetter(nodeLabel);
    
    code += '      {\n';
    code += `        "name": "${eventName}",\n`;
    code += '        "type": "event",\n';
    code += '        "inputs": [\n';
    code += '          { "name": "from", "type": "address", "indexed": true }';
    
    if (nodeLabel === 'Deposit') {
      code += ',\n          { "name": "amount", "type": "uint256", "indexed": false }\n';
    } else if (nodeLabel === 'Choice') {
      code += ',\n          { "name": "choiceId", "type": "uint256", "indexed": false },\n';
      code += '          { "name": "choiceValue", "type": "uint256", "indexed": false }\n';
    } else if (nodeLabel === 'Notification') {
      code += ',\n          { "name": "message", "type": "string", "indexed": false }\n';
    } else {
      code += '\n';
    }
    
    code += '        ],\n';
    code += '        "anonymous": false\n';
    code += '      },\n';
  });
  
  // Add token related ABI if needed
  const tokenNodes = nodes.filter(node => node.type === 'token');
  if (tokenNodes.length > 0) {
    code += '      // Token ABI\n';
    code += '      { "name": "transfer", "type": "function", "inputs": [{ "name": "to", "type": "address" }, { "name": "amount", "type": "uint256" }], "outputs": [{ "name": "", "type": "bool" }], "stateMutability": "nonpayable" },\n';
    code += '      { "name": "approve", "type": "function", "inputs": [{ "name": "spender", "type": "address" }, { "name": "amount", "type": "uint256" }], "outputs": [{ "name": "", "type": "bool" }], "stateMutability": "nonpayable" },\n';
    code += '      { "name": "transferFrom", "type": "function", "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "amount", "type": "uint256" }], "outputs": [{ "name": "", "type": "bool" }], "stateMutability": "nonpayable" },\n';
    code += '      { "name": "Transfer", "type": "event", "inputs": [{ "name": "from", "type": "address", "indexed": true }, { "name": "to", "type": "address", "indexed": true }, { "name": "value", "type": "uint256", "indexed": false }], "anonymous": false },\n';
    code += '      { "name": "Approval", "type": "event", "inputs": [{ "name": "owner", "type": "address", "indexed": true }, { "name": "spender", "type": "address", "indexed": true }, { "name": "value", "type": "uint256", "indexed": false }], "anonymous": false },\n';
  }
  
  code += '    ];\n';
  
  // Add contract bytecode
  code += '    this.bytecode = "0x...";\n';
  code += '  }\n\n';
  
  // Connect to existing contract
  code += '  connect(contractAddress) {\n';
  code += '    this.contract = new this.web3.eth.Contract(this.abi, contractAddress);\n';
  code += '    return this.contract;\n';
  code += '  }\n\n';
  
  // Deploy new contract
  code += '  async deploy(fromAddress) {\n';
  code += '    const deployTx = new this.web3.eth.Contract(this.abi)\n';
  code += '      .deploy({ data: this.bytecode })\n';
  code += '      .encodeABI();\n\n';
  
  code += '    const gas = await this.web3.eth.estimateGas({\n';
  code += '      from: fromAddress,\n';
  code += '      data: deployTx\n';
  code += '    });\n\n';
  
  code += '    const deployedContract = await new this.web3.eth.Contract(this.abi)\n';
  code += '      .deploy({ data: this.bytecode })\n';
  code += '      .send({\n';
  code += '        from: fromAddress,\n';
  code += '        gas\n';
  code += '      });\n\n';
  
  code += '    this.contract = deployedContract;\n';
  code += '    return this.contract;\n';
  code += '  }\n\n';
  
  // Helper functions for interacting with the contract
  code += '  // Helper methods\n';
  actionNodes.forEach(node => {
    const nodeLabel = node.data.label as string;
    const functionName = camelCase(nodeLabel);
    
    if (nodeLabel === 'Deposit') {
      code += '  async deposit(fromAddress, amount) {\n';
      code += '    return this.contract.methods.deposit().send({\n';
      code += '      from: fromAddress,\n';
      code += '      value: this.web3.utils.toWei(amount.toString(), "ether")\n';
      code += '    });\n';
      code += '  }\n\n';
    } else if (nodeLabel === 'Choice') {
      code += '  async makeChoice(fromAddress, choiceId, choiceValue) {\n';
      code += '    return this.contract.methods.makeChoice(choiceId, choiceValue).send({\n';
      code += '      from: fromAddress\n';
      code += '    });\n';
      code += '  }\n\n';
    } else if (nodeLabel === 'Notification') {
      code += '  async notify(fromAddress, message) {\n';
      code += '    return this.contract.methods.notify(message).send({\n';
      code += '      from: fromAddress\n';
      code += '    });\n';
      code += '  }\n\n';
    } else {
      code += `  async ${functionName}(fromAddress) {\n`;
      code += `    return this.contract.methods.${functionName}().send({\n`;
      code += '      from: fromAddress\n';
      code += '    });\n';
      code += '  }\n\n';
    }
  });
  
  // Add token helper functions if needed
  if (tokenNodes.length > 0) {
    code += '  // Token helper methods\n';
    code += '  async transfer(fromAddress, toAddress, amount) {\n';
    code += '    return this.contract.methods.transfer(toAddress, amount).send({\n';
    code += '      from: fromAddress\n';
    code += '    });\n';
    code += '  }\n\n';
    
    code += '  async approve(fromAddress, spenderAddress, amount) {\n';
    code += '    return this.contract.methods.approve(spenderAddress, amount).send({\n';
    code += '      from: fromAddress\n';
    code += '    });\n';
    code += '  }\n\n';
    
    code += '  async transferFrom(fromAddress, senderAddress, receiverAddress, amount) {\n';
    code += '    return this.contract.methods.transferFrom(senderAddress, receiverAddress, amount).send({\n';
    code += '      from: fromAddress\n';
    code += '    });\n';
    code += '  }\n';
  }
  
  code += '}\n\n';
  
  // Usage example
  code += '// Usage example\n';
  code += 'async function example() {\n';
  code += '  // Connect to Web3 provider\n';
  code += '  const web3Provider = window.ethereum || "http://localhost:8545";\n';
  code += '  const smartContractManager = new SmartContractManager(web3Provider);\n\n';
  
  code += '  // Get accounts\n';
  code += '  if (window.ethereum) {\n';
  code += '    await window.ethereum.enable();\n';
  code += '  }\n';
  code += '  const accounts = await smartContractManager.web3.eth.getAccounts();\n';
  code += '  const fromAddress = accounts[0];\n\n';
  
  code += '  // Deploy the contract\n';
  code += '  const contract = await smartContractManager.deploy(fromAddress);\n';
  code += '  console.log(`Contract deployed at: ${contract.options.address}`);\n\n';
  
  // Example function call
  if (actionNodes.length > 0) {
    const exampleNode = actionNodes[0];
    const exampleLabel = exampleNode.data.label;
    const exampleFunction = camelCase(exampleLabel);
    
    code += '  try {\n';
    
    if (exampleLabel === 'Deposit') {
      code += '    // Deposit 1 ETH\n';
      code += '    const receipt = await smartContractManager.deposit(fromAddress, 1);\n';
    } else if (exampleLabel === 'Choice') {
      code += '    // Make a choice\n';
      code += '    const receipt = await smartContractManager.makeChoice(fromAddress, 1, 42);\n';
    } else if (exampleLabel === 'Notification') {
      code += '    // Send a notification\n';
      code += '    const receipt = await smartContractManager.notify(fromAddress, "Hello, blockchain!");\n';
    } else {
      code += `    // Call ${exampleLabel}\n`;
      code += `    const receipt = await smartContractManager.${exampleFunction}(fromAddress);\n`;
    }
    
    code += '    console.log("Transaction receipt:", receipt);\n';
    code += '  } catch (error) {\n';
    code += '    console.error("Error:", error);\n';
    code += '  }\n\n';
  }
  
  // Event listening example
  code += '  // Listen for events\n';
  code += '  contract.events.Deposit({\n';
  code += '    fromBlock: "latest"\n';
  code += '  }, (error, event) => {\n';
  code += '    if (error) {\n';
  code += '      console.error("Error on event:", error);\n';
  code += '      return;\n';
  code += '    }\n';
  code += '    console.log("Deposit event:", event.returnValues);\n';
  code += '  });\n';
  code += '}\n\n';
  
  code += '// Execute example\n';
  code += 'example().catch(console.error);\n';
  
  return code;
};

// Main code generator function
export const generateCodeForLanguage = (language: string, nodes: any[], edges: any[]) => {
  switch (language) {
    case 'move':
      return generateMoveCode(nodes, edges);
    case 'solidity':
      return generateSolidityCode(nodes, edges);
    case 'rust':
      return generateRustCode(nodes, edges);
    case 'go':
      return generateGoCode(nodes, edges);
    case 'vyper':
      return generateVyperCode(nodes, edges);
    case 'typescript':
      return generateTypescriptCode(nodes, edges);
    case 'javascript':
      return generateJavascriptCode(nodes, edges);
    default:
      return generateMoveCode(nodes, edges); // Default to Move
  }
};
