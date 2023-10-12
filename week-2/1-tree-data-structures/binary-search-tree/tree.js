class Tree {
    constructor() {
        this.root = null;
    }
    addNode(node) {
         if(!this.root) {
            this.root = node;
            return;
        }

        let prt = this.root

        while(true) {
            if(node.data < prt.data) {
                if(!prt.left) {
                    prt.left = node
                    break;
                } else prt = prt.left
            }
            if(node.data > prt.data) {
                if(!prt.right) {
                    prt.right = node
                    break;
                } else prt = prt.right
            }
        }

    }
    hasNode(number) {
        let prt = this.root
        while(true) {
        if(number == prt.data) {
            return true
        }
        if(number < prt.data) {
            return prt.left ? prt = prt.left : false
        }
        if(number > prt.data) {
            return prt.right ? prt = prt.right : false
        }
        }
    }
}

module.exports = Tree;