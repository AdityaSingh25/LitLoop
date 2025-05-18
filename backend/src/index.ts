import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

app.use("/api/v1/blog/*", async (c, next) => {
  // get the header
  // verify the header
  // if the header is correct, we need to proceed
  // if not, we need to return a 403 status code

  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1];
  const response = await verify(token, "secret");
  if (response.id) {
    next();
  } else c.status(403);
  return c.json({
    error: "unauthorised",
  });
});

app.post("/api/v1/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json(); // as converting body to json is a asynchronous call

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  });

  console.log(user);

  const token = await sign({ id: user.id }, "secret");

  return c.json({
    jwt: token,
  });
});

app.post("/api/v1/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    },
  });

  if (!user) {
    return c.json({
      message: "user not found",
    });
  }

  const jwt = await sign({ id: user.id }, "secret");
  return c.json({
    jwt,
  });
});

app.post("/api/v1/blog", (c) => {
  return c.text("Hello Hono!");
});

app.put("/api/v1/blog", (c) => {
  return c.text("Hello Hono!");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("Hello Hono!");
});

export default app;
