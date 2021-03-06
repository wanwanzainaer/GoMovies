import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Movies = () => {
  const [state, setState] = useState({
    movies: [],
    isLoaded: false,
    error: null,
  });

  useEffect(() => {
    fetch('http://localhost:4000/v1/movies')
      .then((res) => {
        if (res.status !== '200') {
          let err = Error;
          err.message = 'Invalid response code: ' + res.status;
          setState((s) => ({ ...s, error: err }));
        }
        return res.json();
      })
      .then((json) => {
        setState(
          { isLoaded: true, movies: json.movies, error: null },
          (error) => {
            setState({ isLoaded: true, error, movies: [] });
          }
        );
      });
  }, [setState]);

  const { movies, isLoaded, error } = state;
  if (!isLoaded) {
    return <p>Loading</p>;
  } else if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <h2>Choose a Movie</h2>
      <div className="list-group">
        {movies.map((movie) => (
          <Link
            key={movie.id}
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

export default Movies;
