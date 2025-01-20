<?php
/**
 * Template Name: Carousel
 *
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package dgwltd
 */

get_header();
?>
<div id="primary" class="dgwltd-content-wrapper">

	<?php
	while ( have_posts() ) :
		the_post();
		get_template_part( 'template-parts/_templates/content-page' );
	endwhile; // End of the loop.
	?>
	
	<div class="entry-wrapper">
		<div class="gallery-grid">
			<div class="gallery-grid-wrapper">
					<figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
					<figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
					<figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
					<figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
					<figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
					<figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
          <figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
          <figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
          <figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
          <figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
          <figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
          <figure class="gallery-grid-item" data-loaded="true" data-show="true">
						<div class="gallery-grid-item-wrapper" data-animation-role="image">
							<img src="https://placehold.co/800x600" alt="Placeholder image">
						</div>
					</figure>
			</div>
		</div>
	</div>

</div>

<script>
class GalleryCarousel {
  constructor(selector) {
    this.galleryGrid = document.querySelector(selector);
    if (!this.galleryGrid) return;

    this.currentIndex = 0;
    this.init();

  }

  init() {
    this.attachStyles();
    this.createNavigationButtons();
    this.cacheElements();
    this.updateButtonsState();
    this.addEventListeners();
  }

  attachStyles() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        .gallery-grid {
          display: flex;
          flex-direction: row;
          position: relative;
		      width: 100%;
        }
        .gallery-grid-wrapper {
          display: flex;
		      position: relative;
		      z-index: 1;
          width: 100%;
          gap: 1rem;
          overflow: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .gallery-grid-item {
          scroll-snap-align: start;
          flex-shrink: 0;
          width: calc(25% - 0.66rem);
          height: calc(100% + 1rem);
        }
        .gallery-grid-item-wrapper {
          aspect-ratio: 1 / 1;
        }
        .gallery-grid-item-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .gallery-button {
          display: block;
          position: relative;
          appearance: none;
          background-color: transparent;
          border: none;
          padding: 0;
        }
        .gallery-button:hover {
          cursor: pointer;
        }
        .gallery-button svg {
          width: 2rem;
          height: 2rem;
          z-index: 2;
          position: absolute;
          top: calc(50% - 1rem);
        }
        .gallery-button--prev svg{
          margin-inline-start: -1rem;
        }
        .gallery-button--next svg {
          margin-inline-start: -1rem;
        }
        .gallery-button[disabled] {
          opacity: 0;
        }
      </style>`;
    this.galleryGrid.before(template.content.cloneNode(true));
  }

  createNavigationButtons() {
    const prevButton = this.createButton(
      "prevButton",
      "gallery-button--prev",
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z"/></svg>`
    );
    const nextButton = this.createButton(
      "nextButton",
      "gallery-button--next",
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z"/></svg>`
    );

    this.galleryGrid.prepend(prevButton);
    this.galleryGrid.append(nextButton);
  }

  createButton(id, className, svgContent) {
    const button = document.createElement("button");
    button.id = id;
    button.className = `gallery-button ${className}`;
    button.innerHTML = svgContent;
    return button;
  }

  cacheElements() {
    this.galleryWrapper = document.querySelector(".gallery-grid-wrapper");
    this.galleryItems = document.querySelectorAll(".gallery-grid-item");
    this.itemWidth = (this.galleryItems[0]?.offsetWidth || 0);
    this.visibleItems = Math.floor(this.galleryGrid.offsetWidth / this.itemWidth);
    this.prevButton = document.querySelector("#prevButton");
    this.nextButton = document.querySelector("#nextButton");
  }

  updateButtonsState() {
    this.prevButton.disabled = this.currentIndex === 0;
    this.nextButton.disabled = this.currentIndex + this.visibleItems >= this.galleryItems.length;
  }

  scrollGallery(direction) {

    const newIndex = this.currentIndex + direction * this.visibleItems;    
    if (newIndex < 0 || newIndex + this.visibleItems > this.galleryItems.length) return;

    this.currentIndex = newIndex;
    const targetItem = this.galleryItems[this.currentIndex];

    targetItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    this.updateButtonsState();
	
  }

  addEventListeners() {
    this.prevButton.addEventListener("click", () => this.scrollGallery(-1));
    this.nextButton.addEventListener("click", () => this.scrollGallery(1));
  }

  updateDimensions() {
    this.itemWidth = (this.galleryItems[0]?.offsetWidth || 0);
    this.visibleItems = Math.floor(this.galleryWrapper.offsetWidth / this.itemWidth);
    this.updateButtonsState();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new GalleryCarousel(".gallery-grid");
});

</script>

<!-- #primary -->
<?php
get_footer();
