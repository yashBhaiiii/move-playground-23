
import RoleNode from './RoleNode';
import ActionNode from './ActionNode';
import ContractNode from './ContractNode';
import ObservationNode from './ObservationNode';
import ValueNode from './ValueNode';
import BoundNode from './BoundNode';
import TokenNode from './TokenNode';
import PartyNode from './PartyNode';
import PayeeNode from './PayeeNode';

export const nodeTypes = {
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

export {
  RoleNode,
  ActionNode,
  ContractNode,
  ObservationNode,
  ValueNode,
  BoundNode,
  TokenNode,
  PartyNode,
  PayeeNode
};
