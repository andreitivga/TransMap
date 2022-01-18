from os import stat
from flask import Flask, request, Response, session
from flask import json
from flask.json import jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from werkzeug.wrappers import response
from query import DBConnect
from geopy.distance import great_circle
from datetime import datetime

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
app.secret_key = 'hello'
db_conn = DBConnect('proiect_isi.db')


@app.route('/')
def home():
    return "Home Page"


@app.route('/me', methods=['GET'])
def get_current_user():
    user_id = session.get('user_id')
    user_type = session.get('user_type')
    if not user_id:
        return jsonify({"error": "Unauthorised"}), 401
    res = db_conn.get_email_from_user(user_id=user_id)

    return jsonify({
        "id": user_id,
        "email": res[0],
        "user_type": user_type
    })


@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    res = db_conn.get_user_info_by_email(email)
    if not res:
        return jsonify({"error": "User does not exist"}), 400
    hashed_password = res[2]
    if not bcrypt.check_password_hash(hashed_password, password):
        return jsonify({"error": "Bad password"}), 400
    session['user_id'] = res[0]
    session['user_type'] = res[3]
    return jsonify({'user': {'id': res[0], 'user_type': res[3], 'first_name': res[4]}}), 200


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return Response(status=200)


@app.route('/register', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']
    user_type = request.json['user_type']
    first_name = request.json['first_name']
    last_name = request.json['last_name']
    user_types = ['client', 'carrier', 'admin']
    if user_type not in user_types:
        return jsonify({'error': 'Bad user type'}), 401
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    try:
        db_conn.add_user(email, hashed_password,
                         user_type, first_name, last_name)
        res = db_conn.get_user_info_by_email(email)
        return jsonify({'user': {'id': res[0], 'user_type': res[3], 'first_name': res[4]}}), 200
    except:
        return jsonify({'error': 'Username already exists or bad email type.'}), 409


@app.route('/offers', methods=['POST'])
def add_offer():
    carrier_id = int(request.json['carrier_id'])
    truck_id = int(request.json['truck_id'])
    leaving_date = request.json['leaving_date']
    leaving_place = request.json['leaving_place']
    arriving_time = request.json['arriving_date']
    arriving_place = request.json['arriving_place']
    price_km_empty = float(request.json['price_km_empty'])
    price_km_full = float(request.json['price_km_full'])
    carrier_notes = request.json['notes']
    db_conn.add_offer(carrier_id, truck_id, "available", leaving_date, leaving_place, arriving_time,
                      arriving_place, price_km_empty, price_km_full, carrier_notes)
    return Response(status=200)


@app.route('/offer', methods=['PUT'])
def update_status_offer():
    status = request.json['status']
    offer_id = request.json['offer_id']
    try:
        db_conn.update_status_offer(status, offer_id)
        return Response(status=200)
    except:
        return Response(status=400)


@app.route('/requests', methods=['POST'])
def add_request():
    user_id = int(request.json['user_id'])
    leaving_date = request.json['leaving_date']
    max_leaving_date = request.json['max_leaving_date']
    leaving_place = request.json['leaving_place']
    arriving_time = request.json['arriving_date']
    max_arriving_time = request.json['max_arriving_date']
    arriving_place = request.json['arriving_place']
    goods_type = request.json['goods_type']
    goods_volume = float(request.json['goods_volume'])
    goods_weight = float(request.json['goods_weight'])
    notes = request.json['notes']
    budget = float(request.json['budget'])
    try:
        db_conn.add_request(user_id, "available", leaving_date, max_leaving_date, leaving_place, arriving_time, max_arriving_time,
                            arriving_place, goods_type, goods_weight, goods_volume, budget, notes)
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=400)


@app.route('/trucks', methods=['POST'])
def add_truck():
    model = request.json['model']
    volume = float(request.json['volume'])
    weight = float(request.json['weight'])
    user = int(request.json['user'])
    try:
        db_conn.add_truck(model, volume, weight, user)
        return Response(status=200)
    except Exception as e:
        print(e)
        return Response(status=400)


@app.route('/get_trucks_user/<string:user>', methods=['GET'])
def get_truck_info(user):
    user = int(user)
    try:
        res = db_conn.get_trucks_from_user(user)
        response = {}
        for model, id in res:
            response[id] = model
        return jsonify(response), 200
    except Exception as e:
        print(e)
        return Response(status=400)


@app.route('/requests/<string:user>/', methods=['GET'])
def get_requests_user(user):
    user = int(user)
    try:
        res = db_conn.get_requests_from_user(user)
        response = []
        for id, _, status, leaving_place, leaving_date, max_leaving_date, arriving_place,  arriving_date, max_arriving_date, goods_type, goods_weight, goods_volume, budget, notes in res:
            contract = {}
            contact = {}
            if status != 'available':
                res2 = db_conn.get_contract_from_user(None, id)
                if res2:
                    (offer_id, _, details, date_emitted, price, distance) = res2
                    contract = {
                        'offer_id': offer_id,
                        'request_id': id,
                        'date emitted':  date_emitted,
                        'distance': distance,
                        'price': price,
                        'details': details
                    }
                contact_details = db_conn.get_contact_info(offer_id, None)
                if contact_details:
                    (email, fname, lname, tel) = contact_details
                    contact = {
                        'email': email,
                        'fname': fname,
                        'lname': lname,
                        'tel': tel,
                    }
            details = {
                'max_leaving_date': max_leaving_date,
                'max_arriving_date': max_arriving_date,
                'goods_type': goods_type,
                'goods_weight': goods_weight,
                'goods_volume': goods_volume,
                'budget': budget,
                'notes': notes,
            }
            response.append({
                'no': id,
                'status': status,
                'leaving_place': leaving_place,
                'leaving_date': leaving_date,
                'arriving_place': arriving_place,
                'arriving_date': arriving_date,
                'details': details,
                'contract': contract,
                'contact': contact})
        return jsonify(response), 200
    except Exception as e:
        print(e)
        return Response(status=400)


