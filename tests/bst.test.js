import { describe, expect, test } from "@jest/globals";
import { Tree } from "../src/bst.js";

describe("Test building trees", () => {
  test("should convert an array to tree", () => {
    const input = [7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
    const myTree = new Tree(input);
    const expected = {
      data: 8,
      left: {
        data: 4,
        left: { data: 3, left: null, right: null },
        right: {
          data: 5,
          left: null,
          right: { data: 7, left: null, right: null },
        },
      },
      right: {
        data: 67,
        left: {
          data: 9,
          left: null,
          right: { data: 23, left: null, right: null },
        },
        right: {
          data: 324,
          left: null,
          right: { data: 6345, left: null, right: null },
        },
      },
    };

    expect(myTree.root).toEqual(expected);
  });

  test("should return null for empty array or no input", () => {
    const treeEmptyArray = new Tree([]);
    const treeNoInput = new Tree();
    const expected = null;
    expect(treeEmptyArray.root).toEqual(expected);
    expect(treeNoInput.root).toEqual(expected);
  });
});

describe("Test method: includes", () => {
  const input = [7, 4, 23, 8, 9, 3, 5, 9, 67, 6345, 324];
  const myTree = new Tree(input);

  test.each(input)("should return true for %d", (value) => {
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
    const input = [7, 4, 23, 8, 9, 3, 5, 9, 67, 6345, 324];
    const myTree = new Tree(input);
    myTree.insert(value);
    expect(myTree.includes(value)).toEqual(true);
  });
});
