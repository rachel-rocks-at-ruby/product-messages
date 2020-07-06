import React, { Component, Fragment } from 'react';

class Users extends Component {
    state = {
        name: null,
        phone: null,
        status: null
    }

    setStatus = (status) => {
        this.setState({ status });
    }

    updateName = (e) => {
        this.setState({ name: e.target.value });
    }

    updatePhone = (e) => {
        this.setState({ phone: e.target.value });
    }

    createAccount = (e) => {
        e.preventDefault();
        const { name, phone } = this.state;
        this.props.actions.createUser(name, phone);
        this.setState({
            name: null,
            phone: null,
            status: null
        });
    }

    signIn = (e) => {
        e.preventDefault();
        const { phone } = this.state;
        this.props.actions.getUser(phone);
        this.setState({
            name: null,
            phone: null,
            status: null
        });
    }
    
    signOut = (e) => {
        e.preventDefault();
        this.props.actions.clearUser();
    }

    render() {
        const { user } = this.props;
        const { status } = this.state;

        return (
            <Fragment>
                {!user && <div>
                    <button onClick={() => this.setStatus('create')}>Create User Account</button> or <button onClick={() => this.setStatus('sign-in')}>Sign In</button>
                </div>}

                {user && user.name && <Fragment><div>Welcome, {user.name}</div>
                    <p><button onClick={this.signOut}>Sign Out</button></p></Fragment>}

                {status === 'sign-in' && <form onSubmit={this.signIn}>
                    <label>
                        Phone number:
                    <input type="text" name="phone" onChange={this.updatePhone} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>}

                {status === 'create' && <form onSubmit={this.createAccount}>
                    <label>
                        Name:
                    <input type="text" name="name" onChange={this.updateName} />
                    </label>
                    <label>
                        Phone number:
                    <input type="text" name="phone" onChange={this.updatePhone} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>}
            </Fragment>
        )
    }
}

export default Users;
