# The Odin Project - Binary Search Tree

This is the solution to The Odin Project's [Binary Search Tree](https://www.theodinproject.com/lessons/javascript-binary-search-trees) challenge. The goal is to implement a basic Binary Search Tree structure with a few rudimentary methods.

## Implemented features

### Create tree

A tree is created using the `Tree` class. It receives an array of numbers as its optional argument. Without it, `null` is returned, representing an empty tree. The input array does not need to be sorted. The class internally sorts and de-duplicates the input.

```js
const input = [7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 400, 350];
const myTree = new Tree(input);
```

The generated tree is accessible through the `root` property. A `prettyPrint` helper function is provided to visualize the tree:

```js
prettyPrint(myTree.root);
```

The `prettyPrint` output:

```
│           ┌── 6345
│       ┌── 400
│       │   └── 350
│   ┌── 324
│   │   │   ┌── 67
│   │   └── 23
└── 9
    │       ┌── 8
    │   ┌── 7
    └── 5
        │   ┌── 4
        └── 3
```

### Public methods

1. `includes(value)` returns `true` if the given value is in the tree, `false` otherwise.
2. `insert(value)` inserts a new node with `value` into the tree, preserving the “binary search” property. If `value` already exists, it does nothing.
3. `deleteItem(value)` removes `value` if it exists, and does nothing otherwise.
4. `levelOrderForEach()`traverses the tree in breadth-first level order and calls the `callback` on each value as it traverses. It throws an error if a callback is not provided.
5. `inOrderForEach(callback)`, `preOrderForEach(callback)`, and `postOrderForEach(callback)` traverse the tree in their respective depth-first order and pass each value to the provided callback. They throw an error if a callback is not provided.
6. `height(value)` returns the height of the node containing the given value (longest path, value to leaf). If the value is not found, it returns `undefined`.
7. `depth(value)` returns the depth of the node containing the given value (node to root). If the value is not found, it returns `undefined`.
8. `isBalanced()` returns `true` if the tree is balanced, `false` otherwise.
9. `rebalance()` rebalances an unbalanced tree.

## What did I learn

### Accessing `this` inside functions

I ran into a problem where `this` was not being recognized inside `traverse` functions, which I had defined inside class methods. Remember when we learned that an arrow function didn’t create its own `this` and that it inherited it from its parent scope? This was the first time I needed to understand and apply this concept!

My `traverse` functions, defined as function declarations, could not access other methods inside my class, like the `isBalanced` method, which needed to access the private method `#coundEdges` with `this.#countEdges`. It kept telling me that `this` was not defined. Even the autocomplete won’t pick it up. This was simply fixed by converting `traverse` to be an arrow function.

### Mutation vs. reassignment

The prominent pain point in this project, as well as the previous projects on data structures, was to get a hold of the target node and to successfully mutate it. I kept running into problems, only to discover I was not actually mutating the target node, but reassigning a local copy of it. For example, my initial attempt at the `insert` method was like this:

```js
// failed attempt
insert(value) {
  function traverse(root) {
    if (root === null) {
      root = new Node(value);
      return;
    } else {
      return value < root.data
        ? traverse(root.left)
        : traverse(root.right);
    }
  }

  traverse(this.root);
}
```

This was my intended logic: If the `traverse` function arrives at a `null` value, it means it has reached a leaf. Replace it with a `Node` set to `value`. Otherwise, call `traverse` recursively with the left or right side.

It obviously did not work as I expected; `root` was behaving like a local copy. Spoiler alert: it actually was, but I kept confusing myself. I knew that objects were passed by reference, so I was incredibly baffled why `root` was behaving like it was local.

The problem was **a confusion of reassignment operation with mutation**. When mutating an object in memory, any variable that points to that object will show the mutation. But a reassignment operation cuts a variable’s connection with that object in memory. In the failed attempt above, I was mistakenly thinking that in the base case, I was mutating the tree. I was sure `this.root` pointed to my tree in memory (this was correct). I passed it to `traverse`, and the recursive calls would properly pass the correct reference down the chain. When it reached `null`, `root` would still be pointing somewhere inside the original tree. However, by doing `root = new Node(value)`, I effectively cut that connection. Now I had a `root` variable that held a new value, and I returned nothing from the base branch. The local variable vanishes when the recursive calls unfold, and `traverse` ends doing nothing at all.

What I was doing was basically this:

```js
function foo(name) {
  name = 'Sayed'
}

let name = 'Ali'
foo(name)
console.log(name) // still 'Ali', but I expected 'Sayed'.
```

What I needed done was more like this:

```js
function foo(person) {
  person.name = 'Sayed'
}

let person = {
  name: 'Ali',
}

foo(person)
console.log(person.name) // 'Sayed', because person was mutated.
```

At this time, I formed the incorrect assumption that `root` was not holding the correct reference to the target node, but I correctly discovered that if I could somehow stop one node before the target node, I would be able to do `root.left = ` or `root.right = ` (like how `person.name` was working as expected in the example above). That is why in the working attempt below, I did a *look ahead* to see if I had reached a `null` (`root.left === null` instead of `root === null`).

```js
// working attempt
insert(value) {
  function traverse(root) {
    if (value < root.data && root.left === null) {
      root.left = new Node(value);
    } else if (value > root.data && root.right === null) {
      root.right = new Node(value);
    } else {
      return value < root.data
		? traverse(root.left)
		: traverse(root.right);
    }
  }

  traverse(this.root);
}
```

