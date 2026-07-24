import { prettyPrint } from "./helpers.js";

class Node {
  constructor(data, left, right) {
    this.data = data;
    this.left = left || null;
    this.right = right || null;
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
      if (root === null) return false;
      if (value === root.data) return true;
      return value < root.data ? traverse(root.left) : traverse(root.right);
    }
    return traverse(this.root);
  }

  insert(value) {
    if (this.includes(value)) return;

    let current = this.root;
    function traverse() {
      if (
        (value < current.data && current.left == null) ||
        (value > current.data && current.right === null)
      ) {
        return;
      } else if (value < current.data) {
        current = current.left;
        return traverse();
      } else {
        current = current.right;
        return traverse();
      }
    }

    traverse();
    if (value < current.data) {
      current.left = new Node(value);
    } else {
      current.right = new Node(value);
    }
  }
}

console.clear();
// Test initialization
const input = [7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const myTree = new Tree(input);
prettyPrint(myTree.root);
// console.dir(myTree.root, { depth: null, colors: true });

// Test includes
console.log("Test includes: ", "should fail -1 and 0");
const includesTestItems = [...input, -1, 0];
includesTestItems.forEach((item) => {
  console.assert(myTree.includes(item), `${item} is not in the tree`);
});

// Test insert
console.log("Test insert: ");
const anotherTree = new Tree([1, 2]);
anotherTree.insert(0);
anotherTree.insert(12);
anotherTree.insert(22);
anotherTree.insert(5);
prettyPrint(anotherTree.root);
console.dir(anotherTree.root, { depth: null, colors: true });
