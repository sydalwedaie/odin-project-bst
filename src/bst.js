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

  #buildTree(array, start, end) {
    if (start > end) return null;
    const mid = Math.floor(start + end) / 2;
    const left = this.#buildTree(array, start, mid - 1);
    const right = this.#buildTree(array, mid + 1, end);
    return new Node(array[mid], left, right);
  }

  // Helpers
  #sanitizeArray(array) {
    // Sort items and remove duplicates
    return Array.from(new Set(array)).sort();
  }
}

const myTree = new Tree([7, 1, 2, 3, 4, 5, 6, 1]);
prettyPrint(myTree.root);
