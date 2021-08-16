import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Movies = () => {
  const [state, setState] = useState({ movies: [] });

  useEffect(() => {
    setState((s) => ({
      ...s,
      movies: [
        { id: 1, title: 'The Shawshank Redemption', runtime: 142 },
        { id: 2, title: 'The Godfather', runtime: 175 },
        { id: 3, title: 'The Dark Kinght', runtime: 153 },
      ],
    }));
  }, [setState]);

  return (
    <>
      <h2>Choose a Movie</h2>
      <ul>
        {state.movies.map((movie) => (
          <li key={movie.id}>
            <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Movies;
