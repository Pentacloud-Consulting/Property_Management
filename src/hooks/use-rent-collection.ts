import useSWR from "swr";
import { IRentCollectionDocument } from "@/models/RentCollection";
import { PaginatedResponse, PaginationParams } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "An error occurred while fetching the data.");
  }
  return res.json();
};

export function useRentCollections(params?: PaginationParams & { tenantId?: string; unitId?: string; propertyId?: string; status?: string; month?: number; year?: number }) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.tenantId) queryParams.append("tenantId", params.tenantId);
    if (params.unitId) queryParams.append("unitId", params.unitId);
    if (params.propertyId) queryParams.append("propertyId", params.propertyId);
    if (params.status) queryParams.append("status", params.status);
    if (params.month) queryParams.append("month", params.month.toString());
    if (params.year) queryParams.append("year", params.year.toString());
  }

  const queryString = queryParams.toString();
  const url = `/api/rent-collection${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: IRentCollectionDocument[]; pagination: any }>(
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

export function useRentCollection(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: IRentCollectionDocument }>(
    id ? `/api/rent-collection/${id}` : null,
    fetcher
  );

  return {
    collection: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
