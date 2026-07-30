import { prettyPrint } from "./helpers.js";

class Node {
  constructor(data, left, right) {
    this.data = data;
    this.left = left || null;
    this.right = right || null;
  }
}

export class Tree {
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
      if (root === null) return false;
      if (value === root.data) return true;
      return value < root.data ? traverse(root.left) : traverse(root.right);
    }
    return traverse(this.root);
  }

  insert(value) {
    if (this.includes(value)) return;
    if (this.root === null) {
      this.root = new Node(value);
      return;
    }

    function traverse(root) {
      if (value < root.data && root.left === null) {
        root.left = new Node(value);
      } else if (value > root.data && root.right === null) {
        root.right = new Node(value);
      } else {
        return value < root.data ? traverse(root.left) : traverse(root.right);
      }
    }

    traverse(this.root);
  }

  deleteItem(value) {
    function getSuccessor(root) {
      if (root.left === null) return root;
      return getSuccessor(root.left);
    }

    function traverse(root) {
      if (root.data === value) {
        if (root.left === null && root.right === null) {
          // no children
          return null;
        } else if (root.left === null || root.right === null) {
          // one child
          return root.left || root.right;
        } else {
          // two children
          let successor = getSuccessor(root.right);
          root.data = successor.data;
          successor.data = value;
          root.right = traverse(root.right);
          return root;
        }
      }

      if (value < root.data) {
        root.left = traverse(root.left);
      } else {
        root.right = traverse(root.right);
      }

      return root;
    }

    if (this.includes(value) && this.root !== null) {
      traverse(this.root);
    }
  }

  levelOrderForEach(cb) {
    if (!cb) throw new Error("A callback function must be supplied.");
    if (this.root === null) return;
    const queue = [this.root];

    while (queue.length) {
      const currentNode = queue.shift();
      cb(currentNode.data);
      if (currentNode.left) queue.push(currentNode.left);
      if (currentNode.right) queue.push(currentNode.right);
    }
  }

  preOrderForEach(cb) {
    if (!cb) throw new Error("A callback function must be supplied.");
    function traverse(root) {
      if (root === null) return;
      cb(root.data);
      if (root.left) traverse(root.left);
      if (root.right) traverse(root.right);
    }

    traverse(this.root);
  }

  inOrderForEach(cb) {
    if (!cb) throw new Error("A callback function must be supplied.");
    function traverse(root) {
      if (root === null) return;
      if (root.left) traverse(root.left);
      cb(root.data);
      if (root.right) traverse(root.right);
    }

    traverse(this.root);
  }

  postOrderForEach(cb) {
    if (!cb) throw new Error("A callback function must be supplied.");
    function traverse(root) {
      if (root === null) return;
      if (root.left) traverse(root.left);
      if (root.right) traverse(root.right);
      cb(root.data);
    }

    traverse(this.root);
  }
}
