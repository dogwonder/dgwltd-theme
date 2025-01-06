<?php
/*
 * @author   Andy Fragen
 * @license  MIT
 * @link     https://github.com/afragen/git-updater-lite
 * @package  git-updater-lite
 */

namespace Fragen\Git_Updater;

/**
 * Exit if called directly.
 */
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( ! class_exists( 'Fragen\\Git_Updater\\Lite' ) ) {
	/**
	 * Class Lite
	 */
	final class Lite {

		// phpcs:disable Generic.Commenting.DocComment.MissingShort
		/** @var string */
		protected $file;

		/** @var string */
		protected $slug;

		/** @var string */
		protected $local_version;

		/** @var \stdClass */
		protected $api_data;

		/** @var string */
		protected $update_server;
		// phpcs:enable

		/**
		 * Constructor.
		 *
		 * @param string $file_path File path of plugin/theme.
		 */
		public function __construct( string $file_path ) {
			if ( str_contains( $file_path, 'functions.php' ) ) {
				$file_path  = dirname( $file_path ) . '/style.css';
				$this->file = basename( dirname( $file_path ) );
			} else {
				$this->file = basename( dirname( $file_path ) ) . '/' . basename( $file_path );
			}
			$this->slug          = dirname( $this->file );
			$this->local_version = get_file_data( $file_path, array( 'Version' => 'Version' ) )['Version'];
			$this->update_server = apply_filters( 'gul_update_server', null );
		}

		/**
		 * Get API data.
		 *
		 * @global string $pagenow Current page.
		 * @return void|\WP_Error
		 */
		public function run() {
			global $pagenow;

			// Only run on the following pages.
			$pages            = array( 'update-core.php', 'update.php', 'plugins.php', 'themes.php' );
			$view_details     = array( 'plugin-install.php', 'theme-install.php' );
			$autoupdate_pages = array( 'admin-ajax.php', 'index.php', 'wp-cron.php' );
			if ( ! in_array( $pagenow, array_merge( $pages, $view_details, $autoupdate_pages ), true ) ) {
				return;
			}

			if ( null === $this->update_server ) {
				return new \WP_Error( 'no_domain', 'No update server domain' );
			}
			$url      = "$this->update_server/wp-json/git-updater/v1/update-api/?slug=$this->slug";
			$response = get_site_transient( "git-updater-lite_{$this->file}" );
			if ( ! $response ) {
				$response = wp_remote_post( $url );
				if ( is_wp_error( $response ) ) {
					return $response;
				}

				$this->api_data = (object) json_decode( wp_remote_retrieve_body( $response ), true );
				if ( null === $this->api_data || property_exists( $this->api_data, 'error' ) ) {
					return new \WP_Error( 'non_json_api_response', 'Poorly formed JSON', $response );
				}
				$this->api_data->file = $this->file;

				/*
				* Set transient for 5 minutes as AWS sets 5 minute timeout
				* for release asset redirect.
				*
				* Set limited timeout so wp_remote_get() not hit as frequently.
				* wp_remote_post() for plugin/theme check can run on every pageload
				* for certain pages.
				*/
				set_site_transient( "git-updater-lite_{$this->file}", $this->api_data, 5 * \MINUTE_IN_SECONDS );
			} else {
				if ( property_exists( $response, 'error' ) ) {
					return new \WP_Error( 'repo-no-exist', 'Specified repo does not exist' );
				}
				$this->api_data = $response;
			}

			$this->load_hooks();
		}

		/**
		 * Load hooks.
		 *
		 * @return void
		 */
		public function load_hooks() {
			$type = $this->api_data->type;
			add_filter( 'upgrader_source_selection', array( $this, 'upgrader_source_selection' ), 10, 4 );
			add_filter( "{$type}s_api", array( $this, 'repo_api_details' ), 99, 3 );
			add_filter( "site_transient_update_{$type}s", array( $this, 'update_site_transient' ), 15, 1 );

			// Load hook for adding authentication headers for download packages.
			add_filter(
				'upgrader_pre_download',
				function () {
					add_filter( 'http_request_args', array( $this, 'add_auth_header' ), 15, 2 );
					return false; // upgrader_pre_download filter default return value.
				}
			);
		}

		/**
		 * Correctly rename dependency for activation.
		 *
		 * @param string                           $source        Path fo $source.
		 * @param string                           $remote_source Path of $remote_source.
		 * @param \Plugin_Upgrader|\Theme_Upgrader $upgrader      An Upgrader object.
		 * @param array                            $hook_extra    Array of hook data.
		 *
		 * @return string|\WP_Error
		 */
		public function upgrader_source_selection( string $source, string $remote_source, \Plugin_Upgrader|\Theme_Upgrader $upgrader, $hook_extra = null ) {
			global $wp_filesystem;

			$new_source = $source;

			// Exit if installing.
			if ( isset( $hook_extra['action'] ) && 'install' === $hook_extra['action'] ) {
				return $source;
			}

			// Rename plugins.
			if ( $upgrader instanceof \Plugin_Upgrader ) {
				if ( isset( $hook_extra['plugin'] ) ) {
					$slug       = dirname( $hook_extra['plugin'] );
					$new_source = trailingslashit( $remote_source ) . $slug;
				}
			}

			// Rename themes.
			if ( $upgrader instanceof \Theme_Upgrader ) {
				if ( isset( $hook_extra['theme'] ) ) {
					$slug       = $hook_extra['theme'];
					$new_source = trailingslashit( $remote_source ) . $slug;
				}
			}

			if ( basename( $source ) === $slug ) {
				return $source;
			}

			if ( trailingslashit( strtolower( $source ) ) !== trailingslashit( strtolower( $new_source ) ) ) {
				$wp_filesystem->move( $source, $new_source, true );
			}

			return trailingslashit( $new_source );
		}

		/**
		 * Put changelog in plugins_api, return WP.org data as appropriate
		 *
		 * @param bool      $result   Default false.
		 * @param string    $action   The type of information being requested from the Plugin Installation API.
		 * @param \stdClass $response Repo API arguments.
		 *
		 * @return \stdClass|bool
		 */
		public function repo_api_details( $result, string $action, \stdClass $response ) {
			if ( "{$this->api_data->type}_information" !== $action ) {
				return $result;
			}

			// Exit if not our repo.
			if ( $response->slug !== $this->api_data->slug ) {
				return $result;
			}

			return $this->api_data;
		}

		/**
		 * Hook into site_transient_update_{plugins|themes} to update from GitHub.
		 *
		 * @param \stdClass $transient Plugin|Theme update transient.
		 *
		 * @return \stdClass
		 */
		public function update_site_transient( $transient ) {
			// needed to fix PHP 7.4 warning.
			if ( ! is_object( $transient ) ) {
				$transient = new \stdClass();
			}

			$response = array(
				'slug'                => $this->api_data->slug,
				$this->api_data->type => $this->api_data->file,
				'icons'               => (array) $this->api_data->icons,
				'banners'             => $this->api_data->banners,
				'branch'              => $this->api_data->branch,
				'type'                => "{$this->api_data->git}-{$this->api_data->type}",
				'update-supported'    => true,
				'requires'            => $this->api_data->requires,
				'requires_php'        => $this->api_data->requires_php,
			);

			if ( version_compare( $this->api_data->version, $this->local_version, '>' ) ) {
				$response_api_checked                         = array(
					'new_version'  => $this->api_data->version,
					'package'      => $this->api_data->download_link,
					'tested'       => $this->api_data->tested,
					'requires'     => $this->api_data->requires,
					'requires_php' => $this->api_data->requires_php,
				);
				$response                                     = array_merge( $response, $response_api_checked );
				$response                                     = 'plugin' === $this->api_data->type ? (object) $response : $response;
				$transient->response[ $this->api_data->file ] = $response;
			} else {
				$response = 'plugin' === $this->api_data->type ? (object) $response : $response;

				// Add repo without update to $transient->no_update for 'View details' link.
				$transient->no_update[ $this->api_data->file ] = $response;
			}

			return $transient;
		}

		/**
		 * Add auth header for download package.
		 *
		 * @param array  $args Array of http args.
		 * @param string $url  Download URL.
		 *
		 * @return array
		 */
		public function add_auth_header( $args, $url ) {
			if ( property_exists( $this->api_data, 'auth_header' )
				&& str_contains( $url, $this->api_data->slug )
			) {
				$args = array_merge( $args, $this->api_data->auth_header );
			}
			return $args;
		}
	}
}
