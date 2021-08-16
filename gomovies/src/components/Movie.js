import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
const Movie = (props) => {
  let { id } = useParams();
  const [state, setState] = useState({ movie: {} });
  useEffect(() => {
    setState({
      movie: {
        id: id,
        title: 'Some movie',
        runtime: 150,
      },
    });
  }, [setState, id]);
  return (
    <>
      <h2>
        Movie: {state.movie.title}, {state.movie.id}
      </h2>
      <table className="table table-compact table-striped">
        <thead></thead>
        <tbody>
          <tr>
            <td>
              <strong>Title:</strong>
            </td>
            <td>{state.movie.title}</td>
          </tr>
          <tr>
            <td>
              <strong>Run Time:</strong>
            </td>
            <td>{state.movie.runtime} mins</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Movie;
