import { prettyPrint } from "./helpers.js";

class Node {
  constructor(data, left, right) {
    this.data = data;
    this.left = left || null;
    this.right = right || null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.#buildTree(array, 0, array.length - 1);
  }

  #buildTree(array, start, end) {
    if (start > end) return null;
    const mid = Math.floor(start + end) / 2;
    const left = this.#buildTree(array, start, mid - 1);
    const right = this.#buildTree(array, mid + 1, end);
    const rootNode = new Node(array[mid], left, right);

    return rootNode;
  }
}

const myTree = new Tree([1, 2, 3, 4, 5, 6, 7]);
prettyPrint(myTree.root);
