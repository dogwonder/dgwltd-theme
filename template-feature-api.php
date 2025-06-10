<?php
/**
 * Template Name: Feauture API Registry
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

	<div class="entry-header">
				<h1 class="wp-block-post-title"><?php the_title(); ?></h1>
	</div>

	
    <div class="entry-content is-layout-flow">
        <div class="feature-api-list">
            <?php
            // Check if the Feature API is loaded
            if (class_exists('WP_Feature_Registry')) {

                $registry = WP_Feature_Registry::get_instance();

                //Print the registry object into code block
                // echo '<pre class="wp-block-code"><code>' . htmlspecialchars(print_r($registry, true)) . '</code></pre>';

                // Helper function to extract property using reflection
                function get_prop($object, $propName) {
                    $reflection = new ReflectionClass($object);
                    $prop = $reflection->getProperty($propName);
                    $prop->setAccessible(true);
                    return $prop->getValue($object);
                }
                
                // Get repository and features
                $repository = get_prop($registry, 'repository');
                $features = get_prop($repository, 'features');
                
                if (!empty($features)) {
                    echo '<table class="wp-table feature-api-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Categories</th>
                                <th>Input Schema</th>
                                <th>Source</th>
                            </tr>
                        </thead>
                        <tbody>';
                    
                    foreach ($features as $key => $feature) {
                        $name = get_prop($feature, 'name');
                        $desc = get_prop($feature, 'description');
                        $type = get_prop($feature, 'type');
                        $categories = get_prop($feature, 'categories');
                        $categories_str = !empty($categories) ? implode(', ', $categories) : '';
                        
                        // Check for input schema
                        $input_schema = get_prop($feature, 'input_schema');
                        $input_schema_str = '';
                        if (!empty($input_schema)) {
                            $input_schema_str = '<details><summary>View Schema</summary><pre>' . 
                                               htmlspecialchars(json_encode($input_schema, JSON_PRETTY_PRINT)) . 
                                               '</pre></details>';
                        }
                        
                        // Determine source (core or plugin)
                        $source = (strpos($key, 'core/') === 0) ? 'WordPress Core' : 'Plugin';
                        
                        echo "<tr>
                            <td><code>{$key}</code></td>
                            <td>{$name}</td>
                            <td>{$desc}</td>
                            <td><span class='feature-type feature-type-{$type}'>{$type}</span></td>
                            <td>{$categories_str}</td>
                            <td>{$input_schema_str}</td>
                            <td>{$source}</td>
                        </tr>";
                    }
                    
                    echo '</tbody></table>';
                } else {
                    echo '<p>No features registered in the Feature API.</p>';
                }
            } else {
                echo '<p>WordPress Feature API is not enabled. This feature requires WordPress 6.5 or higher.</p>';
            }
            ?>
        </div>
    </div>
    

</div><!-- #primary -->
<?php
get_footer();
