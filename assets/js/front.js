var wocs_loading_first_time = true;
var woocs_array_of_get = jQuery.parseJSON(SYNTHETEK_OPTIONS.woocs_array_of_get);
var sumbit_currency_changing = true;//juts a flag variable for drop-down redraws when prices redraws by AJAX
jQuery(function ($) {

    jQuery.fn.life = function (types, data, fn) {
        jQuery(this.context).on(types, this.selector, data, fn);
        return this;
    };


    //wp-content\plugins\woocommerce\assets\js\frontend\cart.js
    if (Object.keys(woocs_array_of_get).length !== 0) {
        if ('currency' in woocs_array_of_get) {
            //console.log('here');
            //this code nessesary for correct redrawing of the shipping methods while currency changes on the cart page
            $('body.woocommerce-cart .shop_table.cart').closest('form').find('input[name="update_cart"]').prop('disabled', false);
            $('body.woocommerce-cart .shop_table.cart').closest('form').find('input[name="update_cart"]').trigger('click');
        }
    }

    //keeps data of $_GET array

    if (Object.keys(woocs_array_of_get).length == 0) {
        woocs_array_of_get = {};
    }


    var woocs_array_no_cents = jQuery.parseJSON(SYNTHETEK_OPTIONS.woocs_array_no_cents);


    if (woocs_array_of_get.currency != undefined || woocs_array_of_get.removed_item != undefined)
    {
        woocs_refresh_mini_cart(555);
    }
    //intercept adding to cart event to redraw mini-cart widget
    jQuery(document).on("adding_to_cart", function () {
        woocs_refresh_mini_cart(999);
    });

    //to make price popup mobile friendly
    jQuery('.woocs_price_info').life('click', function () {
        return false;
    });

    //+++++++++++++++++++++++++++++++++++++++++++++++
    //console.log(woocs_drop_down_view);
    if (SYNTHETEK_OPTIONS.woocs_drop_down_view == 'chosen' || SYNTHETEK_OPTIONS.woocs_drop_down_view == 'chosen_dark') {
        try {
            if (jQuery("select.woocommerce-currency-switcher").length) {
                jQuery("select.woocommerce-currency-switcher").chosen({
                    disable_search_threshold: 10
                });

                jQuery.each(jQuery('.woocommerce-currency-switcher-form .chosen-container'), function (index, obj) {
                    jQuery(obj).css({'width': jQuery(this).prev('select').data('width')});
                });
            }
        } catch (e) {
            console.log(e);
        }
    }



    if (SYNTHETEK_OPTIONS.woocs_drop_down_view == 'ddslick') {
        try {
            jQuery.each(jQuery('select.woocommerce-currency-switcher'), function (index, obj) {
                var width = jQuery(obj).data('width');
                var flag_position = jQuery(obj).data('flag-position');
                jQuery(obj).ddslick({
                    //data: ddData,
                    width: width,
                    imagePosition: flag_position,
                    selectText: "Select currency",
                    //background:'#ff0000',
                    onSelected: function (data) {
                        if (!wocs_loading_first_time)
                        {
                            var form = jQuery(data.selectedItem).closest('form.woocommerce-currency-switcher-form');
                            jQuery(form).find('input[name="woocommerce-currency-switcher"]').eq(0).val(data.selectedData.value);

                            if (Object.keys(woocs_array_of_get).length == 0) {
                                //jQuery(form).submit();
                                woocs_redirect(data.selectedData.value);
                            } else {
                                woocs_redirect(data.selectedData.value);
                            }

                        }
                    }
                });
            });

        } catch (e) {
            console.log(e);
        }
    }




    if (SYNTHETEK_OPTIONS.woocs_drop_down_view == 'wselect' && SYNTHETEK_OPTIONS.woocs_is_mobile != 1) {
        try {
            //https://github.com/websanova/wSelect#wselectjs
            jQuery('select.woocommerce-currency-switcher').wSelect({
                size: 7
            });
        } catch (e) {
            console.log(e);
        }
    }

    //for flags view instead of drop-down
    jQuery('.woocs_flag_view_item').click(function () {
        if (sumbit_currency_changing) {
            if (jQuery(this).hasClass('woocs_flag_view_item_current')) {
                return false;
            }
            //***
            if (Object.keys(woocs_array_of_get).length == 0) {
                window.location = window.location.href + '?currency=' + jQuery(this).data('currency');
            } else {

                woocs_redirect(jQuery(this).data('currency'));

            }
        }

        return false;
    });

    //for converter
    if (jQuery('.woocs_converter_shortcode').length) {
        jQuery('.woocs_converter_shortcode_button').click(function () {
            var amount = jQuery(this).parent('.woocs_converter_shortcode').find('.woocs_converter_shortcode_amount').eq(0).val();
            var from = jQuery(this).parent('.woocs_converter_shortcode').find('.woocs_converter_shortcode_from').eq(0).val();
            var to = jQuery(this).parent('.woocs_converter_shortcode').find('.woocs_converter_shortcode_to').eq(0).val();
            var precision = jQuery(this).parent('.woocs_converter_shortcode').find('.woocs_converter_shortcode_precision').eq(0).val();
            var results_obj = jQuery(this).parent('.woocs_converter_shortcode').find('.woocs_converter_shortcode_results').eq(0);
            //jQuery(results_obj).val(SYNTHETEK_OPTIONS.woocs_lang_loading + ' ...');
            var data = {
                action: "woocs_convert_currency",
                amount: amount,
                from: from,
                to: to,
                precision: precision
            };

            jQuery.post(SYNTHETEK_OPTIONS.woocs_ajaxurl, data, function (value) {
                jQuery(results_obj).val(value);
            });

            return false;

        });
    }

    //for rates
    if (jQuery('.woocs_rates_shortcode').length) {
        jQuery('.woocs_rates_current_currency').life('change', function () {
            var _this = this;
            var data = {
                action: "woocs_rates_current_currency",
                current_currency: jQuery(this).val(),
                precision: jQuery(this).data('precision'),
                exclude: jQuery(this).data('exclude')
            };

            jQuery.post(SYNTHETEK_OPTIONS.woocs_ajaxurl, data, function (html) {
                jQuery(_this).parent('.woocs_rates_shortcode').html(html);
            });

            return false;

        });
    }

    //if we using js price update while the site is cached
    if (typeof SYNTHETEK_OPTIONS.woocs_shop_is_cached !== 'undefined') {
        if (SYNTHETEK_OPTIONS.woocs_shop_is_cached !== '0') {

            sumbit_currency_changing = false;
            if (typeof woocs_array_of_get.currency === 'undefined') {

                if (jQuery('body').hasClass('single')) {
                    jQuery('.woocs_price_info').remove();
                }

                //***
                var products_ids = [];
                jQuery.each(jQuery('.woocs_price_code'), function (index, item) {
                    products_ids.push(jQuery(item).data('product-id'));
                });

                //if no prices on the page - do nothing
                if (products_ids.length === 0) {
                    return;
                }

                var data = {
                    action: "woocs_get_products_price_html",
                    products_ids: products_ids
                };
                jQuery.post(SYNTHETEK_OPTIONS.woocs_ajaxurl, data, function (data) {

                    data = jQuery.parseJSON(data);

                    if (!jQuery.isEmptyObject(data)) {
                        jQuery('.woocs_price_info').remove();
                        jQuery.each(jQuery('.woocs_price_code'), function (index, item) {
                            jQuery(item).replaceWith(data.ids[jQuery(item).data('product-id')]);
                        });
                        //***
                        jQuery('.woocommerce-currency-switcher').val(data.current_currency);
                        //***
                        if (SYNTHETEK_OPTIONS.woocs_drop_down_view == 'chosen' || SYNTHETEK_OPTIONS.woocs_drop_down_view == 'chosen_dark') {
                            try {
                                if (jQuery("select.woocommerce-currency-switcher").length) {
                                    jQuery("select.woocommerce-currency-switcher").chosen({
                                        disable_search_threshold: 10
                                    });
                                    jQuery('select.woocommerce-currency-switcher').trigger("chosen:updated");
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        //***
                        if (SYNTHETEK_OPTIONS.woocs_drop_down_view == 'ddslick') {
                            try {
                                jQuery('select.woocommerce-currency-switcher').ddslick('select', {index: data.current_currency, disableTrigger: true});
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        //***
                        if (SYNTHETEK_OPTIONS.woocs_drop_down_view == 'wselect' && SYNTHETEK_OPTIONS.woocs_is_mobile != 1) {
                            //https://github.com/websanova/wSelect
                            try {
                                jQuery('select.woocommerce-currency-switcher').val(data.current_currency).change();
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        //***
                        sumbit_currency_changing = true;
                    }

                });

            } else {
                sumbit_currency_changing = true;
            }
        }
    }

    wocs_loading_first_time = false;
});


function woocs_redirect(currency) {
    if (!sumbit_currency_changing) {
        return;
    }

    //***
    var l = window.location.href;

    //for #id navigation     l = l.replace(/(#.+$)/gi, '');

    l = l.split('?');
    l = l[0];
    var string_of_get = '?';
    woocs_array_of_get.currency = currency;
    woocs_array_of_get.wmcs_set_currency = currency;
    /*
     l = l.replace(/(\?currency=[a-zA-Z]+)/g, '?');
     l = l.replace(/(&currency=[a-zA-Z]+)/g, '');
     */

    if (Object.keys(woocs_array_of_get).length > 0) {
        jQuery.each(woocs_array_of_get, function (index, value) {
            string_of_get = string_of_get + "&" + index + "=" + value;
        });
    }
    window.location = l + string_of_get;
}

/*
 function woocs_submit(_this) {
 if (Object.keys(woocs_array_of_get).length == 0) {
 jQuery(_this).closest('form').submit();
 } else {
 woocs_redirect(jQuery(_this).val());
 }

 return true;
 }
 */

function woocs_refresh_mini_cart(delay) {
    /** Cart Handling */
    setTimeout(function () {
        try {
            //for refreshing mini cart
            $fragment_refresh = {
                url: wc_cart_fragments_params.ajax_url,
                type: 'POST',
                data: {action: 'woocommerce_get_refreshed_fragments', woocs_woocommerce_before_mini_cart: 'mini_cart_refreshing'},
                success: function (data) {
                    if (data && data.fragments) {

                        jQuery.each(data.fragments, function (key, value) {
                            jQuery(key).replaceWith(value);
                        });

                        try {
                            if ($supports_html5_storage) {
                                sessionStorage.setItem(wc_cart_fragments_params.fragment_name, JSON.stringify(data.fragments));
                                sessionStorage.setItem('wc_cart_hash', data.cart_hash);
                            }
                        } catch (e) {

                        }

                        jQuery('body').trigger('wc_fragments_refreshed');
                    }
                }
            };

            jQuery.ajax($fragment_refresh);


            /* Cart hiding */
            if (jQuery.cookie('woocommerce_items_in_cart') > 0) {
                jQuery('.hide_cart_widget_if_empty').closest('.widget_shopping_cart').show();
            } else {
                jQuery('.hide_cart_widget_if_empty').closest('.widget_shopping_cart').hide();
            }

            jQuery('body').bind('adding_to_cart', function () {
                jQuery('.hide_cart_widget_if_empty').closest('.widget_shopping_cart').show();
            });

        } catch (e) {
            //***
        }

    }, delay);

}
jQuery(document).ready(function ($) {
       var countries = {
        USD: 'US',
        CAD: 'CA',
        EUR: 'DE',
        GBP: 'GB',
        AUD: 'AU',
        ZAR: 'ZA',
        HKD: 'HK',
        NZD: 'NZ'
    };
    var currency = '<?php echo $currency; ?>';
    var country = countries[currency];

    $('body').trigger('update_checkout');


    // Change currency
    $('.flag-item .flag, .flag-item .flag-label').on('click', function (e) {
        var flag = $(this).closest('.flag-item'),
            tabs = $('.shipping-info .tab'),
            currency = 'USD';

        if (flag.hasClass('flag-item-us')) {
            tabs.hide();
            $('.tab-item-us').show();
            currency = 'USD';
        } else if (flag.hasClass('flag-item-ca')) {
            tabs.hide();
            $('.tab-item-ca').show();
            currency = 'CAD'
        } else if (flag.hasClass('flag-item-eu')) {
            tabs.hide();
            $('.tab-item-eu').show();
            currency = 'EUR';
        } else if (flag.hasClass('flag-item-uk')) {
            tabs.hide();
            $('.tab-item-gb').show();
            currency = 'GBP';
        } else if (flag.hasClass('flag-item-au')) {
            tabs.hide();
            $('.tab-item-au').show();
            currency = 'AUD';
        } else if (flag.hasClass('flag-item-za')) {
            tabs.hide();
            $('.tab-item-za').show();
            currency = 'ZAR';
        } else if (flag.hasClass('flag-item-hk')) {
            tabs.hide();
            $('.tab-item-hk').show();
            currency = 'HKD';
        } else if (flag.hasClass('flag-item-nz')) {
            tabs.hide();
            $('.tab-item-nz').show();
            currency = 'NZD';
        }

        // Block content
        $( '.woocommerce' ).block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });

        // Redirect to another page
        window.location.href = SYNTHETEK_OPTIONS.checkout_url + '?currency=' + currency + '&wmcs_set_currency=' + currency ;

    });


});