import { useLoaderData, useParams } from "@remix-run/react"
import { json, LoaderArgs, LoaderFunction, TypedResponse } from "@remix-run/node";
import { getPostItem, Post } from "~/models/post.server";

export const loader = async ({ params }: LoaderArgs): Promise<TypedResponse<Post>> => {
    return json(await getPostItem(params?.slug));
}

export default function PostDetail() {
    const post = useLoaderData<typeof loader>();
    return (
        <div>
            <h1>{post.title ?? "no post"}</h1>
            <p>{post.body}</p>
        </div>
    );
}

