#!/usr/local/bin/python3

from cgitb import enable
enable()

from cgi import FieldStorage
from html import escape
import pymysql as db

print('Content-Type: text/html')
print()

game_script = '<script src="name_check.js" ></script>'
score = '''
        <input type="submit" value="Start Game!" id="submit"/>'''
disabled = ''
canvas = ''
leaderboard = ''
name = ''

try:
    connection = db.connect('***.***.**', '****', '*****', '******_******_****')
    cursor = connection.cursor(db.cursors.DictCursor)

    form_data = FieldStorage()
    username = escape(form_data.getfirst('username', '').strip())
    name = username
    cursor.execute("""SELECT username FROM game_leaderboard
                      WHERE username = '%s'""" % username)
    if len(username) != 0:
        leaderboard = '<table><tr><th>POSITION</th><th>USERNAME</th><th>SCORE</th></tr>'
        game_script = "<script src='index.js' ></script>"
        canvas = "<canvas width='700' height='400'> </canvas>"
        score = """<label for="score">Score:</label>
                  <input type="text" name="score" id="score" value="0" disabled>"""
        disabled = 'disabled'
        cursor.execute("""SELECT * FROM game_leaderboard
                          ORDER BY score DESC""")
        i = 0
        for row in cursor.fetchall():
            if i < 20:
                i += 1
                leaderboard += '<tr><td>%s</td><td>%s</td><td>%s</td></tr>' % (i, row['username'], row['score'])
        leaderboard += '</table>'
        cursor.close()
        connection.close()
except db.Error:
    leader_board = '<p>sorry! No scores to display as we are experiencing problems ' \
               'at the moment. Please call back later.</p>'

print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title> Project </title>
            <link rel="stylesheet" href="index.css" />
            %s
        </head>
        <body>
            <form action="index.py" method="get">
                <fieldset>
                    <legend>Create Username</legend>
                    <label for="username">Name:</label>
                    <input type="text" name="username" id="username" maxlength="21" size="21" value='%s' />
                    <span id="checker"></span>
                    %s
                </fieldset>
             </form>
            %s
            %s
        </body>
    </html> """ % (game_script, name, score, canvas, leaderboard))
