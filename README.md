# Accessible Book Template

Refactored and accessible HTML template for digital books, optimized for screen readers and offline use.  
Originally developed by Laboratory of Tyfloinformatics at Wrocław University of Science and Technology.  
Refactored, modernized, and maintained by Patryk Miś.

## Features

- Screen reader-friendly (tested with NVDA and JAWS)
- Fully offline-compatible (except MathJax)
- Modern JavaScript (ES6+), no jQuery
- Bootstrap 5 (locally bundled)
- Lightweight and efficient - works on older devices (e.g., iOS 15.8+)
- MathJax-compatible or pure MathML (optional)
- Code block copy buttons with clipboard.js
- Highlight.js syntax highlighting (v11+)

## Project structure

```

project/
│
├── css/             # Stylesheets (Bootstrap, highlight.js themes, etc.)
├── js/              # Own scripts (main.js, view.js, controller.js, etc.)
├── vendor/          # External libraries (ClipboardJS, MathJax, Bootstrap)
├── images/          # Book-specific assets (e.g., logos, icons, pictures)
├── docs/            # Internal documentation and book authoring guidelines
├── index.html       # Entry point
└── LICENSE

```

## Authoring Books

See [`docs/GUIDELINES.md`](docs/GUIDELINES.md) for how to create new books using this template.

## License Clarification

This project is released under the [MIT License](LICENSE).

⚠️ The original version of this template included a clause stating:

> "You must paste this header in all sublicenses of the software. The information about main programmer must be in all subversions of this application."

This clause is **not part of the MIT License** and is therefore **legally invalid** within its context. It was never enforced in the source code or in practice.

The current refactored version:
- **Retains full attribution to the original authors**, including metadata and comments;
- **Removes all non-MIT-compliant language**, ensuring full compatibility with standard open source workflows;
- Fully complies with the spirit and letter of the MIT license.
