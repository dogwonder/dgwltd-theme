<?php
// Error messages

// Include field validation errors
add_filter(
	'gform_validation_message',
	function ( $message, $form ) {
		if ( gf_upgrade()->get_submissions_block() ) {
			return $message;
		}

		$message  = '<div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">';
		$message .= '<h2 class="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>';
		$message .= '<div class="govuk-error-summary__body">';
		$message .= '<ul class="govuk-list govuk-error-summary__list">';

		foreach ( $form['fields'] as $field ) {
			if ( $field->failed_validation ) {
				// print_r($field);
				// $message .= sprintf( '<li>%s - %s</li>', GFCommon::get_label( $field ), $field->validation_message );
				$message .= sprintf( '<li><a href="#field_%s_%s">%s</a></li>', $field->formId, $field->id, $field->validation_message );
			}
		}

		$message .= '</ul></div></div>';

		return $message;
	},
	10,
	2
);


// WGAC compliance
// Add autocomplete to fields
// Email
add_filter(
	'gform_field_content',
	function ( $field_content, $field ) {
		if ( $field->type === 'email' ) {
			return str_replace( 'type=', "autocomplete='email' type=", $field_content );
		}
		return $field_content;
	},
	10,
	2
);

// Phone
add_filter(
	'gform_field_content',
	function ( $field_content, $field ) {
		if ( $field->type === 'tel' ) {
			return str_replace( 'type=', "autocomplete='tel' type=", $field_content );
		}
		return $field_content;
	},
	10,
	2
);


/**
 * @version  1.0
 * @package  DGWLTD
 * @author   David Smith <david@gravitywiz.com>
 * @license  GPL-2.0+
 * @link     http://gravitywiz.com/
 */
add_filter( 'gform_shortcode_entry_count', 'dgwltd_entry_count_shortcode', 10, 2 );
function dgwltd_entry_count_shortcode( $output, $atts ) {

    // Basic usage
    /*
    [gravityforms action="entry_count" id="your_form_id"]
    [gravityforms action="entry_count" id="2"]
	[gravityforms action="entry_count" id="6" status="total" total="100"]
    */

    // phpcs:ignore WordPress.PHP.DontExtract.extract_extract
    extract( shortcode_atts( array(
        'id'     => false,
        'status' => 'total', // accepts 'total', 'unread', 'starred', 'trash', 'spam'
        'format' => false, // should be 'comma', 'decimal'
        'total'  => false, // allows setting a custom total
    ), $atts ) );

    $valid_statuses = array( 'total', 'unread', 'starred', 'trash', 'spam' );

    if ( ! $id || ! in_array( $status, $valid_statuses ) ) {
        return current_user_can( 'update_core' ) ? __( 'Invalid "id" (the form ID) or "status" (i.e. "total", "trash", etc.) parameter passed.' ) : '';
    }

    $counts = GFFormsModel::get_form_counts( $id );
    $count = rgar( $counts, $status );
    $total = $total ? $total : rgar( $counts, 'total' );

    if ( $format ) {
        $format = $format == 'decimal' ? '.' : ',';
        $count = number_format( $count, 0, false, $format );
    }

    $percentage = $total > 0 ? ( $count / $total ) * 100 : 0;

	$rand = rand(1, 1000);

	$output = '<div class="dgwltd-progress">';
    $output .= '<label class="dgwltd-progress__label" for="progressbar' . $rand . '">';
    $output .= sprintf( esc_html__( '%1$s of our goal of %2$s', 'dgwltd' ), '<span data-count>' . $count . '</span>', $total );
    $output .= '</label>';
    $output .= '<div data-progress-meter class="dgwltd-progress__bar" id="progressbar' . $rand . '" role="progressbar" aria-valuenow="' . $percentage . '" aria-valuemin="0" aria-valuemax="100">';
    $output .= '<span style="width: ' . $percentage . '%;"></span>';
    $output .= '</div>';
    $output .= '</div>';

    return $output;
}