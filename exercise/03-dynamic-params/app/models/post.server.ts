import { prisma } from "~/db.server";

export type Post = {
  title: string;
  slug: string;
  id?: string;
  body?: string;
}

export async function getPostListItems(): Promise<Post[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  const result: Post[] = data.map((i: { title: string, id: string }) => {
    return { title: i.title, slug: i.id.toString() };
  });

  return result;
}

export async function getPostItem(id?: string): Promise<Post> {
  if (!id) return { title: "no post", slug: "" }
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/" + id);
  const data = await response.json();
  return { ...data, ...{ slug: data.id.toString() } }
}