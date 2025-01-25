let posts = [];

// handlers
export const getPosts = () => posts;

export const addPosts = (post) => {
    posts.push(post);
}

export const deletePosts = (id) => {
    posts = posts.filter((post) => post.id !== id);
}

export const updatePosts = (id, title, desc) => {
    const post = posts.find((post) => post.id === id);

    if (post) {
        post.title = title;
        post.desc = desc;
    } else {
        throw new Error("NO POST FOUND");
    }
}

export const getById = (id) => {
    return posts.find((post) => post.id === id);
}