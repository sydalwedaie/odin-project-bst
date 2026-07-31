import { Tree } from "./bst.js";

export const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null || node === undefined) {
    return;
  }

  prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
};

export const sampleTree = () => {
  const input = [7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 400, 350];
  const generated = new Tree(input);

  const expected = {
    data: 9,
    left: {
      data: 5,
      left: {
        data: 3,
        left: null,
        right: { data: 4, left: null, right: null },
      },
      right: {
        data: 7,
        left: null,
        right: { data: 8, left: null, right: null },
      },
    },
    right: {
      data: 324,
      left: {
        data: 23,
        left: null,
        right: { data: 67, left: null, right: null },
      },
      right: {
        data: 400,
        left: { data: 350, left: null, right: null },
        right: { data: 6345, left: null, right: null },
      },
    },
  };

  return { input, generated, expected };
};
