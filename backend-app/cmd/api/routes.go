package main

import (
	"context"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func (app *application) wrap(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		ctx := context.WithValue(r.Context(), "params", ps)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func (app *application) routes() http.Handler {
	router := httprouter.New()
	secure := alice.New(app.validToken)

	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)
	router.HandlerFunc(http.MethodPost, "/v1/signin", app.Signin)

	// router.POST("/v1/movies/:id/edit", app.wrap(secure.ThenFunc(app.getOneMovie)))
	router.HandlerFunc(http.MethodGet, "/v1/movies/:id/edit", app.getOneMovie)
	router.HandlerFunc(http.MethodDelete, "/v1/movies/:id/delete", app.deleteMovie)

	router.HandlerFunc(http.MethodGet, "/v1/movies/:id", app.getOneMovie)
	router.HandlerFunc(http.MethodGet, "/v1/movies", app.getAllMovies)
	//router.HandlerFunc(http.MethodPost, "/v1/movies", app.updateMovie)
	router.POST("/v1/movies", app.wrap(secure.ThenFunc(app.updateMovie)))

	router.HandlerFunc(http.MethodGet, "/v1/genres", app.getAllGenres)
	router.HandlerFunc(http.MethodGet, "/v1/genres/:genre_id", app.getAllMoviesByGenre)
	return app.enableCORS(router)
}
