export const getPageList = async () => {
  const response = await fetch("/api/pages");
  if (!response.ok) throw new Error("Failed to fetch pages");
  return response.json();
};

export const getPage = async (id: string) => {
  const response = await fetch(`/api/pages/${id}`);
  if (!response.ok) throw new Error("Failed to fetch page");
  return response.json();
};

export const deletePage = async (id: string) => {
  const response = await fetch(`/api/pages/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete page");
  return response.json();
};
