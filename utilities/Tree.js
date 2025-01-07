import Node from "./Node.js"

class Tree {
    // Constructing a binary search tree
    constructor(array) {
        this.root = this.buildTree(array.sort((a, b) => a - b))
    }

    // Constructing a recursive function that will organize the nodes
    buildTree(array) {
        if (array.length === 0) {
            return null
        }

        // Defining the different parts of the Node
        let middleOfArray = Math.floor(array.length / 2)
        let rootNode = array[middleOfArray]
        let leftNode = array.slice(0, middleOfArray)
        let rightNode = array.slice(middleOfArray + 1)

        // Returning the Node created with recursivity
        return new Node(rootNode, this.buildTree(leftNode), this.buildTree(rightNode))
    }

    insert(value) {
        const newNode = new Node(value)
        let currentNode = this.root

        while (currentNode) {
            if (value === currentNode.rootNode) {
                return currentNode
            } else if (value <= currentNode.rootNode && currentNode.leftNode) {
                currentNode = currentNode.leftNode
            } else if (value >= currentNode.rootNode && currentNode.rightNode) {
                currentNode = currentNode.rightNode
            } else {
                if (value < currentNode.rootNode) {
                    currentNode.leftNode = newNode
                    return
                } else {
                    currentNode.rightNode = newNode
                    return
                }
            }
        }
    }

    find(value) {
        let currentNode = this.root

        while (currentNode) {
            if (currentNode.rootNode === value) {
                return currentNode
            } else if (currentNode.rootNode > value) {
                currentNode = currentNode.leftNode
            } else if (currentNode.rootNode < value) {
                currentNode = currentNode.rightNode
            }
        }
        return null
    }

    findParent(value) {
        let currentNode = this.root

        while (currentNode) {
            if (currentNode.leftNode === value || currentNode.rightNode === value) {
                return currentNode
            } else if (currentNode.rootNode > value) {
                currentNode = currentNode.leftNode
            } else if (currentNode.rootNode < value) {
                currentNode = currentNode.rightNode
            }
        }
        return null
    }

    deleteItem(value) {
        // We find the node with the root == value
        let currentNode = this.find(value)
        if (!currentNode) return null
        let parentNode = this.findParent(currentNode.rootNode)

        // Case 1: Lead Node
        if (!currentNode.leftNode && !currentNode.rightNode) {

            //Check if the current node is the root
            if (!parentNode) {
                this.root = null
            } else {
                // We delete the root node and the pointer in the parent node
                currentNode.rootNode == parentNode.leftNode ? parentNode.leftNode = null : parentNode.rightNode = null;
            }

            return currentNode
        }


        // Case 2: Node with two childs
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

        const childNode = currentNode.leftNode || currentNode.rightNode

        // Check if the current node is the root
        if (!parentNode) {
            this.root = childNode
        } else if (parentNode.leftNode === currentNode) {
            parentNode.leftNode = childNode
        } else {
            parentNode.rightNode = childNode
        }

        return currentNode


    }
    levelOrder(callback = null) {
        if (!callback) {
            throw new Error("Callback function required")
        }
        let nodeQueue = []
        let nodeArray = []

        function recursiveNodePushing(node = null) {

            if (node) {
                nodeArray.push(node)
                if (node.leftNode) nodeQueue.push(node.leftNode)
                if (node.rightNode) nodeQueue.push(node.rightNode)

                if (nodeQueue.length === 0) return;

                recursiveNodePushing(nodeQueue.shift())
            }
        }

        if (this.root) {
            nodeQueue.push(this.root)
            recursiveNodePushing()
        }

        nodeArray.forEach(node => callback(node.rootNode))
    }
}

export default Tree