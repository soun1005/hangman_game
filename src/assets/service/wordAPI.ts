// https://random-word-api.herokuapp.com/word

async function wordAPI<T>(url: string): Promise<T> {
  const response = await fetch(url);

  // when retrieving data, always use await
  const data = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return data;
}

export default wordAPI;
