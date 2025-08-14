import api from "./";

export const fetchCategories = async () => {
  console.log("Fetching categories...");

  const response = await api.get("users/categories");

  console.log("categories", response.data);

  //Simulate a delay for demonstraion purpose
  //do not use in production
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return response.data;
};

export const fetchProducts = async ({ pageParam, categoryId }: { pageParam: number | undefined; categoryId: number }) => {
  console.log("Fetching products...", pageParam, "Category: ", categoryId);

  let url = `users/products?limit=3&category=${categoryId}`;

  if (pageParam) {
    url += `&cursor=${pageParam}`;
  }

  const response = await api.get(url);

  // console.log("first", response.data);

  //Simulate a delay for demonstraion purpose
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return response.data;
};
