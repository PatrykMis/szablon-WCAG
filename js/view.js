/**
 * MIT License - see full text in LICENSE
 * Originally by: M. Kruczek, K. Jankowska
 * Refactored and maintained by: Patryk Miś
 */

/**
 * Handles all DOM-related operations for rendering and updating the view layer.
 * Includes logic for paginating content, updating the TOC, managing tooltips,
 * highlighting, and synchronizing navigation state with the UI.
 *
 * This module is responsible solely for manipulating the visual layer,
 * and should not contain any business or model logic.
 */
const view = function() {
    const pageInput = document.getElementById("pageInput");
    const nextPageButton = document.getElementById("nextPageBtn");
    const prevPageButton = document.getElementById("prevPageBtn");
    const nextChapterButton = document.getElementById("nextChaptBtn");
    const prevChapterButton = document.getElementById("prevChaptBtn");
    let codeSnippetsCounter = 0;

    /**
     * Split document into pages based on span element with "nextPage" class
     */
    function createPages() {
        const nextPages = document.querySelectorAll(".nextPage");
        const total = nextPages.length;
        nextPages.forEach((element, index) => {
            if (index === total - 1) return;
            model.totalPageNumbers++;
            const br = helpers.makeEl("br");
            const span = helpers.makeEl("span", {
                id: util.createPageId(model.totalPageNumbers),
                className: "page-number",
                tabIndex: -1
            }, `Strona: ${model.totalPageNumbers}`);
            element.insertAdjacentElement("afterend", br);
            br.insertAdjacentElement("afterend", span);
            model.documentPageElements.push(span);
        });
        nextPages.forEach(el => el.remove());
    }

    /**
     * Creates copy buttons for code snipets
     */
    function createCopyButtons() {
        const preElements = document.querySelectorAll("pre");
        preElements.forEach((element) => {
            if (!element.querySelector("code")) return;
            const codeSnippetId = `snippet-${codeSnippetsCounter++}`;
            element.setAttribute("id", codeSnippetId);
            const copyButton = helpers.makeEl("button", {
                type: "button",
                className: "copy-btn btn btn-dark btn-sm",
                "data-clipboard-action": "copy",
                "data-clipboard-target": `#${codeSnippetId}`
                }, "Kopiuj kod źródłowy do schowka");
            const parent = element.parentElement;
            parent.insertAdjacentElement("afterend", copyButton);
        });
    }

    /**
     * Detects document structure based on headers in the document
     */
    function detectStructure() {
        let parent = model.documentRoot;
        const h1 = document.querySelector("h1");
        if (h1) h1.classList.add("chap-0");
        const headers = document.querySelectorAll("h2, h3, h4, h5, h6");
        headers.forEach(header => {
            if (header.classList.contains("no-toc")) return;
            const headerLevel = parseInt(header.nodeName.substring(1), 10);  // base 10 for safety
            while (headerLevel <= parent.level && parent.parent) {
                parent = parent.parent;
            }
            if (headerLevel - parent.level === 1) {
                parent = _createNewNodeAndAddToParent(header, parent);
            } else if (headerLevel - parent.level === 0) {
                parent = _createNewNodeAndAddToParent(header, parent.parent);
            } else {
                console.warn(`Not consistent document structure. Problematic element: ${header?.outerHTML || "[unknown]"}`);
            }
        });
    }

    /**
     * Creates table of content based on document structure
     */
    function createTableOfContent() {
        const tableOfContents = helpers.makeEl("ul", {
            className: "nav nav-pills flex-column"
        });

        addList(model.documentRoot.children, tableOfContents);
        document.getElementById("tableOfContent").appendChild(tableOfContents);

        function addList(nodeList, parent) {
            for (const node of nodeList) {
                const li = helpers.makeEl("li", {
                    className: "nav-item"
                });
                const a = helpers.makeEl("a", {
                    className: "nav-link",
                    href: `#${node.id}`
                }, node.name);
                li.appendChild(a);
                parent.appendChild(li);
                if (node.children && node.children.length > 0) {
                    const subLi = helpers.makeEl("li");
                    const subUl = helpers.makeEl("ul", {
                        className: "nav nav-pills flex-column ms-3"
                    });
                    subLi.appendChild(subUl);
                    parent.appendChild(subLi);
                    addList(node.children, subUl);
                }
            }
        }
    }

    /**
     * Spies on the page currently in the view. Keeps current page in the model and in the input element up to date.
     */
    function spyOnCurrentPage() {
        _updateCurrentPageState();
        _updatePageNavButtonsState();
        pageInput.value = model.currentPage;
        window.addEventListener("scroll", () => {
            _updateCurrentPageState();
            _updatePageNavButtonsState();
        });
    }

    /**
     * Updates the current page number in the model by checking
     * which page-number element is currently visible in the viewport.
     */
    function _updateCurrentPageState() {
        let current = 0,
            next = 1;
        let currentPage;
        while (!currentPage && next < model.documentPageElements.length) {
            const top = model.documentPageElements[current].getBoundingClientRect().top;
            const bottom = model.documentPageElements[next].getBoundingClientRect().top;
            if (top <= 1 && bottom >= 1) {
                currentPage = model.documentPageElements[current];
                break;
            }
            if (top > 5) {
                break;
            }
            current++;
            next++;
        }
        if (!currentPage && next == model.documentPageElements.length) {
            currentPage = model.documentPageElements[current];
        }
        if (currentPage && currentPage.id) {
            model.currentPage = _extractPageNumberFromId(currentPage.id);
            pageInput.value = model.currentPage;
        }
    }

    /**
     * Enables or disables the "next" and "previous" page buttons
     * based on whether the user is at the first or last page.
     */
    function _updatePageNavButtonsState() {
        const firstPage = model.documentPageElements[0];
        const lastPage = model.documentPageElements[model.documentPageElements.length - 1];
        _checkPageNavButtonState(firstPage, prevPageButton);
        _checkPageNavButtonState(lastPage, nextPageButton);
    }

    /**
     * Checks if the given page number is currently visible on screen.
     * If so, enables the corresponding navigation button.
     *
     * Used internally by _updatePageNavButtonsState().
     */
    function _checkPageNavButtonState(pageNumberElement, pageButton) {
        if (!pageNumberElement) {
            return;
        }
        if (_isInViewport(pageNumberElement)) {
            helpers.setDisabled(pageButton, true);
        } else {
            helpers.setDisabled(pageButton, false);
        }
    }

    /**
     * Returns true if the given element is fully or partially visible
     * within the current viewport (based on bounding rectangle).
     */
    function _isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    }

    /**
     * Spies on the chapter currently in the view. Keeps table of content link active and current chapter in the model up to date
     */
    function spyOnCurrentChapter() {
        const scrollSpy = new bootstrap.ScrollSpy(document.body, {
            target: "#tableOfContent",
            offset: 10
        });
        document.addEventListener("activate.bs.scrollspy", function (event) {
            const href = event.relatedTarget.getAttribute("href");
            if (href && href.startsWith("#")) {
                model.currentChapterId = href.substring(1);
            }
            const navbar = document.querySelector(".tfl-side-navbar");
            const activeLinks = document.querySelectorAll(".nav-link.active");
            if (activeLinks.length > 0) {
                navbar.scrollTop = activeLinks[activeLinks.length - 1].offsetTop;
            }
        });
        _updateChapterButtonState();
        window.addEventListener("scroll", _updateChapterButtonState);
    }

    /**
     * Enables or disables the "next" and "previous" chapter buttons
     * based on the position of the current chapter within the document structure.
     */
    function _updateChapterButtonState() {
        const firstChapterNode = model.documentStructure[1]; //because 0 element is root
        const lastChapterNode = model.documentStructure[model.documentStructure.length - 1];

        if (model.currentChapterId !== "") {
            _checkChapterNavButtonState(firstChapterNode, prevChapterButton);
        } else {
            helpers.setDisabled(prevChapterButton, true);
        }
        _checkChapterNavButtonState(lastChapterNode, nextChapterButton);
    }

    /**
     * Enables the given chapter navigation button (next/previous)
     * if the corresponding chapter node exists and is not the root.
     */
    function _checkChapterNavButtonState(chapterNodeToCheck, pageButton) {
        if (model.currentChapterId === chapterNodeToCheck.id || _isInViewport(chapterNodeToCheck.element)) {
            helpers.setDisabled(pageButton, true);
        } else {
            helpers.setDisabled(pageButton, false);
        }
    }

    /**
     * Creates tooltips
     */
    function createTooltips() {
        const tooltipTriggerList = document.querySelectorAll("[data-bs-toggle='tooltip']");
        tooltipTriggerList.forEach(el => {
            new bootstrap.Tooltip(el);
        });
    }

    /**
     * Extracts a numeric page number from a string ID like "page-12".
     * Returns NaN if the format is invalid.
     */
    function _extractPageNumberFromId(pageId) {
        return +pageId.substr(pageId.indexOf("-") + 1);
    }

    /**
     * Creates a new DocumentNode from the given heading element
     * and adds it as a child to the specified parent node.
     * Also sets its DOM attributes like id and tabindex.
     */
    function _createNewNodeAndAddToParent(currentElement, parent) {
        const parentId = parent.id || "chap";
        let nodeId = parentId + "-" + (parent.children.length + 1);
        currentElement.id = nodeId;
        currentElement.setAttribute("tabindex", "-1");
        const newNode = new DocumentNode(nodeId, +currentElement.nodeName.substring(1), currentElement.innerText, parent, currentElement);
        parent.children.push(newNode);
        model.documentStructure.push(newNode);
        return newNode;
    }

    /**
     * Creating a graph representation structure
     *
     * Legacy feature for rendering tree-like diagrams using deque-patterns library.
     * Currently deprecated due to library obsolescence and React-only updates.
     * See docs/TREES.md for historical reference or implementation examples.
     *
     * Note: Uses deprecated deque library.
     * TODO: Replace with modern alternative (if needed at all).
     */
    function renderTree() {
        const treeGroup = document.querySelectorAll(".tfl-deque-tree-no-select");
        treeGroup.forEach(el => {
            deque.createTree({ selectStyle: "" }, el);
        });
    }

    return {
        createPages,
        detectStructure,
        createTableOfContent,
        spyOnCurrentPage,
        spyOnCurrentChapter,
        createTooltips,
        createCopyButtons,
        // renderTree  // Currently unused: deprecated deque library
    }
}();
