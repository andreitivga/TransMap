import sqlite3


class DBConnect:

    def __init__(self, db_name):
        self.con = sqlite3.connect(db_name, check_same_thread=False)
        self.cursor = self.con.cursor()

    def get_email_from_user(self, user_id):
        query1 = 'SELECT email FROM Users WHERE user_id = {}'.format(user_id)
        res = self.cursor.execute(query1).fetchone()
        return res

    def get_user_info_by_email(self, email):
        query1 = 'SELECT * FROM Users WHERE email = "{}"'.format(email)
        res = self.cursor.execute(query1).fetchone()
        return res

    def add_user(self, email, hashed_password, user_type):
        query = 'INSERT INTO Users (email, password, user_type) VALUES ("{}", "{}", "{}")'.format(
            email, hashed_password, user_type)
        res = self.cursor.execute(query)
        self.con.commit()
        return res

    def __del__(self):
        self.con.close()
