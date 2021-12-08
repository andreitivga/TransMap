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

    def add_user(self, email, hashed_password, user_type, first_name, last_name):
        query = 'INSERT INTO Users (email, password, user_type, first_name, last_name) VALUES ("{}", "{}", "{}", "{}", "{}")'.format(
            email, hashed_password, user_type, first_name, last_name)
        res = self.cursor.execute(query)
        self.con.commit()
        return res

    def add_offer(self, user_id, truck_id, leaving_date, leaving_place, arriving_time, arriving_place, price_km_empty, price_km_full, carrier_notes):
        query = 'INSERT INTO Offer (carrier_id , truck_id, status, leaving_date, leaving_place, arriving_time, arriving_place, price_km_empty, price_km_full, carrier_notes) VALUES ("{}", "{}", "{}")'.format(
            user_id, truck_id, "available", leaving_date, leaving_place, arriving_time, arriving_place, price_km_empty, price_km_full, carrier_notes)
        res = self.cursor.execute(query)
        self.con.commit()
        return res

    def update_status_offer(self, status, offer_id):
        query = "UPDATE Offer SET status=(status) WHERE offer_id=(id)".format(
            status, offer_id)
        res = self.cursor.execute(query)
        self.con.commit()
        return res

    def __del__(self):
        self.con.close()
