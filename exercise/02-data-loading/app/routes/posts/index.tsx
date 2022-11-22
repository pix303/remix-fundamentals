import { json, TypedResponse } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { getPostsListItems, Post } from "~/models/posts.server";


export const loader = async (): Promise<TypedResponse<Post[]>> => {
  const data = await getPostsListItems();
  return json<Post[]>(data);
}


export default function Posts() {
  const posts = useLoaderData<typeof loader>();
  return (
    <main>
      <h1 className="text-3xl">Posts</h1>
      <p>list all items</p>
      <ul className="list-disc">
        {
          posts.map(p => {
            return (
              <li key={p.slug}>
                <Link to={p.slug}>{p.title}</Link>
              </li>
            )
          })
        }
      </ul>
    </main>
  );
}
