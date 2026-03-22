import { OperationType, AlgorithmResult, AlgorithmState } from '../../types/AlgorithmState';

/*
 * Tree-based Merge Sort state generator.
 * Instead of tracking a flat array, we track a TREE of subarrays
 * at each level of the divide-and-conquer recursion.
 */

export interface TreeNode {
  id: string;
  values: number[];
  level: number;
  leftIdx: number;   // position in original array
  rightIdx: number;
  parentId: string | null;
  status: 'hidden' | 'visible' | 'active' | 'merging' | 'sorted';
}

export interface MergeSortTreeData {
  nodes: TreeNode[];
  maxLevel: number;
}

export const generateMergeSortStates = (initialArray: number[]): AlgorithmResult<MergeSortTreeData> => {
  const arr = [...initialArray];
  const allNodes: TreeNode[] = [];
  const states: AlgorithmState<MergeSortTreeData>[] = [];
  let step = 0;
  let maxLevel = 0;

  // Phase 1: Build the complete tree structure
  const buildTree = (left: number, right: number, level: number, parentId: string | null): string => {
    const id = level + '-' + left + '-' + right;
    maxLevel = Math.max(maxLevel, level);
    allNodes.push({
      id,
      values: arr.slice(left, right + 1),
      level,
      leftIdx: left,
      rightIdx: right,
      parentId,
      status: 'hidden',
    });

    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      buildTree(left, mid, level + 1, id);
      buildTree(mid + 1, right, level + 1, id);
    }

    return id;
  };

  buildTree(0, arr.length - 1, 0, null);

  // Helper to snapshot current tree state
  const snapshot = (activeIds: string[], op: OperationType, msg: string) => {
    const clonedNodes = allNodes.map(n => ({ ...n, values: [...n.values] }));
    states.push({
      data: { nodes: clonedNodes, maxLevel },
      activeIndices: [],
      operationType: op,
      metadata: { stepNumber: step++, message: msg },
    });
  };

  // Helper to find a node by its bounds
  const findNode = (left: number, right: number, level: number): TreeNode | undefined => {
    return allNodes.find(n => n.leftIdx === left && n.rightIdx === right && n.level === level);
  };

  // Phase 2: Generate splitting states (top-down)
  const rootNode = findNode(0, arr.length - 1, 0)!;
  rootNode.status = 'active';
  rootNode.values = arr.slice(0, arr.length);
  snapshot([], OperationType.VISIT, 'Starting Merge Sort. The full array has ' + arr.length + ' elements.');

  const split = (left: number, right: number, level: number) => {
    const node = findNode(left, right, level);
    if (!node) return;

    if (left >= right) {
      // Base case: single element
      node.status = 'visible';
      node.values = [arr[left]];
      snapshot([], OperationType.VISIT, 'Element [' + arr[left] + '] cannot be split further. Ready for merge.');
      return;
    }

    const mid = Math.floor((left + right) / 2);
    node.status = 'active';

    // Reveal children
    const leftChild = findNode(left, mid, level + 1);
    const rightChild = findNode(mid + 1, right, level + 1);

    if (leftChild) {
      leftChild.status = 'visible';
      leftChild.values = arr.slice(left, mid + 1);
    }
    if (rightChild) {
      rightChild.status = 'visible';
      rightChild.values = arr.slice(mid + 1, right + 1);
    }

    snapshot([], OperationType.VISIT,
      'Splitting [' + arr.slice(left, right + 1).join(', ') + '] into [' +
      arr.slice(left, mid + 1).join(', ') + '] and [' + arr.slice(mid + 1, right + 1).join(', ') + ']');

    node.status = 'visible';

    // Recurse
    split(left, mid, level + 1);
    split(mid + 1, right, level + 1);
  };

  split(0, arr.length - 1, 0);

  // Phase 3: Generate merging states (bottom-up)
  const merge = (left: number, mid: number, right: number, level: number) => {
    const parentNode = findNode(left, right, level);
    const leftChild = findNode(left, mid, level + 1);
    const rightChild = findNode(mid + 1, right, level + 1);

    if (!parentNode || !leftChild || !rightChild) return;

    const leftArr = leftChild.values.slice();
    const rightArr = rightChild.values.slice();

    leftChild.status = 'merging';
    rightChild.status = 'merging';
    parentNode.status = 'active';

    snapshot([], OperationType.COMPARE,
      'Merging [' + leftArr.join(', ') + '] and [' + rightArr.join(', ') + '] into sorted order.');

    // Perform the actual merge
    const result: number[] = [];
    let i = 0, j = 0;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        result.push(leftArr[i]);
        i++;
      } else {
        result.push(rightArr[j]);
        j++;
      }
    }
    while (i < leftArr.length) { result.push(leftArr[i]); i++; }
    while (j < rightArr.length) { result.push(rightArr[j]); j++; }

    // Update the array in place
    for (let k = 0; k < result.length; k++) {
      arr[left + k] = result[k];
    }

    // Update parent node values
    parentNode.values = [...result];
    parentNode.status = 'sorted';
    leftChild.status = 'sorted';
    rightChild.status = 'sorted';

    snapshot([], OperationType.OVERWRITE,
      'Merged result: [' + result.join(', ') + ']. Elements are now sorted in this range.');
  };

  const mergeSort = (left: number, right: number, level: number) => {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    mergeSort(left, mid, level + 1);
    mergeSort(mid + 1, right, level + 1);
    merge(left, mid, right, level);
  };

  mergeSort(0, arr.length - 1, 0);

  // Final state
  rootNode.status = 'sorted';
  snapshot([], OperationType.DONE,
    'Merge Sort Complete! Final sorted array: [' + arr.join(', ') + ']');

  return {
    states,
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
  };
};
