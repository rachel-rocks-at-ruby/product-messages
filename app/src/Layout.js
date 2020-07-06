import React, { Component, Fragment } from 'react';
import Products from './Products';
import Users from './Users';

class Layout extends Component {
    state = {
        error: '',
        products: [],
        user: null,
        users: []
    }

    createUser = (name, phone) => {
        fetch(
            `http://localhost:5000/users`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({ name, phone })
            }
        )
            .then(() => {
                this.getUser(phone);
            })
            .catch(error => console.log(error));
    }

    getUser = (phone) => {
        fetch(
            `http://localhost:5000/users/${phone}`,
            {
                method: "GET",
            }
        )
            .then(res => res.json())
            .then(user =>
                this.setState({ error: '', user: user.user })
            )
            .catch(error => console.log(error));
    }

    clearUser = () => {
        this.setState({ user: null });
    }

    createProduct = (message) => {
        console.log('createProduct', message)

        fetch(
            `http://localhost:5000/products`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({ message })
            }
        ).then(() => {
            this.getProducts();
        })
            .catch(error => console.log(error));
    }

    getProducts = () => {
        fetch(
            `http://localhost:5000/products`,
            {
                method: "GET",
            }
        )
            .then(res => res.json())
            .then(products =>
                this.setState({ products: products.products })
            )
            .catch(error => console.log(error));
    }

    setError = (error) => {
        this.setState({ error })
    }

    async componentDidMount() {
        await this.getProducts();
    }

    render() {
        const { error, products, user } = this.state;
        const userActions = {
            clearUser: this.clearUser,
            createUser: this.createUser,
            getUser: this.getUser
        }

        const productActions = {
            createProduct: this.createProduct,
            setError: this.setError
        }

        return (
            <Fragment>
                <Users actions={userActions} user={user} />

                <Products actions={productActions} error={error} products={products} user={user} />
            </Fragment>
        )
    }
}

export default Layout;
