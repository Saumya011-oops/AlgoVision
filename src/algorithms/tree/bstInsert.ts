import { AlgorithmResult, OperationType } from '../../types/AlgorithmState';
import { TreeData, TreeNode } from './shared';

export const generateBSTInsertStates = (values: number[]): AlgorithmResult<TreeData> => {
  const states: AlgorithmResult<TreeData>['states'] = [];
  
  if (values.length === 0) return { states, timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)' };

  // 1. Build the full tree to compute final coordinates
  const finalNodes: TreeNode[] = [];
  let finalRoot: number | null = null;
  const insertTemp = (val: number) => {
    const newNode: TreeNode = { id: finalNodes.length, value: val, x: 0, y: 0, left: null, right: null };
    if (finalRoot === null) { finalRoot = newNode.id; finalNodes.push(newNode); return; }
    let curr = finalRoot;
    while (true) {
      const p = finalNodes[curr];
      if (val < p.value) {
        if (p.left === null) { p.left = newNode.id; finalNodes.push(newNode); break; }
        curr = p.left;
      } else {
        if (p.right === null) { p.right = newNode.id; finalNodes.push(newNode); break; }
        curr = p.right;
      }
    }
  };
  values.forEach(insertTemp);

  // Layout calculations
  const calculateFinalPositions = (nodeId: number | null, depth: number, minX: number, maxX: number) => {
    if (nodeId === null) return;
    const node = finalNodes[nodeId];
    node.x = minX + (maxX - minX) / 2;
    node.y = 50 + depth * 60;
    calculateFinalPositions(node.left, depth + 1, minX, node.x);
    calculateFinalPositions(node.right, depth + 1, node.x, maxX);
  };
  calculateFinalPositions(finalRoot, 0, 0, 700);

  // 2. Simulate the insertion using pre-calculated coordinates
  const currentNodes: TreeNode[] = [];
  let root: number | null = null;

  // Deep copy final node cleanly
  const buildNode = (id: number): TreeNode => ({ ...finalNodes[id], left: null, right: null });

  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    const targetNodeId = i;
    const finalCoords = buildNode(targetNodeId);
    
    const insertQueue = values.slice(i);

    // Begin insertion
    if (root === null) {
      root = targetNodeId;
      currentNodes.push(finalCoords);
      states.push({
        data: { algorithm: 'bst-insert', nodes: JSON.parse(JSON.stringify(currentNodes)), root, current: root, visited: [], path: [], insertQueue: [...insertQueue] },
        activeIndices: [root],
        operationType: OperationType.OVERWRITE,
        metadata: { message: `Placing root node with value ${val}`, stepNumber: states.length }
      });
      continue;
    }

    let curr = root;
    const path: number[] = [];

    while (true) {
      path.push(curr);
      states.push({
        data: { algorithm: 'bst-insert', nodes: JSON.parse(JSON.stringify(currentNodes)), root, current: curr, visited: [], path: [...path], insertQueue: [...insertQueue] },
        activeIndices: [curr],
        operationType: OperationType.COMPARE,
        metadata: { message: `Comparing ${val} with ${currentNodes[curr].value}`, stepNumber: states.length }
      });

      const parent = currentNodes[curr];
      if (val < parent.value) {
        if (parent.left === null) {
          parent.left = targetNodeId;
          currentNodes.push(finalCoords);
          path.push(targetNodeId);
          states.push({
            data: { algorithm: 'bst-insert', nodes: JSON.parse(JSON.stringify(currentNodes)), root, current: targetNodeId, visited: [], path, insertQueue: [...insertQueue] },
            activeIndices: [targetNodeId],
            operationType: OperationType.OVERWRITE,
            metadata: { message: `${val} is smaller, placing as left child of ${parent.value}`, stepNumber: states.length }
          });
          break;
        }
        curr = parent.left;
        states.push({
          data: { algorithm: 'bst-insert', nodes: JSON.parse(JSON.stringify(currentNodes)), root, current: curr, visited: [], path: [...path, curr], insertQueue: [...insertQueue] },
          activeIndices: [curr],
          operationType: OperationType.VISIT,
          metadata: { message: `Traversing left child.`, stepNumber: states.length }
        });
      } else {
        if (parent.right === null) {
          parent.right = targetNodeId;
          currentNodes.push(finalCoords);
          path.push(targetNodeId);
          states.push({
            data: { algorithm: 'bst-insert', nodes: JSON.parse(JSON.stringify(currentNodes)), root, current: targetNodeId, visited: [], path, insertQueue: [...insertQueue] },
            activeIndices: [targetNodeId],
            operationType: OperationType.OVERWRITE,
            metadata: { message: `${val} is greater or equal, placing as right child of ${parent.value}`, stepNumber: states.length }
          });
          break;
        }
        curr = parent.right;
        states.push({
          data: { algorithm: 'bst-insert', nodes: JSON.parse(JSON.stringify(currentNodes)), root, current: curr, visited: [], path: [...path, curr], insertQueue: [...insertQueue] },
          activeIndices: [curr],
          operationType: OperationType.VISIT,
          metadata: { message: `Traversing right child.`, stepNumber: states.length }
        });
      }
    }
  }

  states.push({
    data: { algorithm: 'bst-insert', nodes: JSON.parse(JSON.stringify(currentNodes)), root, current: null, visited: [], path: [], insertQueue: [] },
    activeIndices: [],
    operationType: OperationType.DONE,
    metadata: { message: 'Binary Search Tree constructed.', stepNumber: states.length }
  });

  return { states, timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)' };
};
