#Test the Application:

1. Register a User:
   curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"kitto","password":"123456"}'

2. Login to Get JWT:
   curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"kitto","password":"123456"}' -o jwt_token.txt
   Response: { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }

3. Access Protected Route:
   curl http://localhost:3000/protected -H "Authorization: Bearer YOUR_JWT_TOKEN"
