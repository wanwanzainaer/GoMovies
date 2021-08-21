import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const Genre = (props) => {
  const [state, setState] = useState({
    movies: [],
    isLoaded: false,
    error: null,
    genreName: '',
  });
  const { id } = useParams();
  const { genreName } = props.location;
  useEffect(() => {
    fetch(`http://localhost:4000/v1/genres/${id}`)
      .then((res) => {
        if (res.status !== '200') {
          let err = Error;
          err.message = 'Invalid response code: ' + res.status;
          setState((s) => ({ ...s, error: err }));
        }
        return res.json();
      })
      .then((json) => {
        let movies = [];
        if (json.movies != null) movies = json.movies;
        setState(
          { isLoaded: true, movies, error: null, genreName },
          (error) => {
            setState({ isLoaded: true, error, movies: [], genreName: '' });
          }
        );
      });
  }, [setState, genreName, id]);
  const { movies, isLoaded, error } = state;

  if (!isLoaded) {
    return <p>Loading</p>;
  } else if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <h2>Genre: {state.genreName}</h2>
      <div className="list-group">
        {movies.map((movie) => (
          <Link
            to={`/movies/${movie.id}`}
            className="list-group-item list-group-item-action"
          >
            {movie.title}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Genre;
