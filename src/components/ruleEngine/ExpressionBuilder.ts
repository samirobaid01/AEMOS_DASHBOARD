// ExpressionBuilder.ts

export type Operator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not in';

export interface Condition {
  type: 'condition';
  sourceType: 'sensor' | 'device';
  uuid: string;
  key: string;
  operator: Operator;
  value: string | number | boolean | Array<string | number>;
}

export interface ConditionGroup {
  type: 'group';
  operator: 'AND' | 'OR';
  children: Array<Condition | ConditionGroup>;
}

export type ExpressionNode = Condition | ConditionGroup;

export class ExpressionBuilder {
  private root: ConditionGroup;

  constructor(initial?: ExpressionNode) {
    this.root = this.ensureGroup(initial ?? this.defaultGroup());
  }

  private ensureGroup(node: ExpressionNode): ConditionGroup {
    return node.type === 'group' ? node : this.defaultGroup([node]);
  }

  private defaultGroup(children: (Condition | ConditionGroup)[] = []): ConditionGroup {
    return {
      type: 'group',
      operator: 'AND',
      children,
    };
  }

  public getExpression(): ConditionGroup {
    return this.root;
  }

  public addCondition(condition: Condition, groupPath: number[] = []): void {
    const group = this.findGroupByPath(groupPath);
    group.children.push(condition);
  }

  public addGroup(operator: 'AND' | 'OR', groupPath: number[] = []): void {
    const parent = this.findGroupByPath(groupPath);
    const newGroup: ConditionGroup = this.defaultGroup();
    newGroup.operator = operator;
    parent.children.push(newGroup);
  }

  public removeNode(path: number[]): boolean {
    if (path.length === 0) return false;

    const parentPath = path.slice(0, -1);
    const index = path[path.length - 1];
    const parent = this.findGroupByPath(parentPath);

    if (parent && index >= 0 && index < parent.children.length) {
      parent.children.splice(index, 1);
      return true;
    }

    return false;
  }

  public updateCondition(path: number[], updated: Partial<Condition>): boolean {
    const node = this.getNodeByPath(path);
    if (node?.type === 'condition') {
      Object.assign(node, updated);
      return true;
    }
    return false;
  }

  public updateGroupOperator(path: number[], newOperator: 'AND' | 'OR'): boolean {
    const group = this.getNodeByPath(path);
    if (group?.type === 'group') {
      group.operator = newOperator;
      return true;
    }
    return false;
  }

  public getNodeByPath(path: number[]): ExpressionNode | null {
    let node: ExpressionNode = this.root;
    for (const index of path) {
      if (node.type !== 'group' || index >= node.children.length) return null;
      node = node.children[index];
    }
    return node;
  }

  private findGroupByPath(path: number[]): ConditionGroup {
    let node: ExpressionNode = this.root;
    for (const index of path) {
      if (node.type !== 'group') throw new Error('Invalid path to group');
      node = node.children[index];
    }
    if (node.type !== 'group') throw new Error('Resolved node is not a group');
    return node;
  }

  public toJSON(): string {
    return JSON.stringify(this.root, null, 2);
  }

  public static fromJSON(json: string): ExpressionBuilder {
    const parsed = JSON.parse(json) as ExpressionNode;
    return new ExpressionBuilder(parsed);
  }
}
