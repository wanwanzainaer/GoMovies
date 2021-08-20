import React, { Fragment } from 'react';
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
const App = () => {
  return (
    <Router>
      <div className="container">
        <div className="row">
          <h1 className="mt-3">Go Watch a Movie</h1>
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
                <li className="list-group-item">
                  <Link to="/admin">Manage Catalogue</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-md-10">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/movies" component={Movies} />
              <Route exact path="/genres" component={Genres} />
              <Route path="/movies/:id" component={Movie} />
              <Route exact path="/admin" component={Admin} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
