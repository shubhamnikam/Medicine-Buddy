### future scope
- history feature
- docker based
- make api from automatically from open api using some lib 
https://blog.logrocket.com/generating-integrating-openapi-services-react/
https://github.com/OpenAPITools/openapi-generator

### setup env in react
```
- create files:
  - .env => for common variables
  - .env.development => development env variables
  - .env.production => production envs variables

- add variables start with VITE_
- Access the environment variables
  - const apiUrl = import.meta.env.VITE_API_URL;
```

Remaining:
```cmd
pages
	- profile
	- history
fix
	- fix goto home & reset status
	- auth guard
	- navbar disappering
	- make all states to 1 object state and not separate for pending, data, error
	- implement toaster
	- logout => clear refresh token from backend & db
	- create docker file
	- add support of docker compose
```