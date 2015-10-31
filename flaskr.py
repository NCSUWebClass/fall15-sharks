import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash

#configuration
DATABASE = '/database.db/'
DEBUG = True
SECRET_KEY = 'dev key'
USERNAME = 'cs'
PASSWORD = 'ncsu'

app = Flask(__name__)
app.config.from_object(__name__)

def connect_db():
	return sqlite3.connect(app.config['DATABASE'])
	
@app.route('/teeth')
def show_teeth():
	cur = g.db.execute('select id, name, img, measurement from teeth order by id asc')
	entries = [dict(id=row[0], name=row[1], measurement=row[2], img=row[3]) for row in cur.fetchall()]
	return render_template('virtualdig_stats.html', entries=teeth)

@app.route('/sharks')
def show_sharks():
	cur = g.db.execute('select id, name, img, description from teeth order by id asc')
	entries = [dict(id=row[0], name=row[1], description=row[2], img=row[3]) for row in cur.fetchall()]
	return render_template('virtualdig_stats.html', entries=sharks)
	
@app.before_request
def before_request():
	g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
	db = getattr(g, 'db', None)
	if db is not None:
		db.close()
	
	
if __name__ == '__main__':
	app.run()