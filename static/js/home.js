/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/menu',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(meal, price) {
            let ajax_options = {
                type: 'POST',
                url: 'api/menu',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'meal': meal,
                    'price': price
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(meal, price) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/menu/' + price,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'meal': meal,
                    'price': price
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(price) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/menu/' + price,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $meal = $('#meal'),
        $price = $('#price');

    // return the API
    return {
        reset: function() {
            $price.val('');
            $meal.val('').focus();
        },
        update_editor: function(meal, price) {
            $price.val(price);
            $meal.val(meal).focus();
        },
        build_table: function(menu) {
            let rows = ''

            // clear the table
            $('.menu table > tbody').empty();

            // did we get a menu array?
            if (menu) {
                for (let i=0, l=menu.length; i < l; i++) {
                    rows += `<tr><td class="meal">${menu[i].meal}</td><td class="price">${menu[i].price}</td><td>${menu[i].timestamp}</td><td>${menu[i].count}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $meal = $('#meal'),
        $price = $('#price');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(meal, price) {
        return meal !== "" && price !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let meal = $meal.val(),
            price = $price.val();

        e.preventDefault();

        if (validate(meal, price)) {
            model.create(meal, price)
        } else {
            alert('Problem with first or last name input');
        }
    });

    $('#update').click(function(e) {
        let meal = $meal.val(),
            price = $price.val();

        e.preventDefault();

        if (validate(meal, price)) {
            model.update(meal, price)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let price = $price.val();

        e.preventDefault();

        if (validate('placeholder', price)) {
            model.delete(price)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            meal,
            price;

        meal = $target
            .parent()
            .find('td.meal')
            .text();

        price = $target
            .parent()
            .find('td.price')
            .text();

        view.update_editor(meal, price);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
