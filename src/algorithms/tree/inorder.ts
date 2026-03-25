import { AlgorithmResult, OperationType } from '../../types/AlgorithmState';
import { generateRandomBST, TreeData } from './shared';

export const generateInorderStates = (size: number): AlgorithmResult<TreeData> => {
  const { nodes, root } = generateRandomBST(size);
  const states: AlgorithmResult<TreeData>['states'] = [];
  
  if (root === null) return { states, timeComplexity: 'O(N)', spaceComplexity: 'O(N)' };

  const visited: number[] = [];
  const currentPath: number[] = [];

  const traverse = (nodeId: number | null) => {
    if (nodeId === null) return;
    
    currentPath.push(nodeId);
    states.push({
      data: { algorithm: 'inorder', nodes, root, current: nodeId, visited: [...visited], path: [...currentPath] },
      activeIndices: [nodeId],
      operationType: OperationType.VISIT,
      metadata: { message: `Traversing down to ${nodes[nodeId].value} (Inorder: Left -> Node -> Right)`, stepNumber: states.length }
    });

    traverse(nodes[nodeId].left);
    
    states.push({
      data: { algorithm: 'inorder', nodes, root, current: nodeId, visited: [...visited], path: [...currentPath] },
      activeIndices: [nodeId],
      operationType: OperationType.COMPARE,
      metadata: { message: `Visiting Node ${nodes[nodeId].value}`, stepNumber: states.length }
    });

    visited.push(nodeId);
    states.push({
      data: { algorithm: 'inorder', nodes, root, current: nodeId, visited: [...visited], path: [...currentPath] },
      activeIndices: [...visited],
      operationType: OperationType.OVERWRITE,
      metadata: { message: `Processed Node ${nodes[nodeId].value}`, stepNumber: states.length }
    });

    traverse(nodes[nodeId].right);
    
    currentPath.pop();
  };

  traverse(root);

  states.push({
    data: { algorithm: 'inorder', nodes, root, current: null, visited: [...visited], path: [] },
    activeIndices: [...visited],
    operationType: OperationType.DONE,
    metadata: { message: `Inorder Traversal Complete. Output: ${visited.map(id => nodes[id].value).join(' -> ')}`, stepNumber: states.length }
  });

  return { states, timeComplexity: 'O(N)', spaceComplexity: 'O(N)' };
};
