""" The main Flask application file that bootstraps and starts the app. """

import os
from flask import request, jsonify
from flask_cors import CORS, cross_origin
from bootstrap import app_factory, database_factory
from twilio.rest import Client
from flask_sqlalchemy import SQLAlchemy
from models import db, UsersModel, ProductsModel

app = app_factory()
CORS(app, support_credentials=True)
# TODO: This doesn't have to be done here,
#       but should be done at some point to
#       mount SQLAlchemy to the Flask app.
# db = database_factory(app)

@app.route("/health-check")
def health_check():
    return {"success": True}

@app.route("/users", methods=['POST', 'GET'])
@cross_origin(supports_credentials=True)
def handle_users():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            name = data['name']
            phone = data['phone']
            new_user = UsersModel(name, phone)
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"message": "User has been created successfully."})
        else:
            return jsonify({"error": "The request payload is not in JSON format"})

@app.route('/users/<user_phone>', methods=['GET'])
@cross_origin(supports_credentials=True)
def handle_user(user_phone):
    user = UsersModel.query.filter_by(phone=user_phone).first()

    if request.method == 'GET':
        response = {
            "id": user.id,
            "name": user.name,
            "phone": user.phone
        }
        return jsonify({"user": response})

@app.route("/products", methods=['POST', 'GET'])
@cross_origin(supports_credentials=True)
def handle_products():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            message = data['message']
            new_product = ProductsModel(message)
            db.session.add(new_product)
            db.session.commit()
            return jsonify({"message": "Product has been created successfully."})
        else:
            return {"error": "The request payload is not in JSON format"}

    elif request.method == 'GET':
        products = ProductsModel.query.all()
        results = [
            {
                "id": product.id,
                "message": product.message
            } for product in products]
        return jsonify({"count": len(results), "products": results})

@app.route("/message", methods=['POST'])
@cross_origin(supports_credentials=True)
def handle_messages():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            product_id = data['product_id']
            user_id = data['user_id']
            product = ProductsModel.query.get_or_404(product_id)
            user = UsersModel.query.get_or_404(user_id)
            user_phone = '+1' + user.phone
            account_sid = ''
            auth_token = ''
            client = Client(account_sid, auth_token)

            message = client.messages.create(
                                body=product.message,
                                from_='+12055741463',
                                to=user_phone
                            )

            return jsonify({"message": "Message sent successfully."})
        else:
            return {"error": "The request payload is not in JSON format"}

if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", False))
