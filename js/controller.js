/**
 * MIT License - see full text in LICENSE
 * Originally by: M. Kruczek, K. Jankowska
 * Refactored and maintained by: Patryk Miœ
 */

/**
 * Controller for handling all user-triggered interactions (e.g., buttons, forms).
 */
const ctrl = function() {

    /**
     * Handles form submission to navigate to a specific page.
     * Gets page number from the form and validates it.
     */
    function navigateToPage(event) {
        event.preventDefault();
const form = Object.fromEntries(new FormData(document.getElementById("goToPageForm")));
        if (Util.isNotValidPageNumber(form.pageInput)) {
            alert("Brak podanego numeru strony w publikacji");
            return;
        }
        _navigateToPage(form.pageInput);
    }

    /**
     * Helper functions related to page number validation.
     */
    const Util = {
        isNotValidPageNumber: function(pageNumber) {
            return !Number.isInteger(+pageNumber) ||
                +pageNumber > model.totalPageNumbers ||
                +pageNumber < 1;
        }
    }

    // Navigation handlers for chapters and pages
    function navigateToNextPage() {
        _navigateToPage(parseInt(model.currentPage, 10) + 1);  // base 10 for safety
    }

    function navigateToPrevPage() {
        _navigateToPage(parseInt(model.currentPage, 10) - 1);  // base 10 for safety
    }

    function navigateToNextChapter() {
        _navigateToChapterWithOffset(1);
    }

    function navigateToPrevChapter() {
        _navigateToChapterWithOffset(-1);
    }

    /**
     * Navigates to a chapter offset from the current one.
     * (e.g., +1 for next, -1 for previous)
     */
    function _navigateToChapterWithOffset(offset) {
        const currentChapterIndex = model.getChapterIndexById(model.currentChapterId);
        if (currentChapterIndex < 0) {
            console.error("Current chapter cannot be found in document structure");
            return;
        }
        const targetChapterNode = model.documentStructure[currentChapterIndex + offset]
        if (!targetChapterNode || targetChapterNode.name === "root") {
            alert("Nie ma wiêcej rozdzia³ów")
            return;
        }
        const targetElement = document.getElementById(targetChapterNode.id);
        targetElement.scrollIntoView();
        targetElement.focus({ preventScroll: true });
        model.currentChapterId = targetChapterNode.id;
    }

    /**
     * Navigates to the page with the given number.
     */
    function _navigateToPage(targetPageNumber) {
        if (_isNotValidPageNumber(targetPageNumber)) {
            alert("Nie ma wiêcej stron")
            return;
        }
        const targetElement = document.getElementById(util.createPageId(targetPageNumber));
        targetElement.scrollIntoView();
        targetElement.focus({ preventScroll: true });
        model.currentPage = targetPageNumber;
    }

    function _isNotValidPageNumber(pageNumber) {
        return !Number.isInteger(+pageNumber) ||
            +pageNumber > model.totalPageNumbers ||
            +pageNumber < 1;
    }

    return {
        navigateToPage,
        navigateToNextPage,
        navigateToPrevPage,
        navigateToPrevChapter,
        navigateToNextChapter
    }
}();

/**
 * Utility helper for constructing IDs from page numbers.
 */
const util = {
    createPageId: function(pageNumber) {
        return `page-${pageNumber}`;
    }
}
