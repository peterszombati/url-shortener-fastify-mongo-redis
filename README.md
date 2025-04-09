## start

```
docker compose up
cd nodejs
tsc
npm run start
```

### cURLs
create shorten
```
curl -X POST http://127.0.0.1:3000/shorten \
-H "Content-Type: application/json" \
-H 'Authorization: Api-Key admin:f13aaa6528c7be63b74cf8df514d3a4cc5776caec4b76bc5ee294c981e05f90e' \
-d '{"originalUrl": "https://facebook.com", "expiresAt": "2025-12-31T23:59:59Z"}'
```