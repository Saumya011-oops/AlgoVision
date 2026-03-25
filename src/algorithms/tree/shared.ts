export interface TreeNode {
  id: number;
  value: number;
  x: number;
  y: number;
  left: number | null;
  right: number | null;
}

export interface TreeData {
  algorithm: 'bst-insert' | 'preorder' | 'inorder' | 'postorder';
  nodes: TreeNode[];
  root: number | null;
  current: number | null;
  visited: number[];
  path: number[];
}

export const generateRandomBST = (size = 10): { nodes: TreeNode[]; root: number | null } => {
  const nodes: TreeNode[] = [];
  const values = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
  
  if (size === 0) return { nodes, root: null };

  let root: number | null = null;

  const insert = (val: number) => {
    const newNode: TreeNode = {
      id: nodes.length,
      value: val,
      x: 0,
      y: 0,
      left: null,
      right: null
    };

    if (root === null) {
      root = newNode.id;
      nodes.push(newNode);
      return;
    }

    let current = root;
    while (true) {
      const parent = nodes[current];
      if (val < parent.value) {
        if (parent.left === null) {
          parent.left = newNode.id;
          nodes.push(newNode);
          break;
        }
        current = parent.left;
      } else {
        if (parent.right === null) {
          parent.right = newNode.id;
          nodes.push(newNode);
          break;
        }
        current = parent.right;
      }
    }
  };

  values.forEach(insert);

  // Calculate coordinates
  const canvasWidth = 700;
  const levelHeight = 60;
  
  const calculatePositions = (nodeId: number | null, depth: number, minX: number, maxX: number) => {
    if (nodeId === null) return;
    const node = nodes[nodeId];
    
    node.x = minX + (maxX - minX) / 2;
    node.y = 40 + depth * levelHeight;

    calculatePositions(node.left, depth + 1, minX, node.x);
    calculatePositions(node.right, depth + 1, node.x, maxX);
  };

  calculatePositions(root, 0, 0, canvasWidth);

  return { nodes, root };
};
