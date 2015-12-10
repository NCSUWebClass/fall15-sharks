#!/usr/bin/env python3.4

from flask import Flask, render_template, url_for

import json

from project import secrets
from project import settings
from project import db

########################################################

app = Flask(__name__)
app.debug = settings.DEBUG
database = db.DB()

########################################################

# User routes

@app.route("/")
def home():
    return render_template('home.html', name='home')

@app.route("/virtualdig")
def virtualdig():
    return render_template('virtualdig.html', name='virtualdig')
    
@app.route("/measure")
def measurement():
    return render_template('measure.html', name='measure')

@app.route("/stats")
def stats():
    return render_template('stats.html', name='statistics')

# API Routes

@app.route("/getTeeth")
def getTeeth():
    return json.dumps(database.getRandomTeeth(15))
