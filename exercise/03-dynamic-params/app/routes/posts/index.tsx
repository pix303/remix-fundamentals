import { json, TypedResponse } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPostListItems, Post } from "~/models/post.server";

export const loader = async (): Promise<TypedResponse<{ posts: Post[], size: number }>> => {
  return json({
    posts: await getPostListItems(),
    size: (await getPostListItems()).length,
  });
};

export default function Posts() {
  const { posts, size } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Posts</h1>
      <h2>Num of posts: {size}</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug} className="text-blue-600 underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
