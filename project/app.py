#!/usr/bin/env python3.4

from flask import Flask, render_template, url_for
from flask.ext.sqlalchemy import SQLAlchemy

from project import secrets
from project import settings

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

    
@app.route("/measure")
def measurement():
    return render_template('measure.html', name='measure')
