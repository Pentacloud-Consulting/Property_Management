import useSWR from "swr";
import { IContactDocument } from "@/models/Contact";
import { PaginatedResponse } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "An error occurred while fetching the data.");
  }
  return res.json();
};

export function useContacts(params?: { page?: number; limit?: number; contactType?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.contactType) query.append("contactType", params.contactType);

  const { data, error, isLoading, mutate } = useSWR<{ data: IContactDocument[]; pagination: any }>(
    `/api/contacts?${query.toString()}`,
    fetcher
  );

  return {
    data: data?.data,
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}
