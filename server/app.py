from flask import Flask, request, Response, session
from flask import json
from flask.json import jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from query import DBConnect


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
    return Response(status=200)


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return Response(status=200)


@app.route('/register', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']
    user_type = request.json['user_type']
    user_types = ['client', 'carrier', 'admin']
    if user_type not in user_types:
        return jsonify({'error': 'Bad user type'}), 401
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    try:
        db_conn.add_user(email, hashed_password, user_type)
        return Response(status=200)
    except:
        return jsonify({'error': 'Username already exists or bad email type.'}), 409


@app.route('/offer', methods=['POST'])
def add_offer():
    carrier_id = request.json['carrier_id']
    truck_id = request.json['truck_id']
    leaving_date = request.json['leaving_date']
    leaving_place = request.json['leaving_place']
    arriving_time = request.json['arriving_time']
    arriving_place = request.json['arriving_place']
    price_km_empty = request.json['price_km_empty']
    price_km_full = request.json['price_km_full']
    carrier_phone = request.json['carrier_phone']
    carrier_email = request.json['carrier_email']
    carrier_notes = request.json['carrier_notes']
    db_conn.add_offer(carrier_id, truck_id, leaving_date, leaving_place, arriving_time,
                      arriving_place, price_km_empty, price_km_full, carrier_phone, carrier_email, carrier_notes)
    return Response(status=200)


@app.route('/offer', methods=['PUT'])
def update_status_offer():
    status = request.json['status']
    offer_id = request.json['offer_id']
    db_conn.update_status_offer(status, offer_id)


if __name__ == '__main__':
    app.run(debug=True)