As you can see, it’s much more complex, but it worked. I still didn’t know why until I realized I had been confusing mutation with reassignment.

Contrast this to how I solved `includes`. It just checks if a target node is reached, and immediately returns `true` or `false` accordingly. It does not need to mutate anything, and no assignment operation is needed, so the above problem didn’t even occur:

```js
includes(value) {
  function traverse(root) {
    if (root === null) return false;
    if (value === root.data) return true;
    return value < root.data ? traverse(root.left) : traverse(root.right);
  }

  return traverse(this.root);
}
```

### Many new TDD concepts

This was the third major project where I used TDD extensively. The more it goes, the more use cases I find for APIs provided by the Jest library. I vaguely knew they existed, but it was in this project that I understood their true value.

#### `describe.each` and `test.each`

With `test.each`, I could run a test on every single element of the tree using one line, making sure I would essentially hit all the edge cases. And with `describe.each` I could write one block for all three depth-first traversal functions.

#### Jest’s `mock` functions

The Odin Project’s lesson made us read and watch content about this concept, but it never sank in until I found myself in need of testing functions with callbacks (the traversal methods). You see, in every other testing case so far, I had a method that either returned something (like `includes`) or did something to the data structure (like `insert`). In these scenarios, testing is as simple as doing an `expect` on the return value:

```js
expect(myTree.includes(value)).toEqual(true);
```

But what about the `levelOrderForEach(callback)` method? It doesn’t return anything, nor does it do anything to the tree. It just runs callback on every element of the tree. In my crude tests, this was simply a `console.log` to see if the elements were printed in the correct order. So, what do I need to test and how?

I had this vague idea that Jest could test _calling_ functions, which eventually led me to the concept of `mock` functions. I knew mocking was used to simulate API calls without actually doing a network call, but using them for a non-API test felt alien.

So how do we test `levelOrderForEach(callback)`? How do we know that it worked? We need it to call `callback` on every element, in the correct order. So we need to make Jest do the calls in the correct order, and then inspect these _calls_. With mock functions, Jest gives us a `mockCallback.mock.calls` array to do just that:

```js
describe("Test method: levelOrderForEach", () => {
  const myTree = new Tree(input);
  const mockCb = jest.fn(console.log);
  const mockCbArgs = [9, 5, 324, 3, 7, 23, 400, 4, 8, 67, 350, 6345];

  test("should call each node in level order", () => {
    myTree.levelOrderForEach(mockCb);
    mockCbArgs.forEach((arg, index) => {
      expect(mockCb.mock.calls[index][0]).toBe(arg);
    });
  });
});
```

Here’s how it works:

We make a _mock_ function out of the callback we would pass to `myTree.levelOrderForEach`. This is done like so:

```js
const mockCb = jest.fn(console.log);
```

Instead of passing `console.log`, we would pass the mock function `mockCb`. `levelOrderForEach` would still call `console.log`, but from `mockCb` we will get access to a `.mock` property that holds data on the state of the callbacks. One of these properties is a `calls` array. It’s an array of arrays; each sub-array represents the argument(s) that the `mockCb` function has been called with in each call. Those arguments correspond to the tree elements passed to the callback function (`console.log`).

```js
// The first argument of the second call to the function was 1
expect(mockCallback.mock.calls[1][0]).toBe(1);
```

So if we could inspect this array and make sure that its elements are arranged in the correct order, we would have tested the correct operation of `levelOrderForEach`. In the `describe` block above, the variable `mockCbArgs` holds the correct sequence. By iterating over this array and comparing each element with its counterpart in the array we got from the mock function, we would achieve our goal.

There is one little nuisance with this approach: the test literally calls `console.log` and outputs the result in the terminal window, along with the tests. It’s extra noise we don’t need. We could use the `--silent` flag when running Jest, or change the mock function. So instead of `console.log`, we could simply pass an empty function!

```js
const mockCb = jest.fn(() => {});
```

Remember that our test doesn’t care about the output; it just wants to see if the callback function was called correctly with the correct arguments.

Note: Apparently we could also remove the function entirely! My tests still passed with just `jest.fn()`

#### Testing methods throwing errors

The traversal methods all throw an error for an absent callback argument. Jest has`.toThrow` to test for errors. However, be careful what you put in the `expect` clause. The function that’s throwing the error should be wrapped in another function, or it won’t work:

```js
test("should throw error if callback function not provided", () => {
  expect(() => myTree.levelOrderForEach()).toThrow();
});
```

#### Test design considerations

At one point I wondered if I needed to test private methods such as `buildTree`. A quick search online revealed that this is generally undesirable, as it tightly couples the tests with the implementation. If those private methods were to change for any reason, developers would need to also update the tests, aka unnecessary work.

Another concern was using other methods when testing one. For example, I used the `includes` method when testing `insert`. Doing this couples multiple tests together: if one method breaks, the tests for the other method will also break. Depending on the scale of the project, this may be undesirable.

Finally, I came across a scenario that revealed the limitation of one of my tests. The way I tested creating a valid tree was a hard-coded sample tree to compare against a generated BST. However, I realized if I deleted a node and inserted it back, the resulting tree would differ from the original one, even though both were valid and balanced trees. So testing against a static representation was not sufficient. The solution was to test invariants: for example, the number of elements, or that every node was in its correct position in relation to its neighbors. I did not implement these, but I learned that tests should be more carefully designed from the ground up.
