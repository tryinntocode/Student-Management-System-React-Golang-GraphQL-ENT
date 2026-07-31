package main

import (
	"golang-gql/config"
	"golang-gql/graph"
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func main() {
	config.ConnectDB()
	srv := handler.NewDefaultServer(
		graph.NewExecutableSchema(
			graph.Config{Resolvers: &graph.Resolver{Client: config.Client}},
		),
	)
	http.Handle("/", playground.Handler("GraphQL Playground", "/graphql"))

	http.Handle("/graphql", srv)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(http.DefaultServeMux)

	log.Fatal(http.ListenAndServe(":8086", handler))
}
