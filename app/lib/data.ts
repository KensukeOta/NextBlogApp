import { unstable_noStore as noStore } from "next/cache";

export async function fetchUser(name: string) {
  noStore();

  try {
    const res = await fetch(`${process.env.API_URL}/v1/api/users?name=${name}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchAllPosts() {
  noStore();

  try {
    const res = await fetch(`${process.env.API_URL}/v1/api/posts`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors);
    }
    const data = await res.json();
    return data.allPosts;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchPost(id: string) {
  noStore();

  try {
    const res = await fetch(`${process.env.API_URL}/v1/api/posts/${id}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors);
    }
    const data = await res.json();
    return data.post;
  } catch (error) {
    console.log(error);
  }
}