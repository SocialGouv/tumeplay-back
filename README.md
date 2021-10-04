
🚛 Moved to https://github.com/SocialGouv/tumeplay

---


## Tumeplay - Backend

This project serves as backend for Tumeplay Application. Made in NodeJS / TS with a PostgreSQL database. 

## Project setup

### Database 

The database system used is plain dockerized PostgreSQL. To build the database container, please use Dockerfile in dockers/postgresql.

Use command below to build : 

```
docker build -d tumeplay-pgsql .
```

### NodeJS

Standard NodeJS based project, using Typescript superset and Pug template system.

Use command below to build : 

```
docker build -d tumeplay-backend .
```

Files in "src/loaders" folder are loaded first, initializing Sequelize with "models/" and Express with routes found in "api/" and "front/".

### Environment variables

There's a bunch of environment variables needed to run the project.

#### Database : 

- POSTGRES_USER : User login, created automatically and used by NodeJS backend
- POSTGRES_PASSWORD : User password, used by NodeJS backend
- POSTGRES_DB : Database name, used by NodeJS backend 

#### Backend : 

- JWT_SECRET : Secret passphrase, used to encode JWT Tokens
- DATABASE_HOST : Host running the database ( in context of provided docker-compose, "db" )
- DATABASE_LOGIN : Login used to connect to database ( in context of provided docker-compose, should be the same as POSTGRES_USER )
- DATABASE_PASSWORD : Password used to connect to database ( in context of provided docker-compose, should be the same as POSTGRES_PASSWORD )
- DATABASE_NAME : Target database name ( in context of provided docker-compose, should be the same as POSTGRES_DB )
- DATABASE_FORCE : *CAUTION*. This setting *drop and recreate* the target database. Use only in a "first run" context.
- SERVER_PORT : NodeJS Express port used ( usually 5000 )
- DEFAULT_ADMIN_LOGIN : First user's login created on first run, checked otherwise. 
- DEFAULT_ADMIN_PASSWORD : First user's password set on run
- MONDIALRELAY_ID : API ID used in conjunction with MondialRelay SOAP API
- MONDIALRELAY_SECRET : API secret's key, used to communicate with MondialRelay SOAP API 

Both "MondialRelay_*" are used to gather pickup delivery points.

### Running project

You can find a docker-compose example in root of project ( docker-compose.example.yml ); please rename it to docker-compose.yml, fill environment variables based on description above, then 

```
docker-compose up --build -d
```

Both PG and NodeJS containers will then run up, and connect each others. Based on environment variables, database may be *dropped and created*, use "DATABASE_FORCE" with caution.

#### First run - Filling database

Once logged in, you can find a "Synchronize" item in sidebar menu : once confirmed, files in "default_files" are loaded, providing a "first run" filled database. [USE WITH CAUTION.]
