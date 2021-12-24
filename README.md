<h1> Car rent REST API</h1>

<h3>Requers</h3>

- Node.js (>16.13)
- NestJS (any)
- Postgres (>14)

<h3>Onboarding</h3>

- Create new database with name "**carRent**" in yor pgAdmin
  - Open project and run 
    - ```bash npm i```
  - in file ormconfig.json input database connection settings
    - **EXAMPLE**
      ```json
      {
        "type": "postgres",
        "host": "localhost",
        "port": 5432,
        "username": "admin",
        "password": "admin",
        "database": "carRent",
        "entities": ["dist/**/*.entity{.ts,.js}"],
        "synchronize": true,
        "autoLoadEntities": true  
      }
      ```
  - run 
    - ```bash npm run start```