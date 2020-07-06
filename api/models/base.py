""" Initializes the model bases without mounting it to the Flask App. """


from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class UsersModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    phone = db.Column(db.String(), unique=True)

    def __init__(self, name, phone):
        self.name = name
        self.phone = phone

class ProductsModel(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String())

    def __init__(self, message):
        self.message = message

# class ProductsModel(db.Model):
#     __tablename__ = 'products'

#     id = db.Column(db.Integer, primary_key=True)
#     products = db.relationship('MessagesModel', backref='product')

#     def __init__(self, products):
#         self.products = products

# class MessagesModel(db.Model):
#     __tablename__ = 'messages'

#     id = db.Column(db.Integer, primary_key=True)
#     product_id = db.Column(db.Integer, db.ForeignKey('productsmodel.id'))

#     def __init__(self, product_id):
#         self.product_id = product_id
