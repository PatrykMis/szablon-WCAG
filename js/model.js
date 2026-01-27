/**
 * MIT License - see full text in LICENSE
 * Originally by: M. Kruczek, K. Jankowska
 * Refactored and maintained by: Patryk Miœ
 */

/**
 * DocumentNode represents a single node in the document structure.
 * It is used to build the chapter hierarchy and logical structure of the document.
 */
class DocumentNode {

    constructor(id, level, name, parent, element) {
        this.id = id;
        this.level = level;
        this.name = name;
        this.parent = parent;
        this.element = element;
        this.children = [];
    }
}

/**
 * The model holds the current state of the document, including page and chapter info.
 * This is a singleton-style object with encapsulated state and utility functions.
 */
const model = (() => {
    const documentRoot = new DocumentNode("", 1, "root", null, null);

    const state = {
        totalPageNumbers: 0,
        currentPage: 1,
        currentChapterId: documentRoot.id,
        documentRoot,
        documentStructure: [documentRoot],
        documentPageElements: []
    };

    /**
     * Finds the index of a chapter in the structure by its ID.
     * Returns -1 if not found.
     */
    state.getChapterIndexById = function (chapterId) {
        return this.documentStructure.findIndex(node => node.id === chapterId);
    };

    return state;
})();
