import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useParams,
  useTransition,
} from "@remix-run/react";
import invariant from "tiny-invariant";

// 🐨 you'll need to import `deletePost` and `updatePost` here as well.
import { createPost, deletePost, getPost, updatePost } from "~/models/post.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, "slug not found");
  if (params.slug === "new") {
    return json({ post: null });
  }

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);
  return json({ post });
}

// 🐨 you'll need the `params` in the action
export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  // 🐨 grab the "intent" from the form data
  const intent = formData.get("intent");
  const slug = formData.get("slug");

  invariant(intent, "no intent, no action");
  invariant(slug, "no slug, so what i can do with");

  // 🐨 if the intent is "delete" then delete the post
  // and redirect to "/posts/admin
  if (intent === "delete" && slug) {
    const deleteResult = await deletePost(slug.toString());
    invariant(deleteResult, "somethig goes wrong on delete " + slug);
    return redirect("posts/admin/");
  }

  const title = formData.get("title");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  // 🐨 if the params.slug is "new" then create a new post
  // otherwise update the post.
  let result;
  if (intent === "create") {
    result = await createPost({ title, slug, markdown });
  } else if (intent === "update") {
    result = await updatePost({ title, slug, markdown });
  }
  invariant(result, `error on ${intent} post ${intent === "update" ? slug : ""}`);
  return redirect("/posts/admin");
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function PostAdmin() {
  const data = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();
  const params = useParams();

  const transition = useTransition();

  // 🐨 now that there can be multiple transitions on this page
  // we'll need to disambiguate between them. You can do that with
  // the "intent" in the form data.
  // 💰 transition.submission?.formData.get("intent")
  const intent = transition.submission?.formData.get("intent")
  const isCreating = intent === "create";
  const isUpdating = intent === "update";
  const isDeleting = intent === "delete";
  const isNewPost = params.slug === "new";
  // 🐨 create an isUpdating and isDeleting variable based on the transition
  // 🐨 create an isNewPost variable based on whether there's a post on `data`.


  let label = isUpdating ? "Updating..." : "Update Post";
  if (isNewPost) {
    label = isCreating ? "Creating..." : "Create Post";
  }


  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            key={data?.post?.slug ?? "new"}
            defaultValue={data?.post?.title}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            className={`${inputClassName} disabled:opacity-60`}
            key={data?.post?.slug ?? "new"}
            defaultValue={data?.post?.slug}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:{" "}
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={8}
          name="markdown"
          className={`${inputClassName} font-mono`}
          key={data?.post?.slug ?? "new"}
          defaultValue={data?.post?.markdown}
        />
      </p>
      {/* 🐨 If we're editing an existing post, then render a delete button */}
      {/* 💰 The button's "name" prop should be "intent" and the "value" prop should be "delete" */}
      {/* 💰 Here's some good looking classes for it: className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300" */}
      {/* 🐨 It should say "Deleting..." when a submission with the intent "delete" is ongoing, and "Delete" otherwise. */}
      <div className="flex justify-end gap-3">
        {isNewPost ?? <button
          type="submit"
          name="intent"
          value="delete"
          className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300 mr-2"
        >
          {isDeleting ? "Deleting..." : "Delete Post"}
        </button>}

        <button
          type="submit"
          name="intent"
          value={!Boolean(data.post) ? "create" : "update"}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isCreating || isUpdating}
        >{label}
        </button>
      </div>
    </Form>
  );
}
