#!/usr/local/bin/python3

from cgitb import enable
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie

print('Content-Type: text/html')
print()

result = """
        <p>You do not have permission to view this page as you are not signed in.</p>
        <ul>
            <li>Register as a new user <a href="../user_authenticate/signup.py">here</a></li>
            <li>Or login <a href="../user_authenticate/login.py">here</a></li>
        </ul>
        """ # relative pathnames? think they wrong anyway(no '..' required)

try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sess_' + sid, writeback=False)
            if session_store.get('authenticate'):
                result = """
                        <p>The Hidden Content</p>
                        """
            session_store.close()
except IOError:
    result = '<p>Sorry! We are experiencing problems at the moment. We will be back later!'

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
    </html> 
    """ % (result))