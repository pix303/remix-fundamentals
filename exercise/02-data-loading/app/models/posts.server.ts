export type Post = {
    title: string;
    slug: string;
}

export async function getPostsListItems() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    const result: Post[] = data.map((i: { title: string, id: string }) => {
        return { title: i.title, slug: i.id };
    });

    return result;
}