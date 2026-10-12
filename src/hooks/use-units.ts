import useSWR from "swr";
import { IUnitDocument } from "@/models/Unit";
import { PaginatedResponse, PaginationParams } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "An error occurred while fetching the data.");
  }
  return res.json();
};

export function useUnits(params?: PaginationParams & { propertyId?: string; occupancyStatus?: string }) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.propertyId) queryParams.append("propertyId", params.propertyId);
    if (params.occupancyStatus) queryParams.append("occupancyStatus", params.occupancyStatus);
  }

  const queryString = queryParams.toString();
  const url = `/api/units${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: IUnitDocument[]; pagination: any }>(
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

export function useUnit(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: IUnitDocument }>(
    id ? `/api/units/${id}` : null,
    fetcher
  );

  return {
    unit: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
