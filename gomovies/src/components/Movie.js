import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
const Movie = (props) => {
  let { id } = useParams();
  const [state, setState] = useState({
    movie: {},
    isLoaded: false,
    error: null,
  });
  useEffect(() => {
    fetch('http://localhost:4000/v1/movies/' + id)
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
          { isLoaded: true, movie: json.movie, error: null },
          (error) => {
            setState({ isLoaded: true, error, movies: [] });
          }
        );
      });
  }, [setState, id]);

  const { movie, error, isLoaded } = state;
  if (movie.genres) {
    movie.genres = Object.values(movie.genres);
  } else {
    movie.genres = [];
  }
  if (!isLoaded) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  } else {
    return (
      <>
        <h2>
          Movie: {movie.title}, ({movie.year})
        </h2>

        <div className="float-start">
          <small>Rating: {movie.mpaa_rating}</small>
        </div>
        <div className="float-end">
          {movie.genres.map((m, index) => (
            <span className="badge bg-secondary me-1" key={index}>
              {m}
            </span>
          ))}
        </div>

        <div className="clearfix"></div>
        <hr />
        <table className="table table-compact table-striped">
          <thead></thead>
          <tbody>
            <tr>
              <td>
                <strong>Title:</strong>
              </td>
              <td>{movie.title}</td>
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              <td>{movie.description}</td>
            </tr>
            <tr>
              <td>
                <strong>Run Time:</strong>
              </td>
              <td>{movie.runtime} mins</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
};

export default Movie;
