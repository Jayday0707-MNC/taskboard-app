const BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  signup: (body) => request("/auth/signup", { method: "POST", body }),
  login: (body) => request("/auth/login", { method: "POST", body }),

  getBoards: () => request("/boards"),
  createBoard: (title) => request("/boards", { method: "POST", body: { title } }),
  getBoard: (id) => request(`/boards/${id}`),
  deleteBoard: (id) => request(`/boards/${id}`, { method: "DELETE" }),

  createList: (boardId, title) => request("/lists", { method: "POST", body: { boardId, title } }),
  updateList: (id, body) => request(`/lists/${id}`, { method: "PATCH", body }),
  deleteList: (id) => request(`/lists/${id}`, { method: "DELETE" }),

  createCard: (listId, title, description) =>
    request("/cards", { method: "POST", body: { listId, title, description } }),
  updateCard: (id, body) => request(`/cards/${id}`, { method: "PATCH", body }),
  deleteCard: (id) => request(`/cards/${id}`, { method: "DELETE" }),
};

export { getToken };
