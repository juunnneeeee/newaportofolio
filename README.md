# NEWA PORTFOLIO SYSTEM

A high-end, brutalist Bento Grid portfolio website engineered using vanilla HTML5, CSS3, and JavaScript (ES6+). Built to demonstrate premium typographic treatments, fluid interactive feedback loops, an ambient particle backplane, and advanced user interface animation techniques.

## Core Architectural Features

* **Monochromatic Theme Architecture**: Features responsive dark and light modes, controlled globally via custom CSS properties with native theme state persistence using localStorage.
* **Ambient Noise Layer**: Renders an svg-based procedural grain texture overlay that adds an editorial print feel to visual components.
* **Backplane Particles System**: Incorporates an optimized HTML5 Canvas particle generator. It scales dynamically with the window size and implements cursor-tracking calculations to generate a fluid, magnetic breeze deflection effect when the mouse moves over the backplane.
* **Traveling Timezone Clock**: A custom header widget that automatically cycles through world cities (Tokyo, London, New York, Paris) every four seconds. Incorporates transition states to fade and slide text updates.
* **Physics-Inspired Draggable Carousel**: A custom touch-friendly slide deck allowing horizontal drag navigation. It showcases four unique graphic and user interface design mockups with dynamic visual indicators and a synchronized progress bar.
* **Linear-Interpolated Image Follower**: Under the Selected Works list, a linear interpolation (LERP) trailing reveal frame smoothly tracks raw cursor coordinates to preview project mockups.
* **Full-Width Responsive Grid Folding**: The layout adjusts from a 12-column grid to responsive 6-column medium screen grids and 1-column mobile feeds.

## Project Structure

* `index.html`: Holds the primary semantic HTML5 markup, bento sections, SVG assets, and particle canvas node.
* `style.css`: Houses custom design system tokens, typography rules, grid column spans, interactive state animations, and media queries.
* `script.js`: Orchestrates the canvas rendering loop, vector drag calculations, interpolation loops, traveling timezone scheduler, copy mechanism, and Intersection Observer stats counter.
* `assets/images/`: Contains monochromatic optimized design mockups and profile portraits.

## Installation and Local Execution

To run the project locally without build step overhead:

1. Clone or navigate to the repository directory.
2. Initialize a local static server to serve files correctly (required for media assets and local references):

   Using Python:
   ```bash
   python3 -m http.server 8000
   ```

   Using Node.js:
   ```bash
   npx serve .
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Development and Customization Guidelines

* **Typography**: Typography is driven by Outfit and Syne from Google Fonts. If adding custom headings, ensure uppercase transforms and Syne geometric font weights are maintained.
* **Backdrop**: Do not add standard pointers or events to the backdrop canvas, as `pointer-events: none` is used to allow card click actions to bypass the background overlay.
* **Branding**: Identity references are mapped to NEWA and Alex Newa as design placeholders.
