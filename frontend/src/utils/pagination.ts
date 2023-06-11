export function paginate<T>(
  items: T[] | undefined,
  page: number,
  totalPages: number
) {
  const startIndex = (page - 1) * totalPages;

  if (items === undefined) return { items: [], totalPages: 1 };

  return {
    items: items.slice(startIndex, startIndex + totalPages),
    totalPages: Math.ceil(items.length / totalPages),
  };
}
