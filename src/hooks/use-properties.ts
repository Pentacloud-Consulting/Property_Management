import useSWR from "swr";
import { IPropertyDocument } from "@/models/Property";
import { PaginatedResponse, PaginationParams } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "An error occurred while fetching the data.");
  }
  return res.json();
};

export function useProperties(params?: PaginationParams & { accountId?: string; propertyType?: string }) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.accountId) queryParams.append("accountId", params.accountId);
    if (params.propertyType) queryParams.append("propertyType", params.propertyType);
  }

  const queryString = queryParams.toString();
  const url = `/api/properties${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: IPropertyDocument[]; pagination: any }>(
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

export function useProperty(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: IPropertyDocument }>(
    id ? `/api/properties/${id}` : null,
    fetcher
  );

  return {
    property: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
