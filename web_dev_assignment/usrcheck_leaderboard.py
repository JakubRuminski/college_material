from cgi import FieldStorage

from cgitb import enable
enable()

from cgi import FieldStorage
from html import escape
import pymysql as db

print('Content-Type: text/html')
print()

form_data = FieldStorage()
try:
    connection = db.connect('***.***.**', '****', '*****', '******_******_****')
    cursor = connection.cursor(db.cursors.DictCursor)
    score = escape(form_data.getfirst('score', '').strip())
    username = escape(form_data.getfirst('username', '').strip())
    cursor.execute("""SELECT * FROM game_leaderboard
                      WHERE username = %s""", (username))
    if len(score) != 0:
        if cursor.rowcount > 0:
            if (int(cursor.fetchone()['score']) < int(score)):
                cursor.execute("""UPDATE game_leaderboard SET score = %s
                                  WHERE username = %s """, (score, username))
                connection.commit()
            print("success")
        else:
            cursor.execute("""INSERT INTO game_leaderboard (score, username)
                              VALUES (%s, %s)""", (score, username))
            connection.commit()
            print("success")
    else:
        if cursor.rowcount > 0 or len(username) == '':
            print('in_use')
        else:
            print('available')
    cursor.close()
    connection.close()
except db.Error:
    print('problem')
