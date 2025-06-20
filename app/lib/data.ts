const PER_PAGE = 5;
export async function fetchFilteredPosts(query: string, page: number) {
  try {
    const res = await fetch(
      `${process.env.API_URL}/v1/posts?q=${encodeURIComponent(query)}&page=${page}&per=${PER_PAGE}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );
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

export async function fetchPostsPages(query: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/v1/posts?q=${encodeURIComponent(query)}`, {
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
    const totalPages = Math.ceil(data.total_count / PER_PAGE);
    return totalPages;
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

export async function fetchUser(name: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/v1/users/${encodeURIComponent(name)}`, {
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
    return data.user;
  } catch (error) {
    console.log(error);
  }
}
