import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EditMovie.css';
import Input from './form-components/Input';
import Select from './form-components/Select';
import Textarea from './form-components/Textarea';
import Alert from './ui-components/Alert';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
const EditMovie = (props) => {
  const [state, setState] = useState({
    movie: {
      id: 0,
      title: '',
      release_date: '',
      runtime: '',
      mpaa_rating: '',
      rating: '',
      description: '',
    },
    mpaaOptions: [
      { id: 'G', value: 'G' },
      { id: 'PG', value: 'PG' },
      { id: 'PG13', value: 'PG13' },
      { id: 'R', value: 'R' },
      { id: 'NC17', value: 'NC17' },
    ],
    isLoaded: false,
    error: null,
    errors: [],
    alert: { type: 'd-none', message: '' },
  });
  const { id } = useParams();

  const handleSubmit = (event) => {
    console.log('Form was submitted');
    console.log('jwt: ', props.jwt);
    event.preventDefault();

    //client side validation
    let errors = [];
    if (state.movie.title === '') {
      errors.push('title');
    }
    if (errors.length > 0) {
      setState((s) => ({ ...s, errors }));
      return false;
    }
    const data = new FormData(event.target);
    const payload = Object.fromEntries(data.entries());
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + props.jwt);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload),
    };
    console.log(requestOptions);

    fetch('http://localhost:4000/v1/movies', requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setState((s) => ({
            ...s,
            alert: { type: 'alert-danger', message: data.error.message },
          }));
        } else {
          setState((s) => ({
            ...s,
            alert: { type: 'alert-success', message: 'Changes Saved!' },
          }));
        }
      });
  };

  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    setState((s) => ({ ...s, movie: { ...s.movie, [name]: value } }));
  };
  const hasError = (key) => {
    return state.errors.indexOf(key) !== -1;
  };
  const confirmDelete = (e) => {
    console.log('Would delete movie id');
    confirmAlert({
      title: `Delete title: ${state.movie.title} Movie?`,
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            fetch(`http://localhost:4000/v1/movies/${state.movie.id}/delete`, {
              method: 'DELETE',
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  setState((s) => ({
                    ...s,
                    alert: {
                      type: 'alert-danger',
                      message: data.error.message,
                    },
                  }));
                } else {
                  props.history.push({
                    pathname: '/admin',
                  });
                }
              });
          },
        },
        { label: 'No', onClick: () => {} },
      ],
    });
  };

  useEffect(() => {
    if (id > 0) {
      fetch(`http://localhost:4000/v1/movies/${id}`)
        .then((res) => {
          if (res.status !== '200') {
            let err = Error;
            err.message = 'Invalid response code: ' + res.status;
            setState((s) => ({ ...s, error: err }));
          }
          return res.json();
        })
        .then((json) => {
          const releaseDate = new Date(json.movie.release_date);
          setState(
            (s) => ({
              ...s,
              isLoaded: true,
              movie: {
                ...json.movie,
                release_date: releaseDate.toISOString().split('T')[0],
              },
              error: null,
            }),
            (error) => {
              setState((s) => ({ ...s, isLoaded: true, error, movie: [] }));
            }
          );
        });
    } else {
      setState((s) => ({ ...s, isLoaded: true }));
    }
  }, [id]);

  const { movie, isLoaded, error } = state;
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div> Loading....</div>;
  }
  return (
    <>
      <h2>{id === 0 ? 'Add Movie' : 'Edit Movie'}</h2>
      <Alert alertType={state.alert.type} alertMessage={state.alert.message} />
      <hr />
      <form onSubmit={handleSubmit}>
        <input
          type="hidden"
          name="id"
          id="id"
          value={movie.id}
          onChange={handleChange}
        />
        <Input
          className={hasError('title' ? 'is-invalid' : '')}
          type="text"
          name="title"
          title="Title"
          value={movie.title}
          handleChange={handleChange}
          placeholder="Please text Movie Title"
          errorDiv={hasError('title') ? 'text-danger' : 'd-none'}
          errorMsg="Please enter a title"
        />
        <Input
          type="date"
          name="release_date"
          title="Release Date"
          value={movie.release_date}
          handleChange={handleChange}
          placeholder="Please text Movie Release date"
        />
        <Input
          type="text"
          name="runtime"
          title="Run Time"
          value={movie.runtime}
          handleChange={handleChange}
          placeholder="Please text Movie Run Time"
        />
        <Select
          title="MPAA Rating"
          name="mpaa_rating"
          handleChange={handleChange}
          value={movie.mpaa_rating}
          options={state.mpaaOptions}
          placeholder="Choose..."
        />

        <Input
          type="text"
          name="rating"
          title="Rating"
          value={movie.rating}
          handleChange={handleChange}
          placeholder="Please text Movie Rating"
        />

        <Textarea
          title="Description"
          name="description"
          rows="3"
          onChange={handleChange}
          value={movie.description}
          placeholder="Please text some description"
        />

        <hr />
        <button className="btn btn-primary">Save</button>
        {id > 0 && (
          <Link to="/admin" className="btn btn-warning ms-1">
            Cancel
          </Link>
        )}
        {movie.id > 0 && (
          <a
            href="#!"
            onClick={() => confirmDelete()}
            className="btn btn-danger ms-1"
          >
            Delete
          </a>
        )}
      </form>

      {/* <div className="mt-3">
        <pre>{JSON.stringify(state, null, 3)}</pre>
      </div> */}
    </>
  );
};
export default EditMovie;
