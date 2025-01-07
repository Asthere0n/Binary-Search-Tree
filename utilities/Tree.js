import Node from "./Node.js"

class Tree {
    // Constructor and Initialization Methods
    constructor(array) {
        this.root = this.buildTree(array.sort((a, b) => a - b));
    }

    buildTree(array) {
        if (array.length === 0) {
            return null;
        }

        let middleOfArray = Math.floor(array.length / 2);
        let rootNode = array[middleOfArray];
        let leftNode = array.slice(0, middleOfArray);
        let rightNode = array.slice(middleOfArray + 1);

        return new Node(rootNode, this.buildTree(leftNode), this.buildTree(rightNode));
    }

    // Utility Methods
    checkRoot() {
        return this.root !== null;
    }

    find(value) {
        if (!this.checkRoot()) {
            return null;
        }

        let currentNode = this.root;

        while (currentNode) {
            if (currentNode.rootNode === value) {
                return currentNode;
            } else if (currentNode.rootNode > value) {
                currentNode = currentNode.leftNode;
            } else {
                currentNode = currentNode.rightNode;
            }
        }
        return null;
    }

    findParent(value) {
        let currentNode = this.root;

        while (currentNode) {
            if (currentNode.leftNode === value || currentNode.rightNode === value) {
                return currentNode;
            } else if (currentNode.rootNode > value) {
                currentNode = currentNode.leftNode;
            } else if (currentNode.rootNode < value) {
                currentNode = currentNode.rightNode;
            }
        }
        return null;
    }

    // Modification Methods
    insert(value) {
        if (!this.checkRoot()) {
            this.root = new Node(value);
            return this.root;
        }

        const newNode = new Node(value);
        let currentNode = this.root;

        while (currentNode) {
            if (value === currentNode.rootNode) {
                return currentNode;
            } else if (value <= currentNode.rootNode && currentNode.leftNode) {
                currentNode = currentNode.leftNode;
            } else if (value >= currentNode.rootNode && currentNode.rightNode) {
                currentNode = currentNode.rightNode;
            } else {
                if (value < currentNode.rootNode) {
                    currentNode.leftNode = newNode;
                    return;
                } else {
                    currentNode.rightNode = newNode;
                    return;
                }
            }
        }
    }

    deleteItem(value) {
        if (!this.checkRoot()) {
            return null;
        }

        let currentNode = this.find(value);
        if (!currentNode) return null;
        let parentNode = this.findParent(value);

        // Case 1: Leaf Node
        if (!currentNode.leftNode && !currentNode.rightNode) {
            if (!parentNode) {
                this.root = null;
            } else {
                if (parentNode.leftNode === currentNode) {
                    parentNode.leftNode = null;
                } else {
                    parentNode.rightNode = null;
                }
            }
            return currentNode;
        }

        // Case 2: Node with two children
        if (currentNode.leftNode && currentNode.rightNode) {
            let successor = currentNode.rightNode;
            let successorParent = currentNode;

            while (successor.leftNode) {
                successorParent = successor;
                successor = successor.leftNode;
            }

            currentNode.rootNode = successor.rootNode;

            if (successorParent === currentNode) {
                successorParent.rightNode = successor.rightNode;
            } else {
                successorParent.leftNode = successor.rightNode;
            }
            return currentNode;
        }

        // Case 3: Node with one child
        const childNode = currentNode.leftNode || currentNode.rightNode;

        if (!parentNode) {
            this.root = childNode;
        } else if (parentNode.leftNode === currentNode) {
            parentNode.leftNode = childNode;
        } else {
            parentNode.rightNode = childNode;
        }

        return currentNode;
    }

    rebalance() {
        if (!this.checkRoot()) {
            return null;
        }

        let nodeList = [];

        this.traverseLevels([this.root], (levelArray) => {
            nodeList = nodeList.concat(levelArray);
        });

        nodeList = nodeList.map(node => node.rootNode); // Extract values from nodes
        nodeList.sort((a, b) => a - b); // Sort the values

        this.root = this.buildTree(nodeList); // Rebuild the tree with sorted values
    }

    // Traversal Methods
    levelOrder(callback = null) {
        if (!callback) {
            throw new Error("Callback function required");
        }
        let nodeQueue = [];
        let nodeArray = [];

        function recursiveNodePushing(node = null) {
            if (node) {
                nodeArray.push(node);
                if (node.leftNode) nodeQueue.push(node.leftNode);
                if (node.rightNode) nodeQueue.push(node.rightNode);

                if (nodeQueue.length === 0) return;

                recursiveNodePushing(nodeQueue.shift());
            }
        }

        if (this.root) {
            nodeQueue.push(this.root);
            recursiveNodePushing();
        }
        nodeArray.forEach(node => callback(node.rootNode));
    }

    traverseLevels(array, callback) {
        let levelArray = [];
        if (array.length == 0) {
            return;
        }

        array.forEach((currentNode) => {
            if (!currentNode.leftNode && !currentNode.rightNode) {
                return;
            }
            if (currentNode.leftNode) levelArray.push(currentNode.leftNode);
            if (currentNode.rightNode) levelArray.push(currentNode.rightNode);
        });

        callback(levelArray);
        this.traverseLevels(levelArray, callback);
    }

    // Property Methods
    height(node) {
        if (!node) {
            return -1;
        }
        let height = 0;

        this.traverseLevels([node], () => { height++ });
        return height;
    }

    depth(node) {
        let currentNode = this.root;
        let depth = 0;

        while (currentNode) {
            if (currentNode === node) {
                return depth;
            } else {
                depth++;
            }

            if (currentNode.rootNode > node.rootNode) {
                currentNode = currentNode.leftNode;
            } else if (currentNode.rootNode < node.rootNode) {
                currentNode = currentNode.rightNode;
            } else {
                return null;
            }
        }

        return null;
    }

    isBalanced() {
        if (!this.checkRoot()) {
            return null;
        }

        const leftHeight = this.height(this.root.leftNode);
        const rightHeight = this.height(this.root.rightNode);

        return Math.abs(leftHeight - rightHeight) <= 1;
    }
}

export default Tree;