const { assert } = require('chai');
const Trie = require('./trie');
const TrieNode = require('./trieNode');

describe('Trie', () => {
    describe('with a single word HEY', () => {
        let trie;
        beforeEach(() => {
            trie = new Trie();
            trie.insert('HEY');
        });

        it('should connect the root to the first letter', () => {
            const firstNode = trie.root.children['H'];
            assert.equal(firstNode.key, 'H', 'expected the `key` of the first node to be `H`');
            assert(firstNode.children['E'], 'expected the `children` of the first node to have a connection to the next letter');
            assert.equal(firstNode.isWord, false, 'expected the `isWord` of the first node to be `false`');
        });
        
        it('should connect the root to the second letter', () => {
            const firstNode = trie.root.children['H'];
            const secondNode = firstNode.children['E'];
            assert.equal(secondNode.key, 'E', 'expected the `key` of the first node to be `E`');
            assert(secondNode.children['Y'], 'expected the `children` of the second node to have a connection to the next letter');
            assert.equal(secondNode.isWord, false, 'expected the `isWord` of the second node to be `false`');
        });

        it('should connect the root to the third letter', () => {
            const firstNode = trie.root.children['H'];
            const secondNode = firstNode.children['E'];
            const thirdNode = secondNode.children['Y'];
            assert.equal(thirdNode.key, 'Y', 'expected the `key` of the first node to be `Y`');
            assert.equal(Object.keys(thirdNode.children).length, 0, 'expected to have no `children` for the final node');
            assert.equal(thirdNode.isWord, true, 'expected the `isWord` of the final node to be `true`');
        });
    });
    describe('with a single word', () => {
        let trie;
        beforeEach(() => {
            trie = new Trie();
            trie.insert('hey');
        });

        it('should properly detect words that are contained', () => {
            assert(trie.contains('hey'), "Expected the trie to contain `hey`!");
        });

        it('should properly detect words that are not contained', () => {
            assert(!trie.contains('hello'), "Expected the trie to not contain `hello`!");
            assert(!trie.contains('he'), "Expected the trie to not contain `he`!");
            assert(!trie.contains('hi'), "Expected the trie to not contain `hi`!");
            assert(!trie.contains('heya'), "Expected the trie to not contain `heya`!");
        });
    });

    describe('with three words', () => {
        let trie;
        let words = ['helipad', 'hello', 'hermit'];
        beforeEach(() => {
            trie = new Trie();
            words.forEach(word => trie.insert(word));
        });

        words.forEach((word) => {
            describe(`for ${word}`, () => {
                it('should connect to the final letter', () => {
                    const finalNode = word.split("").reduce((node, letter) => node.children[letter], trie.root);
                    assert(finalNode);
                    assert.equal(finalNode.isWord, true, "expected the final node `isWord` to be set to true");
                });
            });
        });
    });
});

describe('TrieNode', () => {
    it('should have store a key', () => {
        const node = new TrieNode('a');
        assert.equal(node.key, 'a', 'expected the constructor argument to be stored as the `key` property value');
    });
    it('should have store an object `children`', () => {
        const node = new TrieNode();
        assert.equal(typeof node.children, 'object', 'expected a property `children` to be an object on TrieNode');
    });
    it('should have store a property `isWord`', () => {
        const node = new TrieNode();
        assert.equal(node.isWord, false, 'expected a property `isWord` to be an object on TrieNode');
    });
});