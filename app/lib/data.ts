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

const ITEMS_PER_PAGE = 5;
export async function fetchFilteredPosts(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const res = await fetch(`${process.env.API_URL}/v1/api/posts?query=${query}&limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
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

export async function fetchPostsPages(query: string) {
  noStore();

  try {
    const res = await fetch(`${process.env.API_URL}/v1/api/posts?query=${query}`, {
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
    const totalPages = Math.ceil(data.allPosts.length / ITEMS_PER_PAGE);
    return totalPages;
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