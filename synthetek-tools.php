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
        }

        /**
         * Define Constants
         */
        public function define_constants(){
            // Path/URL to root of this plugin, with trailing slash.
            define ( 'SYNTHETEK_TOOLS_PATH', plugin_dir_path( __FILE__ ) );
            define ( 'SYNTHETEK_TOOLS_URL', plugin_dir_url( __FILE__ ) );
            define ( 'SYNTHETEK_TOOLS_VERSION', '1.0.0' );
        }
    }
}

if( class_exists( 'Synthetek_Tools' ) ){
    $mv_testimonials = new Synthetek_Tools();
}