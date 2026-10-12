import useSWR from "swr";
import { ITenantDocument } from "@/models/Tenant";
import { PaginatedResponse, PaginationParams } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "An error occurred while fetching the data.");
  }
  return res.json();
};

export function useTenants(params?: PaginationParams & { unitId?: string; propertyId?: string; status?: string }) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.unitId) queryParams.append("unitId", params.unitId);
    if (params.propertyId) queryParams.append("propertyId", params.propertyId);
    if (params.status) queryParams.append("status", params.status);
  }

  const queryString = queryParams.toString();
  const url = `/api/tenants${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: ITenantDocument[]; pagination: any }>(
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

export function useTenant(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: ITenantDocument }>(
    id ? `/api/tenants/${id}` : null,
    fetcher
  );

  return {
    tenant: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
