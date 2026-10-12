import useSWR from "swr";
import { IAccountDocument } from "@/models/Account";
import { PaginatedResponse, PaginationParams } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "An error occurred while fetching the data.");
  }
  return res.json();
};

export function useAccounts(params?: PaginationParams) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  }

  const queryString = queryParams.toString();
  const url = `/api/accounts${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: IAccountDocument[]; pagination: any }>(
    url,
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

export function useAccount(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: IAccountDocument }>(
    id ? `/api/accounts/${id}` : null,
    fetcher
  );

  return {
    account: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
