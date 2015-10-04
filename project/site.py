#!/usr/bin/python3

from flask import Flask, render_template, url_for
from flask.ext.sqlalchemy import SQLAlchemy

import secrets
import settings

########################################################

app = Flask(__name__)
app.debug = settings.DEBUG
app.config['SQLALCHEMY_DATABASE_URI'] = settings.SQLALCHEMY_DATABASE_URI
app.config['SECRET_KEY'] = secrets.SECRET_KEY
db = SQLAlchemy(app)

########################################################


@app.route("/")
def home():
    return render_template('home.html', name='home')


@app.route("/fossils")
def virtualdig():
    return render_template('virtualdig.html', name='virtualdig')


########################################################

if __name__ == "__main__":
    app.run()
