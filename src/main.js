import { Tree } from "./bst.js";
import { prettyPrint } from "./helpers.js";

console.clear();
// Test initialization
// const input = [7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
// const myTree = new Tree(input);
// prettyPrint(myTree.root);
// console.dir(myTree.root, { depth: null, colors: true });

// Test includes
// console.log("Test includes: ", "should fail -1 and 0");
// const includesTestItems = [...input, -1, 0];
// includesTestItems.forEach((item) => {
//   console.assert(myTree.includes(item), `${item} is not in the tree`);
// });

// Test insert
// console.log("Test insert: ");
// const anotherTree = new Tree([0, 1, 2]);
// anotherTree.insert(0);
// anotherTree.insert(1);
// anotherTree.insert(22);
// anotherTree.insert(5);
// prettyPrint(anotherTree.root);
// console.dir(anotherTree.root, { depth: null, colors: true });

// Test deleteItem
const input = [7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const myTree = new Tree(input);
// myTree.deleteItem(324);
prettyPrint(myTree.root);
