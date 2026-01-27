/**
 * MIT License - see full text in LICENSE
 * Originally by: M. Kruczek, K. Jankowska
 * Refactored and maintained by: Patryk Miś
 */

/**
 * A collection of pure utility functions to support DOM manipulation and common operations.
 *
 * These functions are intended to reduce boilerplate code and improve readability across the application.
 * They are stateless, context-agnostic, and reusable across different modules.
 */
const helpers = {

    /**
     * Binds a click event handler to the element with the given ID.
     *
     * @param {string} id - The ID of the DOM element to attach the handler to.
     * @param {Function} handler - The function to call when the element is clicked.
     */
    bindClick(id, handler) {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", handler);
    },

    /**
     * Creates a DOM element with the given tag, attributes, and optional text content.
     *
     * Automatically assigns attributes as DOM properties when possible (e.g. className, type).
     * Falls back to setAttribute for non-standard or data-* attributes.
     *
     * @param {string} tag - The tag name of the element (e.g., "div", "button").
     * @param {Object} attrs - A key-value map of attributes or properties to apply.
     * @param {string} [text=""] - Optional text content to insert into the element.
     * @returns {HTMLElement} - The newly created DOM element.
     */
    makeEl(tag, attrs = {}, text = "") {
        const e = document.createElement(tag);
        for (const [key, value] of Object.entries(attrs)) {
            if (key in e) e[key] = value;
            else e.setAttribute(key, value);
        }
        if (text) e.textContent = text;
        return e;
    },

    /**
     * Sets or removes the disabled state on a <button> or <a> element,
     * handling visual, functional, and semantic accessibility aspects.
     *
     * - For <button>: applies or removes the 'disabled' attribute and Bootstrap's 'disabled' class
     * - For <a>: uses 'aria-disabled' and removes it from the tab order with 'tabindex="-1"'
     *   since native 'disabled' is not valid on links
     *
     * This helper ensures proper behavior and accessibility without relying on invalid markup.
     *
     * @param {HTMLElement} el - Target element, either a <button> or <a>
     * @param {boolean} isDisabled - Whether the element should be disabled
     */
    setDisabled(el, isDisabled) {
        const isButton = el.tagName === "BUTTON";
        const isLink = el.tagName === "A";

        if (isDisabled) {
            el.classList.add("disabled");

            if (isButton) {
                el.setAttribute("disabled", "true");
            } else if (isLink) {
                el.setAttribute("aria-disabled", "true");
                el.setAttribute("tabindex", "-1");
            }
        } else {
            el.classList.remove("disabled");

            if (isButton) {
                el.removeAttribute("disabled");
            } else if (isLink) {
                el.removeAttribute("aria-disabled");
                el.removeAttribute("tabindex");
            }
        }
    }
};
