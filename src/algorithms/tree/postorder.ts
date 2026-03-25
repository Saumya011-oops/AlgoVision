import { AlgorithmResult, OperationType } from '../../types/AlgorithmState';
import { generateRandomBST, TreeData } from './shared';

export const generatePostorderStates = (size: number): AlgorithmResult<TreeData> => {
  const { nodes, root } = generateRandomBST(size);
  const states: AlgorithmResult<TreeData>['states'] = [];
  
  if (root === null) return { states, timeComplexity: 'O(N)', spaceComplexity: 'O(N)' };

  const visited: number[] = [];
  const currentPath: number[] = [];

  const traverse = (nodeId: number | null) => {
    if (nodeId === null) return;
    
    currentPath.push(nodeId);
    states.push({
      data: { algorithm: 'postorder', nodes, root, current: nodeId, visited: [...visited], path: [...currentPath] },
      activeIndices: [nodeId],
      operationType: OperationType.VISIT,
      metadata: { message: `Traversing down to ${nodes[nodeId].value} (Postorder: Left -> Right -> Node)`, stepNumber: states.length }
    });

    traverse(nodes[nodeId].left);
    traverse(nodes[nodeId].right);
    
    states.push({
      data: { algorithm: 'postorder', nodes, root, current: nodeId, visited: [...visited], path: [...currentPath] },
      activeIndices: [nodeId],
      operationType: OperationType.COMPARE,
      metadata: { message: `Visiting Node ${nodes[nodeId].value}`, stepNumber: states.length }
    });

    visited.push(nodeId);
    states.push({
      data: { algorithm: 'postorder', nodes, root, current: nodeId, visited: [...visited], path: [...currentPath] },
      activeIndices: [...visited],
      operationType: OperationType.OVERWRITE,
      metadata: { message: `Processed Node ${nodes[nodeId].value}`, stepNumber: states.length }
    });

    currentPath.pop();
  };

  traverse(root);

  states.push({
    data: { algorithm: 'postorder', nodes, root, current: null, visited: [...visited], path: [] },
    activeIndices: [...visited],
    operationType: OperationType.DONE,
    metadata: { message: `Postorder Traversal Complete. Output: ${visited.map(id => nodes[id].value).join(' -> ')}`, stepNumber: states.length }
  });

  return { states, timeComplexity: 'O(N)', spaceComplexity: 'O(N)' };
};
