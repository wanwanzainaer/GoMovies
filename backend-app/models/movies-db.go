package models

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

type DBModel struct {
	DB *sql.DB
}

func (m *DBModel) Get(id int) (*Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `select id, title, description, year, release_date, rating, runtime, mpaa_rating, 
							created_at, updated_at from movies where id=$1`

	row := m.DB.QueryRowContext(ctx, query, id)

	var movie Movie

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.Description,
		&movie.Year,
		&movie.ReleaseDate,
		&movie.Rating,
		&movie.Runtime,
		&movie.MPAARating,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	//get the genres

	query = `select
						mg.id, mg.movie_id, mg.genre_id, g.genre_name
						from 
							movies_genres mg
							left join genres g on (g.id = mg.genre_id)
						where 
							mg.movie_id = $1
					`

	rows, _ := m.DB.QueryContext(ctx, query, movie.ID)

	defer rows.Close()
	genres := make(map[int]string)
	for rows.Next() {
		var mg MovieGenre
		err := rows.Scan(
			&mg.ID,
			&mg.MovieID,
			&mg.GenreID,
			&mg.Genre.GenreName,
		)
		if err != nil {
			return nil, err
		}
		genres[mg.ID] = mg.Genre.GenreName
	}
	movie.MovieGenre = genres
	///////////////////////////////
	// query = `select id, movid_id, genre_id, created_at, updated_at where movid_id=$1`

	// rows, _ := m.DB.QueryContext(ctx, query, movie.ID)

	// movieGenres := make([]MovieGenre, 0)
	// for rows.Next() {
	// 	var genre Genre
	// 	var movieGenre MovieGenre
	// 	if err := rows.Scan(
	// 		&movieGenre.ID,
	// 		&movieGenre.MovieID,
	// 		&movieGenre.GenreID,
	// 		&movieGenre.CreatedAt,
	// 		&movieGenre.UpdatedAt,
	// 	); err != nil {
	// 		log.Fatal(err)
	// 	}
	// 	query = `select id, genre_name, created_at, updated_at where id=$1`
	// 	row := m.DB.QueryRowContext(ctx, query, movieGenre.GenreID)
	// 	err := row.Scan(
	// 		&genre.ID,
	// 		&genre.GenreName,
	// 		&genre.CreatedAt,
	// 		&genre.UpdatedAt,
	// 	)
	// 	movieGenre.Genre = genre
	// 	append(movieGenres, movieGenre)
	// }
	////////////////////
	return &movie, nil
}

func (m *DBModel) All() ([]*Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `select id, title, description, year, release_date, rating, runtime, mpaa_rating, 
	created_at, updated_at from movies order by title`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*Movie

	for rows.Next() {
		var movie Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.Description,
			&movie.Year,
			&movie.ReleaseDate,
			&movie.Rating,
			&movie.Runtime,
			&movie.MPAARating,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}
		genreQuery := `select
			mg.id, mg.movie_id, mg.genre_id, g.genre_name
		from 
			movies_genres mg
			left join genres g on (g.id = mg.genre_id)
		where 
			mg.movie_id = $1
		`

		genreRows, _ := m.DB.QueryContext(ctx, genreQuery, movie.ID)
		fmt.Println(movie)
		genres := make(map[int]string)
		for genreRows.Next() {
			var mg MovieGenre
			err := genreRows.Scan(
				&mg.ID,
				&mg.MovieID,
				&mg.GenreID,
				&mg.Genre.GenreName,
			)
			if err != nil {
				return nil, err
			}
			genres[mg.ID] = mg.Genre.GenreName
		}
		genreRows.Close()
		movie.MovieGenre = genres
		movies = append(movies, &movie)

	}

	return movies, nil
}
