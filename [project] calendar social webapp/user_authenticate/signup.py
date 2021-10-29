#!/usr/local/bin/python3

from cgitb import enable

from pymysql import connections
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
        <form action="signup.py" method="get">
            <fieldset>
                <legend>Login</legend>    
                <label for="user_name">Name:</label>
                <input type="text" id="user_name" name="user_name" maxlength="25" size="21" required />

                <label for="user_surname">Surname:</label>
                <input type="text" id="user_surname" name="user_surname" maxlength="25" size="21" required />

                <label for="email">Email:</label>
                <input type="text" id="email" name="email" maxlength="320" size="21" required />

                <label for="password_1">Password:</label>
                <input type="password" id="password_1" name="password_1" minlength="0" required />

                <label for="password_2">Password:</label>
                <input type="password" id="password_2" name="password_2" minlength="0" required />

                <input type="submit" value="Sign up!" >
            </fieldset>
            <span>%s</span>
        </form>"""

if len(form_data) != 0:
    user_name = escape(form_data.getfirst('user_name', '').strip())
    user_surname = escape(form_data.getfirst('user_surname', '').strip())
    email = escape(form_data.getfirst('email', '').strip())
    password_1 = escape(form_data.getfirst('password_1', '').strip())
    password_2 = escape(form_data.getfirst('password_2', '').strip())
    if not user_name or not user_surname or not password_1 or not password_2:
        form_response = '<p>Error: all details necessary must be filled.</p>'
    elif password_1 != password_2:
        form_response = '<p>Error: passwords must be equal</p>'
    else:
        try:
            connection = db.connect('localhost', 'userid', 'password', 'database_name')
            cursor = connection.cursor(db.cursors.DictCursor)
            cursor.execute("""SELECT * FROM user_login
                              WHERE email = %s""", (email))
            if cursor.rowcount > 0:
                form_response = '<p>Error: user email already used. Please sign in' # add a login anchor link.
            else:
                sha256_password = sha256(password_1.encode()).hexdigest()
                cursor.execute("""
                               INSERT INTO user_login (email, user_name, user_surname, password)
                               VALUES (%s, %s, %s, %s)""", (email, user_name, user_surname, sha256_password))
                connection.commit()
                cursor.close()
                connection.close()
                cookie = SimpleCookie()
                sid = sha256(repr(time()).encode()).hexdigest()
                cookie['sid'] = sid
                session_store = open('sess_' + sid, writeback=True)
                session_store['authenticated'] = True
                session_store['email'] = email
                session_store.close()
                form_response = '<p>You have been successfully added</p>'
                result = """
                         %s
                         <p>Here is your profile.</p>
                         """
                print(cookie)
        except (db.Error, IOError):
            result = '<p>Whoopsy! We are experiencing problems at the moment. Please come back later!</p>'


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