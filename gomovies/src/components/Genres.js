import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Genres = () => {
  const [state, setState] = useState({
    genres: [],
    isLoaded: false,
    error: null,
  });

  useEffect(() => {
    fetch('http://localhost:4000/v1/genres')
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
          { isLoaded: true, genres: json.genres, error: null },
          (error) => {
            setState({ isLoaded: true, error, genres: [] });
          }
        );
      });
  }, [setState]);

  const { genres, isLoaded, error } = state;

  if (!isLoaded) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      <h2>Genres</h2>
      <ul>
        {genres.map((m) => (
          <li key={m.id}>
            <Link to={`/genres/${m.id}`}>{m.genre_name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Genres;
