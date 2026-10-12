import useSWR from "swr";
import { IMaintenanceRequestDocument } from "@/models/MaintenanceRequest";
import { PaginatedResponse, PaginationParams } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "An error occurred while fetching the data.");
  }
  return res.json();
};

export function useMaintenanceRequests(params?: PaginationParams & { propertyId?: string; unitId?: string; status?: string; priority?: string }) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.propertyId) queryParams.append("propertyId", params.propertyId);
    if (params.unitId) queryParams.append("unitId", params.unitId);
    if (params.status) queryParams.append("status", params.status);
    if (params.priority) queryParams.append("priority", params.priority);
  }

  const queryString = queryParams.toString();
  const url = `/api/maintenance${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: IMaintenanceRequestDocument[]; pagination: any }>(
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

export function useMaintenanceRequest(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: IMaintenanceRequestDocument }>(
    id ? `/api/maintenance/${id}` : null,
    fetcher
  );

  return {
    request: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
