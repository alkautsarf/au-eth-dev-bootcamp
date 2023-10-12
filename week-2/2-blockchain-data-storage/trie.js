const TrieNode = require('./trieNode');

class Trie {
    constructor() {
        this.root = new TrieNode(null);
    }
    insert(word) {
        const wordArray = word.split("")
        let node = this.root
        wordArray.forEach((el, i) => {
            if (!node.children[word[i]]) {
                node.children[word[i]] = new TrieNode(word[i]);
            }
            node = node.children[wordArray[i]]
            if(i == wordArray.length - 1) node.isWord = true
    })
    }
    contains(word) {
    let node = this.root;

    for (let i = 0; i < word.length; i++) {
        if (!node.children[word[i]]) return false
        else node = node.children[word[i]]
    }
    return node.isWord;
    }
}

module.exports = Trie;