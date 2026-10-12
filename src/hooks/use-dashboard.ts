import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "An error occurred while fetching the data.");
  }
  return res.json();
};

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: any }>(
    "/api/dashboard",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 30000,
      keepPreviousData: true,
    }
  );

  return {
    data: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
