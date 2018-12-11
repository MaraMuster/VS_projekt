"""
This is the menu module and supports all the ReST actions for the
MENU collection
"""

# System modules
from datetime import datetime

# 3rd party modules
from flask import make_response, abort


def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))


# Data to serve with our API
MENU = {
    "1": {
        "meal": "gemischte Salatschale",
        "price": "1",
        "timestamp": get_timestamp(),
    },
    "1.5": {
        "meal": "Linseneintopf",
        "price": "1.5",
        "timestamp": get_timestamp(),
    },
    "5": {
        "meal": "Schnitzel mit Pommes",
        "price": "5",
        "timestamp": get_timestamp(),
    },
}


def read_all():
    """
    This function responds to a request for /api/menu
    with the complete lists of menu
    :return:        json string of list of menu
    """
    # Create the list of menu from our data
    return [MENU[key] for key in sorted(MENU.keys())]


def read_one(price):
    """
    This function responds to a request for /api/menu/{price}
    with one matching food from menu
    :param price:   last name of food to find
    :return:        food matching last name
    """
    # Does the food exist in menu?
    if price in MENU:
        food = MENU.get(price)

    # otherwise, nope, not found
    else:
        abort(
            404, "Food with price {price} not found".format(price=price)
        )

    return food


def create(food):
    """
    This function creates a new food in the people structure
    based on the passed in food data
    :param food:  food to create in people structure
    :return:        201 on success, 406 on food exists
    """
    price = food.get("price", None)
    meal = food.get("meal", None)

    # Does the food exist already?
    if price not in MENU and price is not None:
        MENU[price] = {
            "price": price,
            "meal": meal,
            "timestamp": get_timestamp(),
        }
        return MENU[price], 201

    # Otherwise, they exist, that's an error
    else:
        abort(
            406,
            "Food with price {price} already exists".format(price=price),
        )


def update(price, food):
    """
    This function updates an existing food in the Menu structure
    :param price:   last name of food to update in the menu structure
    :param food:  food to update
    :return:        updated food structure
    """
    # Does the food exist in menu?
    if price in MENU:
        MENU[price]["meal"] = food.get("meal")
        MENU[price]["timestamp"] = get_timestamp()

        return MENU[price]

    # otherwise, nope, that's an error
    else:
        abort(
            404, "Food with price {price} not found".format(price=price)
        )


def delete(price):
    """
    This function deletes a food from the menu structure
    :param price:   last name of food to delete
    :return:        200 on successful delete, 404 if not found
    """
    # Does the food to delete exist?
    if price in MENU:
        del MENU[price]
        return make_response(
            "{price} successfully deleted".format(price=price), 200
        )

    # Otherwise, nope, food to delete not found
    else:
        abort(
            404, "Food with price {price} not found".format(price=price)
        )