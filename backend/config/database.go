package config

import (
	"context"
	"log"

	"golang-gql/ent"

	_ "github.com/lib/pq"
)

var Client *ent.Client

func ConnectDB() {
	dsn := "host=localhost user= password= dbname= port= sslmode=disable"

	client, err := ent.Open("postgres", dsn)
	if err != nil {
		panic("Database connection failed")
	}

	Client = client

	if err := Client.Schema.Create(context.Background()); err != nil {
		log.Fatalf("failed creating schema resources: %v", err)
	}
}
