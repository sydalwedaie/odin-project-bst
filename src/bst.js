import { prettyPrint } from "./helpers.js";

class Node {
  constructor(data, left, right) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  #sanitizedArray;
  constructor(array) {
    this.#sanitizedArray = this.#sanitizeArray(array);
    this.root = this.#buildTree(
      this.#sanitizedArray,
      0,
      this.#sanitizedArray.length - 1,
    );
  }

  // Helpers
  #sanitizeArray(array) {
    return Array.from(new Set(array)).sort((a, b) => a - b);
  }

  #buildTree(array, start, end) {
    if (start > end) return null;
    const mid = Math.floor((start + end) / 2);
    const left = this.#buildTree(array, start, mid - 1);
    const right = this.#buildTree(array, mid + 1, end);
    return new Node(array[mid], left, right);
  }

  // Methods
  includes(value) {
    function traverse(root) {
      if (root === null) return null;
      else if (value === root.data) {
        return true;
      } else if (value < root.data) {
        return traverse(root.left);
      } else if (value > root.data) {
        return traverse(root.right);
      }
    }
    return traverse(this.root) || false;
  }
}

const input = [7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const myTree = new Tree(input);
prettyPrint(myTree.root);
// console.dir(myTree.root, { depth: null, colors: true });

const emptyTree = new Tree([1]);
prettyPrint(emptyTree.root);

// Test includes
const testItems = [...input, -1, 0];
testItems.forEach((item) => {
  console.assert(myTree.includes(item), `${item} is not in the tree`);
});
