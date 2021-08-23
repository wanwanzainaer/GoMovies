import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import Movies from './components/Movies';
import Admin from './components/Admin';
import Home from './components/Home';
import Movie from './components/Movie';
import Genres from './components/Genres';
import Genre from './components/Genre';
import EditMovie from './components/EditMovie';
import Login from './components/Login';
const App = () => {
  const [state, setState] = useState({ jwt: '' });

  useEffect(() => {
    let t = window.localStorage.getItem('jwt');
    if (t) {
      if (state.jwt === '') {
        setState({ jwt: t });
      }
    }
  }, [state.jwt]);

  const handleJWTChange = (jwt) => {
    setState({ jwt });
  };

  const logout = () => {
    setState({ jwt: '' });
    window.localStorage.removeItem('jwt');
  };

  let loginLink;
  if (state.jwt === '') {
    loginLink = <Link to="/login">Login</Link>;
  } else {
    loginLink = (
      <Link to="/logout" onClick={logout}>
        Logout
      </Link>
    );
  }
  return (
    <Router>
      <div className="container">
        <div className="row">
          <div className="col mt-3">
            <h1 className="mt-3">Go Watch a Movie</h1>
          </div>
          <div className="col mt-3 text-end">{loginLink}</div>
          <hr className="mb-3"></hr>
        </div>
        <div className="row">
          <div className="col-md-2">
            <nav>
              <ul className="list-group">
                <li className="list-group-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/movies">Movies</Link>
                </li>
                <li className="list-group-item">
                  <Link to="/genres">By Genres</Link>
                </li>
                {state.jwt !== '' && (
                  <>
                    <li className="list-group-item">
                      <Link to="/movies/edit/0">Add Movie</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to="/admin">Manage Catalogue</Link>
                    </li>
                  </>
                )}
              </ul>
              <pre>{JSON.stringify(state, null, 3)}</pre>
            </nav>
          </div>
          <div className="col-md-10">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/movies" component={Movies} />
              <Route exact path="/genres" component={Genres} />
              <Route exact path="/genres/:id" component={Genre} />
              <Route
                exact
                path="/login"
                component={(props) => (
                  <Login {...props} handleJWTChange={handleJWTChange} />
                )}
              />
              {state.jwt !== '' && (
                <>
                  <Route
                    exact
                    path="/movies/edit/:id"
                    component={(props) => (
                      <EditMovie {...props} jwt={state.jwt} />
                    )}
                  />
                  <Route exact path="/movies/:id" component={Movie} />
                  <Route exact path="/admin" component={Admin} />
                </>
              )}
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
