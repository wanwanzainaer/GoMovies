import { useState } from 'react';
import Input from './form-components/Input';
import Alert from './ui-components/Alert';
const Login = (props) => {
  const [state, setState] = useState({
    email: '',
    password: '',
    error: null,
    errors: [],
    alert: { type: 'd-none', message: '' },
  });
  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    setState((s) => ({ ...s, [name]: value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    let errors = [];
    if (state.email === '') {
      errors.push('email');
    }
    if (state.password === '') {
      errors.push('password');
    }
    if (errors.length > 0) {
      setState((s) => ({ ...s, errors }));
      return false;
    }

    const data = new FormData(event.target);
    const payload = Object.fromEntries(data.entries());

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload),
    };
    fetch('http://localhost:4000/v1/signin', requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setState((s) => ({
            ...s,
            alert: { type: 'alert-danger', message: data.error.message },
          }));
        } else {
          handleJWTTokenChange(data.response);
          window.localStorage.setItem('jwt', data.response);
          props.history.push({
            pathname: '/admin',
          });
        }
      });
  };

  const handleJWTTokenChange = (token) => {
    props.handleJWTChange(token);
  };

  const hasError = (key) => {
    return state.errors.indexOf(key) !== -1;
  };
  return (
    <>
      <h2>Login</h2>
      <hr />
      <Alert
        alertType={state.alert.type}
        alertMessage={state.alert.alertMessage}
      />
      <form className="pt-3" onSubmit={handleSubmit}>
        <Input
          title="Email"
          name="email"
          type="email"
          placeholder="Please enter your account email"
          handleChange={handleChange}
          className={hasError('email') ? 'is-invalid' : ''}
          errorDiv={hasError('email') ? 'text-danger' : 'd-none'}
          errorMsg={'Please enter a valid email address'}
        />
        <Input
          title="Password"
          name="password"
          type="password"
          handleChange={handleChange}
          className={hasError('password') ? 'is-invalid' : ''}
          errorDiv={hasError('password') ? 'text-danger' : 'd-none'}
          errorMsg={'Please enter password '}
        />
        <hr />
        <button className="btn btn-primary">Login</button>
      </form>
    </>
  );
};
export default Login;
