# Lit loop (Literature + loops) is a bloging site 

### created a serverless backend using hono library and used cloudflare as the service.

### to run the backend -> clone the project -> cd /backend -> npm install
### create a postgres instance on Avien and a connection pool on www.prisma.io/accelerate 
### in .env give your avien url
### in wrnagler.jsonc give the accerelared prisma link in vars section
### then run npx prisma migrate dev --name init_schema
### then npx prisma generate --no-engine ( to generate prisma client so that we can do User.findOne() etc etc)
### npm install @prisma/extention-accelerate ( to deploy on worker nodes )
### when you change something in prisma.schema you should run npx prisma migrate dev --name init_schema( it will take the latest schma from the file and the data base url from .env(actual db url) and do the changes in actual db
### then generate the client (so that you can use User.add, post.findOne()) using npm prisma generate --no-engine




## to deployu

### npx wrangler login (to login into cloudflare account)
### npx wrangler whoami (to check where you are loggedin or not)


# .
# .
# .
# .
# .
# .
### connection pool architecture
<img width="1287" height="603" alt="image" src="https://github.com/user-attachments/assets/86b3fe1a-c998-4bc5-8fb0-48e5faaab470" />