@app.route('/offers/<string:user>/', methods=['GET'])
def get_offers_user(user):
    user = int(user)
    try:
        res = db_conn.get_offers_from_user(user)
        response = []
        for id, _, truck_id, status, leaving_date, leaving_place, arriving_date, arriving_place, price_empty, price_full, carrier_notes in res:
            contract = {}
            contact = {}
            if status != 'available':
                res2 = db_conn.get_contract_from_user(id, None)
                if res2:
                    (offer_id, request_id, details,
                     date_emitted, price, distance) = res2
                    contract = {
                        'offer_id': id,
                        'request_id': request_id,
                        'date emitted':  date_emitted,
                        'distance': distance,
                        'price': price,
                        'details': details
                    }
                contact_details = db_conn.get_contact_info(None, request_id)
                if contact_details:
                    (email, fname, lname, tel) = contact_details
                    contact = {
                        'email': email,
                        'fname': fname,
                        'lname': lname,
                        'tel': tel,
                    }
            details = {
                'price_empty': price_empty,
                'price_full': price_full,
                'carrier_notes': carrier_notes,
            }
            response.append({
                'no': id,
                'status': status,
                'leaving_place': leaving_place,
                'leaving_date': leaving_date,
                'arriving_place': arriving_place,
                'arriving_date': arriving_date,
                'details': details,
                'contract': contract,
                'contact': contact})
        return jsonify(response), 200
    except Exception as e:
        print(e)
        return Response(status=400)


@app.route('/offers/fetchAvailableOffers', methods=['GET'])
def fetchAllOffers():

    try:
        res = db_conn.get_available_offers()
        return jsonify(res), 200

    except Exception as e:
        print(e)
        return Response(status=400)


@app.route('/available/<string:user_type>/', methods=['GET'])
def fetchAllRequests(user_type):
    try:
        if user_type == 'carrier':
            res = db_conn.get_available_requests()
            return jsonify(res), 200
        else:
            res = db_conn.get_available_offers()
            return jsonify(res), 200

    except Exception as e:
        print(e)
        return Response(status=400)


@app.route('/request/<string:request_id>/', methods=['GET'])
def fetchByRequestId(request_id):
    try:
        res = db_conn.get_requests_from_user_by_id(request_id)
        return jsonify(res), 200

    except Exception as e:
        print(e)
        return Response(status=400)


@app.route('/offer/<string:offer_id>/', methods=['GET'])
def fetchByOfferId(offer_id):
    try:
        res = db_conn.get_offers_from_user_by_id(offer_id)
        return jsonify(res), 200

    except Exception as e:
        print(e)
        return Response(status=400)


cityMapping = {
    'Bucuresti': (26.10389, 44.43278),
    'Constanta': (28.6383, 44.1733),
    'Brasov': (25.3441, 45.71),
    'Cluj': (23.6172, 46.7784),
    'Iasi': (27.57, 47.17),
    'Focsani': (27.1833, 45.7),
    'Timisoara': (21.2272, 45.749)
}


@app.route('/contract/', methods=['POST'])
def postContract():
    user_type = request.json["user_type"]
    try:
        if user_type == 'carrier':
            carrier = request.json["carrier_id"]
            id = request.json["request_id"]
            change_status = db_conn.update_status_request(
                status="confirmed", request_id=id)
            request_detail = db_conn.get_requests_from_user_by_id(id)
            city1 = request_detail[3]
            city2 = request_detail[6]
            date1 = request_detail[4]
            date2 = request_detail[7]
            distance = round(great_circle(
                cityMapping[city1], cityMapping[city2]).km, 2)
            price_km = round(int(request_detail[12])/distance, 2)
            offer_id = db_conn.add_offer(
                carrier, '', "confirmed", date1, city1, date2, city2, price_km, price_km, '')
            now = datetime.now()
            dt_string = now.strftime("%d/%m/%Y")
            addContr = db_conn.add_contract(
                offer_id, id, '', dt_string, request_detail[12], distance)
            return jsonify(request_detail), 200
        elif user_type == 'client':
            client = request.json["client_id"]
            id = request.json["offer_id"]
            offer_detail = db_conn.get_offers_from_user_by_id(id)
            change_status = db_conn.update_status_offer("confirmed", id)
            city1 = offer_detail[5]
            city2 = offer_detail[7]
            date1 = offer_detail[4]
            date2 = offer_detail[6]
            km_full = offer_detail[9]
            distance = round(great_circle(
                cityMapping[city1], cityMapping[city2]).km, 2)
            budget = round(km_full*distance, 2)
            request_id = db_conn.add_request(
                client, "confirmed", date1, date1, city1, date2, date2, city2, '', '', '', budget, '')
            now = datetime.now()
            dt_string = now.strftime("%d/%m/%Y")
            addContr = db_conn.add_contract(
                id, request_id, '', dt_string, budget, distance)
            return jsonify(offer_detail), 200

        else:
            res = db_conn.get_available_offers()
            return jsonify(res), 200

    except Exception as e:
        print(e)
        return Response(status=400)


if __name__ == '__main__':
    app.run(debug=True)
