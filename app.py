"""
Main module of the server file
"""

# 3rd party moudles
from flask import render_template, Flask, redirect, url_for, request
import connexion
from flask_bootstrap import Bootstrap


# Create the application instance
app = connexion.App(__name__, specification_dir="./")

# Read the swagger.yml file to configure the endpoints
app.add_api("swagger.yml")


# create a URL route in our application for "/home"
@app.route("/home")
def home():
    """
    This function just responds to the browser URL
    localhost:5000/home
    :return:        the rendered template "home.html"
    """
    return render_template("home.html")


# Route for handling the login page logic on "/"
@app.route('/', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] != 'admin' or request.form['password'] != 'maraisatuelinrim':
            error = 'Das Passwort und/oder der Username waren leider nicht korrekt. Bitte versuche es erneut.'
        else:
            return redirect(url_for('home'))
    return render_template('login.html', error=error)


if __name__ == "__main__":
    app.run(debug=True)