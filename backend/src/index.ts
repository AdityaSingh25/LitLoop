import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.get("/", (c) => {
  return c.text("Hono working");
});

// SIGNUP route
app.post("/api/v1/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  });

  const token = await sign(
    {
      id: user.id,
    },
    c.env.JWT_SECRET
  );
  return c.json({
    "your jwt token is": token,
  });
});

// MIDDLWWARE
app.use("/api/v1/signin", async (c, next) => {
  // before it hit any route, what I need to do? -> i need to get the header, take the email, verify the jwt token in the header, if its verified successfully then proceed or else not

  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1]; // as we will send token like Bearer "tokenndjncjdsncdiks"
  console.log(token);
  const response = await verify(token, c.env.JWT_SECRET);

  if (response.id) {
    //👉 I used response.id as we have signed it using the id
    console.log("middleware working");
    (c as any).set("userId", response.id);
    await next();
  } else {
    c.status(403);
    return c.json({
      error: "unauthoried",
    });
  }
});

// SIGNIN route
app.post("/api/v1/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });

  if (!user) {
    c.status(403);
    return c.json({
      error: "user not found",
    });
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
});

app.post("/api/v1/blog", (c) => {
  return c.text("post req for blog route");
});

app.put("/api/v1/blog", (c) => {
  return c.text("put req for blog route");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("get req for blog route");
});

export default app;
