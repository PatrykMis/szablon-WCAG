/**
 * MIT License - see full text in LICENSE
 * Originally by: M. Kruczek, K. Jankowska
 * Refactored and maintained by: Patryk Miœ
 */

/**
 * Initializes the ebook application after DOM is fully loaded.
 *
 * This script:
 * - Builds the document structure (pagination, headings, table of contents)
 * - Initializes page/chapter tracking and keyboard navigation
 * - Enables tooltips and syntax highlighting
 * - Adds clipboard buttons to code blocks
 * - (Optionally) renders trees using external libraries
 * - Registers all global event listeners
 *
 * Should be loaded at the end of <body> tag.
 */

document.addEventListener("DOMContentLoaded", () => {

    // 1. Paginate the document and structure chapters
    view.createPages();
    view.detectStructure();
    view.createTableOfContent();

    // 2. Initialize scroll-based tracking (page and chapter)
    view.spyOnCurrentPage();
    view.spyOnCurrentChapter();

    // 3. Enable UI features
    view.createTooltips();
    hljs.highlightAll();
    view.createCopyButtons();
    // view.renderTree();  // Currently unused: deprecated deque library

    // 4. Enable clipboard functionality
    new ClipboardJS(".copy-btn");

    // 5. Register global keyboard and button listeners
    helpers.bindClick("nextPageBtn", ctrl.navigateToNextPage);
    helpers.bindClick("prevPageBtn", ctrl.navigateToPrevPage);
    helpers.bindClick("nextChaptBtn", ctrl.navigateToNextChapter);
    helpers.bindClick("prevChaptBtn", ctrl.navigateToPrevChapter);
    document.getElementById("goToPageForm")
      .addEventListener("submit", ctrl.navigateToPage);
});
