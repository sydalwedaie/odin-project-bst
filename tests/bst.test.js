import { describe, expect, test } from "@jest/globals";
import { Tree } from "../src/bst.js";
import { prettyPrint } from "../src/helpers.js";

const input1 = [7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 400, 350];
const treeInput1 = {
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

describe("Test building trees", () => {
  test("should convert an array to tree", () => {
    const myTree = new Tree(input1);
    const expected = treeInput1;

    expect(myTree.root).toEqual(expected);
  });

  test("should return null for empty array or no input", () => {
    const treeEmptyArray = new Tree([]);
    const treeNoInput = new Tree();
    expect(treeEmptyArray.root).toEqual(null);
    expect(treeNoInput.root).toEqual(null);
  });
});

describe("Test method: includes", () => {
  const myTree = new Tree(input1);

  test.each(input1)("should return true for %d", (value) => {
    expect(myTree.includes(value)).toEqual(true);
  });

  test.each([0, 14, 42])("should return false for %d", (value) => {
    expect(myTree.includes(value)).toEqual(false);
  });
});

describe("Test method: insert", () => {
  test.each([0, 14, 42])("should insert %i in empty tree", (value) => {
    const myTree = new Tree();
    myTree.insert(value);
    expect(myTree.includes(value)).toEqual(true);
  });

  test.each([0, 14, 42, 555])("should insert %i in filled tree", (value) => {
    const myTree = new Tree(input1);
    myTree.insert(value);
    expect(myTree.includes(value)).toEqual(true);
  });

  test.each([7, 5, 6345])(
    "should not insert %i because it already exists",
    (value) => {
      const myTree = new Tree(input1);
      myTree.insert(value);
      expect(myTree.includes(value)).toEqual(true);
    },
  );
});

describe("Test method: deleteItem", () => {
  test("should do nothing if tree is empty", () => {
    const myTree = new Tree();
    myTree.deleteItem(1);
    expect(myTree.includes(1)).toEqual(false);
  });

  test.each([0, 2, 100])(
    "should do nothing for %d (doesn't exist)",
    (value) => {
      const myTree = new Tree(input1);
      myTree.deleteItem(value);
      expect(myTree.includes(value)).toEqual(false);
    },
  );

  test("should delete root node", () => {
    const myTree = new Tree(input1);
    myTree.deleteItem(9);
    expect(myTree.includes(9)).toEqual(false);
  });

  test.each([4, 8, 350])("should delete node %d (leaf node)", (value) => {
    const myTree = new Tree(input1);
    myTree.deleteItem(value);
    expect(myTree.includes(value)).toEqual(false);
  });

  test.each([3, 7, 23])("should delete node %d (1 child)", (value) => {
    const myTree = new Tree(input1);
    myTree.deleteItem(value);
    expect(myTree.includes(value)).toEqual(false);
  });

  test.each([5, 324, 400])("should delete node %d (2 children)", (value) => {
    const myTree = new Tree(input1);
    myTree.deleteItem(value);
    expect(myTree.includes(value)).toEqual(false);
  });
});

describe("Test method: levelOrderForEach", () => {
  const myTree = new Tree(input1);
  const mockCb = jest.fn(console.log);
  const mockCbArgs = [9, 5, 324, 3, 7, 23, 400, 4, 8, 67, 350, 6345];

  test("should throw error if callback function not provided", () => {
    expect(() => myTree.levelOrderForEach()).toThrow();
  });

  test("should do nothing to an empty tree", () => {
    const emptyTree = new Tree();
    emptyTree.levelOrderForEach(mockCb);
    expect(mockCb.mock.calls).toHaveLength(0);
  });

  test("should call each node in level order", () => {
    myTree.levelOrderForEach(mockCb);
    expect(mockCb.mock.calls).toHaveLength(mockCbArgs.length);
    mockCbArgs.forEach((arg, index) => {
      expect(mockCb.mock.calls[index][0]).toBe(arg);
    });
  });
});
