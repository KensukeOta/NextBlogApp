export async function fetchFilteredPosts(query: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/v1/posts?q=${query}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors);
    }
    const data = await res.json();
    return data.posts;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchAllPosts() {
  try {
    const res = await fetch(`${process.env.API_URL}/v1/posts`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errors = await res.json();
      console.log(errors);
      throw new Error(errors);
    }
    const data = await res.json();
    return data.posts;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchPost(id: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/v1/posts/${id}`, {
      headers: {
        Accept: "application/json",
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
