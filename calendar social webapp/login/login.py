#!/usr/local/bin/python3

from cgitb import enable
enable()

from cgi import FieldStorage
from html import escape
from hashlib import sha256
from time import time
from shelve import open
from http.cookies import SimpleCookie
import pymysql as db


form_data = FieldStorage( )
form_response = ''
result = """
        <form action="login.py" method="get">
            <fieldset>
                <legend>Login</legend>                
                <label for="email">Email:</label>
                <input type="text" id="email" name="email" maxlength="320" size="21" required />

                <label for="password">Password:</label>
                <input type="password" id="password" name="password" minlength="8" required />

                <input type="submit" value="Sign in" >
            </fieldset>
            <span>%s</span>
        </form>"""

if len(form_data) != 0:
    email = escape(form_data.getfirst('email', '').strip())
    password = escape(form_data.getfirst('password', '').strip())
    if not email or not password:
        form_response = '<p>Error: Credentials not filled properly. Please try again</p>'
    else:
        sha256_password = sha256(password.encode()).hexdigest()
        try:
            connection = db.connect('localhost', 'userid', 'psw', 'database_name')
            cursor = connection.cursor(db.cursors.DictCursor)
            cursor.execute("""SELECT * FROM user_login
                              WHERE email = %s AND password = %s""", (email, sha256_password))
            if cursor.rowcount == 0:
                form_response = '<p>Error: incorrect email or password!</p>'
            else:
                cookie = SimpleCookie()
                sid = sha256(repr(time()).encode()).hexdigest()
                cookie['sid'] = sid
                session_store = open('sess_' + sid, writeback=True)
                session_store['authenticated'] = True
                # session_store['time_of_last_request'] = time()  # New user comes by, every 5th user causes session store to collect all ideal users who exceed 10min ideal time
                session_store.close()
                form_response = '<p>Successfully logged in!</p>'
                result = """
                            %s
                            <p>Here is your protected content.</p>"""
                print(cookie)
            cursor.close()
            connection.close()
        except (db.Error, IOError):
            result = '<p>Whoopsy! We are experiencing problems at the moment. We will be back later!'
    

print('Content-Type: text/html')
print()
print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title> Project </title>
            <link rel="stylesheet" href="index.css" />
        </head>
        <body>
            %s
        </body>
    </html> """ % (result, form_response))