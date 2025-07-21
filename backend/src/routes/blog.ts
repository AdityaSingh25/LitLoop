import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// MIDDLWWARE
blogRouter.use("/", async (c, next) => {
  // before it hit any route, what I need to do? -> i need to get the header, take the email, verify the jwt token in the header, if its verified successfully then proceed or else not

  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1]; // as we will send token like Bearer "tokenndjncjdsncdiks"
  console.log(token);
  const response = await verify(token, c.env.JWT_SECRET);

  if (response.id) {
    //👉 I used response.id as we have signed it using the id inside the object.
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

blogRouter.post("/", (c) => {
  return c.text("post req for blog route");
});

blogRouter.put("/", (c) => {
  return c.text("put req for blog route");
});

blogRouter.get("/api/v1/blog/:id", (c) => {
  return c.text("get req for blog route");
});

blogRouter.get("/bulk", async (c) => {
  c.text("Hello");
});
