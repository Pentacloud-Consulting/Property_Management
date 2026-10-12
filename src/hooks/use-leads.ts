import useSWR from "swr";
import { ILeadDocument } from "@/models/Lead";
import { PaginatedResponse, PaginationParams } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "An error occurred while fetching the data.");
  }
  return res.json();
};

export function useLeads(
  params?: PaginationParams & { status?: string; source?: string }
) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.status) queryParams.append("status", params.status);
    if (params.source) queryParams.append("source", params.source);
  }

  const queryString = queryParams.toString();
  const url = `/api/leads${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{ success: boolean } & PaginatedResponse<ILeadDocument>>(url, fetcher);

  return {
    data: data?.data,
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useLead(id: string) {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: ILeadDocument }>(
    id ? `/api/leads/${id}` : null,
    fetcher
  );

  return {
    lead: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
