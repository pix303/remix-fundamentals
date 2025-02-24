import { marked } from "marked";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData, useParams } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPost } from "~/models/post.server";
import { ErrorFallback } from "~/components";

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  if (!post) {
    throw new Response("Not found", { status: 404, statusText: "Not found" });
  }

  const html = marked(post.markdown);
  return json({ post, html });
}

export default function PostSlug() {
  const { post, html } = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.log(error);
  return <ErrorFallback>Error reading post {error.name} - {error.message}</ErrorFallback>
}


export const CatchBoundary = () => {
  const catchData = useCatch();
  const params = useParams();
  if (catchData.status === 404) {
    return <ErrorFallback>Catch the error on reading post {params.slug}: {catchData.status} - {catchData.statusText}</ErrorFallback>
  }

  throw new Error(`This status is not handled: ${catchData.status}`);
}