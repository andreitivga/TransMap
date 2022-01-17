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

    def add_offer(self, user_id, truck_id, leaving_date, leaving_place, arriving_date, arriving_place, price_km_empty, price_km_full, carrier_notes):
        query = 'INSERT INTO Offer (carrier_id , truck_id, status, leaving_date, leaving_place, arriving_date, arriving_place, price_km_empty, price_km_full, carrier_notes) VALUES ("{}", "{}", "{}","{}", "{}", "{}","{}", "{}", "{}","{}")'.format(
            user_id, truck_id, "available", leaving_date, leaving_place, arriving_date, arriving_place, price_km_empty, price_km_full, carrier_notes)
        res = self.cursor.execute(query)
        self.con.commit()
        return res

    def add_request(self, user_id,  leaving_date,  max_leaving_date, leaving_place, arriving_date, max_arriving_date, arriving_place, gtype, weight, volume, budget, notes):
        query = 'INSERT INTO Request (user_id, status, leaving_date,  max_leaving_date, leaving_place, arriving_date, max_arriving_date, arriving_place,goods_type, goods_weight, goods_volume,budget, client_notes) VALUES ("{}", "{}", "{}","{}", "{}", "{}","{}", "{}", "{}","{}","{}","{}","{}")'.format(
            user_id, "available", leaving_date, max_leaving_date, leaving_place, arriving_date, max_arriving_date, arriving_place, gtype, weight, volume, budget, notes)
        res = self.cursor.execute(query)
        self.con.commit()
        return res

    def get_requests_from_user(self, user_id):
        query1 = 'SELECT * FROM Request WHERE user_id = {}'.format(
            user_id)
        res = self.cursor.execute(query1).fetchall()
        return res

    def get_offers_from_user(self, user_id):
        query1 = 'SELECT * FROM Offer WHERE carrier_id = {}'.format(
            user_id)
        res = self.cursor.execute(query1).fetchall()
        return res

    def get_contract_from_user(self, offer_id, request_id):
        if not offer_id:
            query1 = 'SELECT * FROM Offer_Request WHERE request_id = "{}"'.format(
                request_id)
            res = self.cursor.execute(query1).fetchone()
        else:
            query1 = 'SELECT * FROM Offer_Request WHERE offer_id = "{}"'.format(
                offer_id)
            res = self.cursor.execute(query1).fetchone()
        return res

    def get_contact_info(self, offer_id, request_id):
        if not offer_id:
            query1 = 'SELECT user_id FROM Request WHERE request_id = "{}"'.format(
                request_id)
            res = self.cursor.execute(query1).fetchone()
        else:
            query1 = 'SELECT carrier_id FROM Offer WHERE offer_id = "{}"'.format(
                offer_id)
            res = self.cursor.execute(query1).fetchone()
        query2 = 'SELECT email, first_name, last_name, tel FROM Users WHERE user_id = "{}"'.format(
            res[0])
        res = self.cursor.execute(query2).fetchone()
        return res

    def update_status_offer(self, status, offer_id):
        query = "UPDATE Offer SET status=(status) WHERE offer_id=(id)".format(
            status, offer_id)
        res = self.cursor.execute(query)
        self.con.commit()
        return res

    def add_truck(self, model, volume, weight, user):
        query = 'INSERT INTO Truck (truck_model, truck_volume, truck_weight,truck_user) VALUES ("{}", "{}", "{}", "{}")'.format(
            model, volume, weight, user)
        res = self.cursor.execute(query)
        self.con.commit()
        return res

    def get_trucks_from_user(self, user_id):
        query1 = 'SELECT truck_model,truck_id FROM Truck WHERE truck_user = {}'.format(
            user_id)
        res = self.cursor.execute(query1).fetchall()
        return res

    def get_available_offers(self):
        query1 = 'SELECT * from Offer WHERE status="available"'
        res = self.cursor.execute(query1).fetchall()
        return res

    def get_available_requests(self):
        query1 = 'SELECT * from Request WHERE status="available"'
        res = self.cursor.execute(query1).fetchall()
        return res

    def get_available_offers(self):
        query1 = 'SELECT * from Offer WHERE status="available"'
        res = self.cursor.execute(query1).fetchall()
        return res

    def __del__(self):
        self.con.close()
