import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "litloop-commons";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// MIDDLWWARE
blogRouter.use("/*", async (c, next) => {
  // before it hit any route, what I need to do? -> i need to get the header, take the email, verify the jwt token in the header, if its verified successfully then proceed or else not
  const authHeader = c.req.header("Authorization") || "";
  const token = authHeader.split(" ")[1];
  try {
    const response = await verify(token, c.env.JWT_SECRET);
    if (response) {
      c.set("userId", response.id as string);
      await next();
    }
  } catch (e) {
    c.status(403);
    return c.json({
      message: "invalid useremail",
    });
  }
});

// creating the blog
blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Invalid Inputs",
    });
  }

  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorid: userId,
    },
  });
  return c.json({
    id: blog.id,
  });
});

// blog update route
blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Invalid Inputs",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({
    message: "Blog is updated",
    id: post.id,
  });
});

// Todo : add pagination
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.post.findMany();

  return c.json({ posts });
});

// get blog by Id route
blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });

    return c.json({
      post,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      messgae: e,
    });
  }
});
