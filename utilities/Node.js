// class to stablish how our Nodes will look
class Node {
    constructor( rootNode, leftNode = null, rightNode = null){
        this.rootNode = rootNode
        this.leftNode = leftNode
        this.rightNode = rightNode
    }
}

export default Node