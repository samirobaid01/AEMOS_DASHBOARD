export interface RuleNode {
  id: number;
  ruleChainId: number;
  type: 'filter' | 'action';
  name: string;
  config: string;
  nextNodeId: number | null;
}

export interface RuleChain {
  id: number;
  organizationId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  nodes: RuleNode[];
}

export interface RuleChainCreatePayload {
  name: string;
  description: string;
  organizationId: number;
}

export interface RuleChainUpdatePayload extends Partial<RuleChainCreatePayload> {
  organizationId: number;
}

export interface RuleEngineState {
  rules: RuleChain[];
  selectedRule: RuleChain | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
  };
} 