from flask import Flask, request, Response, session
from flask import json
from flask.json import jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
app.secret_key = 'hello'

@app.route('/')
def home():
    return "Home Page"

@app.route('/me', methods=['GET'])
def get_current_user():
    user_id = session.get('user_id')
    user_type = session.get('user_type')

    if not user_id:
        return jsonify({"error": "Unauthorised"}), 401

    con = sqlite3.connect('server/proiect_isi.db')
    cursor = con.cursor()
    query1 = 'SELECT email FROM Users WHERE user_id = {}'.format(user_id)
    res = cursor.execute(query1).fetchone()

    return jsonify({
        "id":user_id,
        "email": res[0],
        "user_type": user_type
    })


@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    con = sqlite3.connect('server/proiect_isi.db')
    cursor = con.cursor()
    query1 = 'SELECT * FROM Users WHERE email = "{}"'.format(email)
    res = cursor.execute(query1).fetchone()
    if not res:
        return jsonify({"error": "User does not exist"}), 400
    
    hashed_password = res[2]
    if not bcrypt.check_password_hash(hashed_password, password):
        return jsonify({"error": "Bad password"}), 400
    con.close()

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

    con = sqlite3.connect('server/proiect_isi.db')
    cursor = con.cursor()
    try:
        query = 'INSERT INTO Users (email, password, user_type) VALUES ("{}", "{}", "{}")'.format(email, hashed_password, user_type)
        print(query)
        res = cursor.execute(query)
        con.commit()
        con.close()
        return Response(status=200)
    except:
        return jsonify({'error': 'Username already exists or bad email type.'}), 409



if __name__ == '__main__':
    app.run(debug=True)