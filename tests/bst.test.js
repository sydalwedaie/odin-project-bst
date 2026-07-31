import { describe, expect, test } from "@jest/globals";
import { Tree } from "../src/bst.js";
import { sampleTree } from "../src/helpers.js";

describe("Test building trees", () => {
  test("should convert an array to tree", () => {
    const myTree = sampleTree().generated;
    const expected = sampleTree().expected;

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
  const myTree = sampleTree().generated;

  test.each(sampleTree().input)("should return true for %d", (value) => {
    expect(myTree.includes(value)).toEqual(true);
  });

  test.each([0, 14, 42])("should return false for %d", (value) => {
    expect(myTree.includes(value)).toEqual(false);
  });
});

describe("Test method: insert", () => {
  test.each([0, 14, 42])("should insert %d in empty tree", (value) => {
    const myTree = new Tree();
    myTree.insert(value);
    expect(myTree.includes(value)).toEqual(true);
  });

  test.each([0, 14, 42, 555])("should insert %d in filled tree", (value) => {
    const myTree = sampleTree().generated;
    myTree.insert(value);
    expect(myTree.includes(value)).toEqual(true);
  });

  test.each([7, 5, 6345])(
    "should do nothing for %d because it already exists",
    (value) => {
      const myTree = sampleTree().generated;
      myTree.insert(value);
      expect(myTree.root).toEqual(sampleTree().expected);
    },
  );
});

describe("Test method: deleteItem", () => {
  test("should do nothing if tree is empty", () => {
    const myTree = new Tree();
    myTree.deleteItem(1);
    expect(myTree.root).toEqual(null);
  });

  test.each([0, 2, 100])(
    "should do nothing for %d (doesn't exist)",
    (value) => {
      const myTree = sampleTree().generated;
      myTree.deleteItem(value);
      expect(myTree.includes(value)).toEqual(false);
      expect(myTree.root).toEqual(sampleTree().expected);
    },
  );

  test("should delete root node", () => {
    const myTree = sampleTree().generated;
    myTree.deleteItem(9);
    expect(myTree.includes(9)).toEqual(false);
  });

  test.each([4, 8, 350])("should delete node %d (leaf node)", (value) => {
    const myTree = sampleTree().generated;
    myTree.deleteItem(value);
    expect(myTree.includes(value)).toEqual(false);
    // myTree.insert(value);
    // expect(myTree.root).toEqual(sampleTree().expected);
  });

  test.each([3, 7, 23])("should delete node %d (1 child)", (value) => {
    const myTree = sampleTree().generated;
    myTree.deleteItem(value);
    expect(myTree.includes(value)).toEqual(false);
    // myTree.insert(value);
    // expect(myTree.root).toEqual(sampleTree().expected);
  });

  test.each([5, 324, 400])("should delete node %d (2 children)", (value) => {
    const myTree = sampleTree().generated;
    myTree.deleteItem(value);
    expect(myTree.includes(value)).toEqual(false);
    // myTree.insert(value);
    // expect(myTree.root).toEqual(sampleTree().expected);
  });
});

describe.each([
  ["levelOrderForEach", [9, 5, 324, 3, 7, 23, 400, 4, 8, 67, 350, 6345]],
  ["preOrderForEach", [9, 5, 3, 4, 7, 8, 324, 23, 67, 400, 350, 6345]],
  ["inOrderForEach", [3, 4, 5, 7, 8, 9, 23, 67, 324, 350, 400, 6345]],
  ["postOrderForEach", [4, 3, 8, 7, 5, 67, 23, 350, 6345, 400, 324, 9]],
])("Test methods: forEach", (forEach, args) => {
  const myTree = sampleTree().generated;
  const mockCb = jest.spyOn(console, "log").mockImplementation(() => {});

  test(`should throw error if callback function not provided to ${forEach}`, () => {
    expect(() => myTree[forEach]()).toThrow();
  });

  test("should do nothing to an empty tree", () => {
    const emptyTree = new Tree();
    emptyTree[forEach](mockCb);
    expect(mockCb.mock.calls).toHaveLength(0);
  });

  test(`should call each node in ${forEach.replace("ForEach", "").toLowerCase()}`, () => {
    myTree[forEach](mockCb);
    expect(mockCb.mock.calls).toHaveLength(args.length);
    args.forEach((arg, index) => {
      expect(mockCb.mock.calls[index][0]).toBe(arg);
    });
  });

  jest.restoreAllMocks();
});

describe("Test method: height", () => {
  const myTree = sampleTree().generated;

  test("should return undefined for empty tree", () => {
    const emptyTree = new Tree();
    expect(emptyTree.height(400)).toBe(undefined);
  });

  test("should return undefined for non-existant value", () => {
    expect(myTree.height(50)).toBe(undefined);
  });

  test.each([
    [0, 350],
    [1, 23],
    [2, 5],
    [3, 9],
  ])("should return %d for node %d", (height, value) => {
    expect(myTree.height(value)).toBe(height);
  });
});

describe("Test method: depth", () => {
  const myTree = sampleTree().generated;

  test("should return undefined for empty tree", () => {
    const emptyTree = new Tree();
    expect(emptyTree.depth(400)).toBe(undefined);
  });

  test("should return undefined for non-existant value", () => {
    expect(myTree.depth(50)).toBe(undefined);
  });

  test.each([
    [3, 350],
    [2, 23],
    [1, 5],
    [0, 9],
  ])("should return %d for node %d", (depth, value) => {
    expect(myTree.depth(value)).toBe(depth);
  });
});

describe("Test method: isBalanced", () => {
  const myTree = sampleTree().generated;

  test("should return true for an empty tree", () => {
    const emptyTree = new Tree();
    expect(emptyTree.isBalanced()).toBe(true);
  });

  test("should return true for a balanced tree", () => {
    expect(myTree.isBalanced()).toBe(true);
  });

  test("should return false for an unbalanced tree", () => {
    myTree.insert(70);
    myTree.insert(75);
    expect(myTree.isBalanced()).toBe(false);
  });
});

describe("Test method: reBalance", () => {
  const myTree = sampleTree().generated;

  test("should rebalance an unbalanced tree", () => {
    myTree.insert(70);
    myTree.insert(75);
    expect(myTree.isBalanced()).toBe(false);
    myTree.reBalance();
    expect(myTree.isBalanced()).toBe(true);
  });
});
