<?php
/**
 * Template Name: Style Book
 *
 * The template for displaying all blocks
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package dgwltd
 */

get_header();
global $post;
$paged = get_query_var("paged") ? get_query_var("paged") : 1;
?>
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/dist/js/prism/prism.css">
<style>
.section {
	margin-block-start: var(--wp--custom--spacing--xl);
}
.section:not(:last-of-type):before {
	display: block;
    content: "";
    border-top: 1px solid var(--wp--preset--color--secondary);
	padding-block-start: var(--wp--custom--spacing--md);
    margin-block-start: var(--wp--custom--spacing--lg);
    margin-inline: 0;
}
.section:has(.dgwltd-hero) {
	grid-column: 1 / -1;
}
.section:has(.dgwltd-hero) > *:not(.dgwltd-hero):not(.dgwltd-banner) {
	width: 100%;
  	max-width: clamp(16rem,calc(var(--wp--custom--width--container) + calc(var(--wp--custom--spacing--md) * 2)),100vw);
	margin-inline: auto;
}
.grid {
	--grid-min-item-size: 8rem;
}
.item {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.item span {
	font-size: var(--wp--preset--font-size--xs);
	margin-block-start: var(--wp--custom--spacing--sm);
}
.type .size {
	word-break: break-word;
}
.type .size span {
	color: var(--wp--preset--color--primary);
	display: block;
	font-weight: 700;
    line-height: 1;
}
code.language-html {
	padding: var(--wp--custom--spacing--xs) !important;
	font-size: var(--wp--preset--font-size--xs);
	flex: 1;
}
.code-icon {
	position: absolute;
	bottom: 0.5rem;
	right: 0.5rem;
	height: 1em;
}
.code-icon:hover {
	cursor: pointer;
}
.code-icon svg {
	height: 1em;
	width: 1em;
}
.copied:after {
	content: 'Copied!';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: var(--wp--preset--color--light);
	background-color: rgba(0,0,0,0.7);
	font-size: var(--wp--preset--font-size--sm);
	padding: 0.4rem;
	text-shadow: none;
	font-family: var(--body);
	border: 0;
}
.swatch {
	position: relative;
	border-radius: 0;
	width: 4rem;
	height: 4rem;
}
.swatch:hover {
	cursor: pointer;
}
.space span:first-of-type {
	min-width: 7ch;
	display: inline-block;
}
.space span:last-of-type {
	margin-inline-start: 1ch;
}
.buttons {
    margin-block-end: var(--wp--custom--spacing--l);
}
.buttons:last-of-type {
	margin-block-end: 0;
}
.button {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: var(--wp--custom--spacing--s);
}
</style>
<div id="primary" class="dgwltd-content-wrapper">

		<div class="entry-header">
            <div class="stack">
			<?php while (have_posts()):
            the_post();
            echo do_blocks(
                '<!-- wp:post-title {"level":1,"className":"wp-block-post-title"} /-->'
            );
        endwhile;
        // End of the loop.
        ?>

			<nav class="dgwltd-contents-list">
				<h2 class="dgwltd-contents-list__title"><?php esc_html_e(
					"Contents",
					"cfc"
				); ?></h2>
				<ol class="dgwltd-contents-list__list"></ol>
			</nav>
            </div>
		</div>

		<div class="entry-content is-layout-flow">


		<?php
  // check if theme.json is being used and if so, grab the settings
  $color_palette = [];
  $font_families = [];
  $font_sizes = [];
  $spacing = [];

  if (class_exists("WP_Theme_JSON_Resolver")) {
      $settings = WP_Theme_JSON_Resolver::get_theme_data()->get_settings();

      // full theme color palette
      if (isset($settings["color"]["palette"]["theme"])) {
          $color_palette = $settings["color"]["palette"]["theme"];
      }

      //Typography - font families
      if (isset($settings["typography"]["fontFamilies"]["theme"])) {
          $font_families = $settings["typography"]["fontFamilies"]["theme"];
      }

      //Typography - font sizes
      if (isset($settings["typography"]["fontSizes"]["theme"])) {
          $font_sizes = $settings["typography"]["fontSizes"]["theme"];
      }

      //Spacing
      if (isset($settings["spacing"]["spacingSizes"]["theme"])) {
          $spacing = $settings["spacing"]["spacingSizes"]["theme"];
      }

      //Fluid spacing
      if (isset($settings["custom"]["spacing"])) {
          $fluid_spacing = $settings["custom"]["spacing"];
      }
  }

  echo '<div class="section stack">';
  echo '<h2 id="color-palette">Color palette</h2>';
  echo "<p>Click on a color to copy the hex color value</p>";
  //Loop through $color_palette and cxreate a div with the color
  echo '<div class="grid">';
  foreach ($color_palette as $color) {
      echo '<div class="item"><div style="background-color:' .
          $color["color"] .
          ';" class="swatch" data-hex="' .
          $color["color"] .
          '"></div><span>' .
          $color["name"] .
          "<br/>" .
          $color["color"] .
          "</span></div>";
  }
  echo "</div>";

  echo "</div>";

  echo '<div class="section stack">';
  echo '<h2 id="font-families">Font families</h2>';
  //Loop through $font_families and cxreate a div with the color
  echo '<div class="">';
  foreach ($font_families as $family) {
      //If the font has the fontFace property, use it
      if (isset($family["fontFace"])) {
          echo '<div class="dgwltd-text-l" style="font-family:' .
              $family["fontFace"]["0"]["fontFamily"] .
              ";font-weight:" .
              $family["fontFace"]["0"]["fontWeight"] .
              '">' .
              $family["name"] .
              "</div>";
      } else {
          echo '<div class="dgwltd-text-l" style="font-family:' .
              $family["fontFamily"] .
              ';">' .
              $family["name"] .
              "</div>";
      }
  }
  echo "</div>";
  echo "</div>";

  echo '<div class="section stack">';
  echo '<h2 id="font-sizes">Font sizes</h2>';
  //Loop through $font_sizes and cxreate a div with the color
  echo '<div class="type stack">';
  function getFontSize($size, $key)
  {
      $fontSize = $size["fluid"] ? $size["fluid"][$key] : $size["size"];
      $fontSize = str_replace("rem", "", $fontSize);
      return $fontSize * 16;
  }

  foreach ($font_sizes as $size) {
      echo '<div class="">';

      $fontSizeMin = getFontSize($size, "min");
      $fontSizeMax = getFontSize($size, "max");
      $sizeClass = "size size--{$size["slug"]}";
      $slug = $size["slug"];
      $slug = str_replace(
          ["2xl", "3xl", "4xl"],
          ["2-xl", "3-xl", "4-xl"],
          $size["slug"]
      );
      $fontSizeStyle = "font-size:var(--wp--preset--font-size--{$slug})";
      $sizeText = "Size {$size["name"]} — Velit gravida aliquet conubia";

      if ($size["fluid"]) {
          echo "<div class='{$sizeClass}'><span style='{$fontSizeStyle}'>{$sizeText}</span>Min - font-size: {$fontSizeMin}px<br>Max - font-size: {$fontSizeMax}px</div>";
      } else {
          echo "<div class='{$sizeClass}'><span style='{$fontSizeStyle}'>{$sizeText}</span>font-size: {$fontSizeMax}px</div>";
      }

      echo "</div>";
  }
  echo "</div>";
  echo "</div>";

  echo '<div class="section stack">';
  echo '<h2 id="spacing">Spacing</h2>';
  //Loop through $spacing and cxreate a div with the color
  echo '<div class="mt-2">';
  foreach ($fluid_spacing as $key => $value) {
      if ($key === "gap" || $key === "baseline") {
          continue;
      }
      echo "space-$key — $value<br />";
  }
  echo "</div>";
  echo "</div>";

  echo '<div class="section stack">';
  echo '<h2 id="lists">Lists</h2>';

//Loop through $spacing and cxreate a div with the color
?>
		<div style="max-width: 40rem">
		<ol>
			<li>Ordered list item - Eiusmod eu mollit cillum.</li>
			<li>Ordered list item - Deserunt pariatur ea ad enim pariatur non minim anim adipiscing ea laborum eu commodo deserunt id culpa ipsum laborum eu</li>
			<li>Ordered list item - Voluptate cupidatat lorem, aliquip in.</li>
			<li>Ordered list item - Non amet voluptate tempor nostrud sunt.</li>
		</ol>
		<ul>
			<li>Unordered list item - Nisi veniam ex sint.</li>
			<li>Unordered list item - Irure officia sed, quis lorem.</li>
			<li>Unordered list item - Sed sed lorem culpa ullamco commodo consectetur cupidatat laboris commodo cupidatat sit mollit lorem et enim eiusmod deserunt et voluptate</li>
			<li>Unordered list item - Veniam, exercitation enim amet id sit consequat consequat.</li>
		</ul>
        <br><br>
        <p><a href="#">Cillum, consectetur nostrud nulla.</a></p>
		</div>
		<?php echo "</div>"; ?>

		<div class="section stack">
		<h2 id="buttons">Buttons</h2>
		<h3>Default buttons</h3>
		<div class="grid" style="--grid-min-item-size: 16rem;">
			<div class="button">
				<button class="dgwltd-button">Click me!</button>
				<code class="language-html mt-3">
					&lt;button class="dgwltd-button"&gt;<?php echo htmlentities("Click me!"); ?>&lt;/button&gt;
				</code>
			</div>
		</div>
		</div>
		
		<?php
        echo '<div class="section stack">';
                echo '<h2 id="pagination">Pagination</h2>';
                $post_args = [
                    "post_type" => "page",
                    "posts_per_page" => "2",
                    "paged" => $paged,
                ];
                $blog_query = new WP_Query($post_args);
                if ($blog_query->have_posts()):
                    $total_pages = $blog_query->max_num_pages;
                    include locate_template("template-parts/_molecules/pagination-query.php");
                endif;
                wp_reset_query();
                echo "</div>";
        ?>



		<div class="section stack components">
		<h2 id="components">Components</h2>	
		<?php while (have_posts()):
	      the_post();
    	  the_content();
		endwhile;
		// End of the loop.
		?>
		</div>


	</div>	


</div><!-- #primary -->
<script>
document.addEventListener("DOMContentLoaded", function() {

		const copyValue = (elem, atttribute) =>{  

		document.querySelectorAll(elem).forEach(item => {
			item.addEventListener('click', event => {
				//Create a temporary input element
				const el = document.createElement('textarea');
				//Add visually hidden class to the input element
				el.classList.add('visually-hidden');
				//Set the value of the input to the data-hex attribute of the clicked element
				el.value = item.getAttribute(atttribute);
				//Append the input to the body
				document.body.appendChild(el);
				//Select the input
				el.select();
				//Copy the input to the clipboard
				document.execCommand('copy');
				//Add a class to the swatch for 1 second to show the user that the color has been copied then remove the class
				item.classList.add('copied');
				setTimeout(() => {
					item.classList.remove('copied');
				}, 2000);
			})
		})

		};

		copyValue('.icon', 'data-html');
		copyValue('.swatch', 'data-hex');

		document.querySelectorAll('code').forEach(code => {
		//Add an icon to the code block
		const icon = document.createElement('span');
		icon.classList.add('code-icon');
		icon.innerHTML = '<svg role="presentation" focusable="false"><use xlink:href="#icon-copy" /></svg>';
		//Add the icon after the code block
		code.parentNode.insertBefore(icon, code.nextSibling);
		//If the icon is clicked copy the code to the clipboard
		icon.addEventListener('click', event => {
			//Create a temporary input element
			const el = document.createElement('textarea');
			//Add visually hidden class to the input element
			el.classList.add('visually-hidden');
			//Set the value of the input to the data-hex attribute of the clicked element
			el.value = code.innerText;
			//Append the input to the body
			document.body.appendChild(el);
			//Select the input
			el.select();
			//Copy the input to the clipboard
			document.execCommand('copy');
			//Add a class to the swatch for 1 second to show the user that the color has been copied then remove the class
			code.classList.add('copied');
			setTimeout(() => {
				code.classList.remove('copied');
			}, 2000);
		});
	});

	//Get all H2 elements in the content
	const headings = document.querySelectorAll('.section > h2');
	//Loop through the headings and add to ol.dgwltd-contents-list__list
	headings.forEach(heading => {
		//Create a new li element
		const li = document.createElement('li');
		//Create a new a element
		const a = document.createElement('a');
		//Set the href of the a element to the id of the heading
		a.href = '#' + heading.id;
		//Set the text of the a element to the text of the heading
		a.innerText = heading.innerText;
		//Append the a element to the li element
		li.appendChild(a);
		//Append the li element to the ol element
		document.querySelector('.dgwltd-contents-list__list').appendChild(li);
	});

});
</script>
<script src="<?php echo get_template_directory_uri(); ?>/dist/js/prism/prism.js"></script>
<?php get_footer();
