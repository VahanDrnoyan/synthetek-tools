<?php

/**
 * Plugin Name: Synthetek Tools
 * Description: Enqueuing scripts for Synthetek Oxygen theme
 * Version: 1.0
 * Requires at least: 5.6
 * Requires PHP: 8.1
 * Text Domain: synthetek-tools
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

if( !class_exists( 'MV_Testimonials' ) ){

    class Synthetek_Tools{

        public function __construct() {

            // Define constants used througout the plugin
            $this->define_constants();
            add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ), 999 );


        }
        public function register_scripts(){
            wp_enqueue_script( 'jquery.ddslick.min', SYNTHETEK_TOOLS_URL . 'assets/js/jquery.ddslick.min.js', array( 'jquery' ), SYNTHETEK_TOOLS_VERSION, true );
            wp_enqueue_script( 'woocommerce-currency-switcher', SYNTHETEK_TOOLS_URL . 'assets/js/front.js', array( 'jquery' ), SYNTHETEK_TOOLS_VERSION, true );
            wp_enqueue_style('dashicons');

            $default_currency = 'USD'; // hardcoded
            $current_currency = \Synthetek\get_currency();

            $currencies = array(
                'AUD' => array(
                    'name' => 'AUD',
                    'rate' => 1,
                    'symbol' => 'A&#36;',
                    'position' => 'right',
                    'is_etalon' => 1,
                    'description' => 'Australian dollar',
                    'hide_cents' => 0,
                    'flag' => '',
                ),
                'USD' => array(
                    'name' => 'USD',
                    'rate' => 0.5,
                    'symbol' => '&#36;',
                    'position' => 'right',
                    'is_etalon' => 1,
                    'description' => 'USA dollar',
                    'hide_cents' => 0,
                    'flag' => '',
                ),
                'CAD' => array(
                    'name' => 'CAD',
                    'rate' => 0.5,
                    'symbol' => '&#36;',
                    'position' => 'right',
                    'is_etalon' => 1,
                    'description' => 'Canadian dollar',
                    'hide_cents' => 0,
                    'flag' => '',
                ),
                'EUR' => array(
                    'name' => 'EUR',
                    'rate' => 0.5,
                    'symbol' => '&euro;',
                    'position' => 'left_space',
                    'is_etalon' => 0,
                    'description' => 'European Euro',
                    'hide_cents' => 0,
                    'flag' => '',
                ),
                'GBP' => array(
                    'name' => 'GBP',
                    'rate' => 0.5,
                    'symbol' => '£',
                    'position' => 'left_space',
                    'is_etalon' => 0,
                    'description' => 'Pound sterling',
                    'hide_cents' => 0,
                    'flag' => '',
                ),
                'ZAR'=> array(
                    'name' => 'ZAR',
                    'rate' => 0.5,
                    'symbol' => 'R',
                    'position' => 'left_space',
                    'is_etalon' => 0,
                    'description' => 'South African rand',
                    'hide_cents' => 0,
                    'flag' => '',
                ),
                'HKD'=> array(
                    'name' => 'HKD',
                    'rate' => 0.5,
                    'symbol' => '&#36;',
                    'position' => 'right',
                    'is_etalon' => 0,
                    'description' => 'Hong Kong dollar',
                    'hide_cents' => 0,
                    'flag' => '',
                ),
                'NZD'=> array(
                    'name' => 'NZD',
                    'rate' => 0.5,
                    'symbol' => '&#36;',
                    'position' => 'right',
                    'is_etalon' => 0,
                    'description' => 'New Zealand dollar',
                    'hide_cents' => 0,
                    'flag' => '',
                ),
            );

            $no_cents = array(
                'JPY', 'TWD'
            );
            $woocs_array_of_get = '{}';
            $woocs_array_no_cents = json_encode($no_cents);

             $woocs_ajaxurl = admin_url('admin-ajax.php');
             $woocs_lang_loading = '';
            $woocs_shop_is_cached = 0;
            if (!empty($_GET)) {
                //sanitization of $_GET array
                $sanitized_get_array = array();
                foreach ($_GET as $key => $value) {
                    $sanitized_get_array[sanitize_text_field(esc_html($key))] = sanitize_text_field(esc_html($value));
                }
                $woocs_array_of_get = str_replace("'", "", json_encode($sanitized_get_array));
            }
            $checkout_url = remove_query_arg( array('currency'), wc_get_checkout_url() );

            $isLocalised = wp_localize_script( 'woocommerce-currency-switcher', 'SYNTHETEK_OPTIONS', array(
                'woocs_is_mobile' => (int) wp_is_mobile(),
                'woocs_drop_down_view' => "ddslick",
                'woocs_current_currency' => json_encode((isset($currencies[$current_currency]) ? $currencies[$current_currency] : $currencies[$default_currency])),
                'woocs_default_currency' => json_encode($currencies[$default_currency]),
                'woocs_array_of_get' => $woocs_array_of_get,
                'woocs_array_no_cents' => $woocs_array_no_cents,
                'woocs_ajaxurl' => $woocs_ajaxurl,
                'woocs_lang_loading' => $woocs_lang_loading,
                'woocs_shop_is_cached' => $woocs_shop_is_cached,
                'checkout_url' => $checkout_url
            ));

        }

        /**
         * Define Constants
         */
        public function define_constants(){
            // Path/URL to root of this plugin, with trailing slash.
            define ( 'SYNTHETEK_TOOLS_PATH', plugin_dir_path( __FILE__ ) );
            define ( 'SYNTHETEK_TOOLS_URL', plugin_dir_url( __FILE__ ) );
            define ( 'SYNTHETEK_TOOLS_VERSION', '1.0.1' );
        }
    }
}

if( class_exists( 'Synthetek_Tools' ) ){
    $mv_testimonials = new Synthetek_Tools();
}