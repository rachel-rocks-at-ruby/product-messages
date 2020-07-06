import React, { Component, Fragment } from 'react';

class Products extends Component {
    state = {
        message: null,
        product: null
    }

    updateMessage = (e) => {
        this.setState({ message: e.target.value });
    }

    makeProduct = async (e) => {
        e.preventDefault();
        const { message } = this.state;
        await this.props.actions.createProduct(message);
        this.setState({ message: null });
        document.getElementById("product-form").reset();
    }

    selectProduct = (product) => {
        this.setState({ product })
    }

    sendMessage = () => {
        const { product } = this.state;
        const { actions, user } = this.props;

        if (!user) {
            actions.setError('Must be logged in to send a message!');
            return;
        }

        const product_id = product.id;
        const user_id = user.id;
        fetch(
            `http://localhost:5000/message`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({ user_id, product_id })
            }
        )
            .then(() =>
                actions.setError('')
            )
            .catch(error => actions.setError(error))
    }

    render() {
        const { error, products } = this.props;
        const { product } = this.state;
        return (
            <Fragment>
                <h4>Create a Product</h4>

                <form id="product-form" onSubmit={this.makeProduct}>
                    <label>
                        Create a message for a new product:
                    <input type="text" name="message" onChange={this.updateMessage} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>

                <h4>Products</h4>
                <ul>
                    {products.map(product => {
                        return (
                            <li key={product.id} >
                                <button onClick={() => this.selectProduct(product)}>{product.id}</button>
                            </li>
                        )
                    })}
                </ul>

                {error ? <div className="redText">{error}</div> : null}
                {product ? <div>{product.id} - {product.message} <button onClick={() => this.sendMessage()}>Send Message</button></div> : null}
            </Fragment>
        )
    }
}

export default Products;
