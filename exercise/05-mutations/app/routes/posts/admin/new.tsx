// 🐨 implement the action function here.
// 1. accept the request object
// 2. get the formData from the request
// 3. get the title, slug, and markdown from the formData
// 4. call the createPost function from your post.model.ts
// 5. redirect to "/posts/admin".

import { Form, useActionData } from "@remix-run/react";
import { ActionArgs, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createPost } from "../../../models/post.server";

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title")?.toString();
  const slug = formData.get("slug")?.toString();
  const markdown = formData.get("markdown")?.toString() || "";

  const titleError = title ? null : "Title required";
  const slugError = slug ? null : "Slug required";

  if (titleError || slugError) {
    return json({ titleError, slugError });
  }

  await createPost(title!, slug!, markdown);
  return redirect("posts/admin/");
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg required:border-red-600`;

export default function NewPost() {

  const actionData = useActionData<typeof action>();

  return (
    // 🐨 change this to a <Form /> component from @remix-run/react
    // 🐨 and add method="post" to the form.
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          <input type="text" name="title" className={inputClassName} required minLength={2} />
          {actionData?.titleError ?? <p className="text-red-600 ">{actionData?.titleError}</p>}
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          <input type="text" name="slug" className={inputClassName} />
          {actionData?.slugError ?? <p className="text-red-600">{actionData?.slugError}</p>}
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown: </label>
        <br />
        <textarea
          id="markdown"
          rows={8}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Create Post
        </button>
      </p>
    </Form>
  );
}
