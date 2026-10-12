"use client";

import { useUnits } from "@/hooks/use-units";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Building, MapPin, BoxSelect } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COLUMNS = [
  { id: "Vacant", title: "Vacant", color: "bg-blue-50 border-blue-200", headerColor: "bg-blue-600" },
  { id: "Occupied", title: "Occupied", color: "bg-green-50 border-green-200", headerColor: "bg-green-600" },
  { id: "Under Maintenance", title: "Maintenance", color: "bg-red-50 border-red-200", headerColor: "bg-red-600" },
];

export default function UnitBoardPage() {
  const { data: units = [], isLoading } = useUnits({ page: 1, limit: 1000 });

  if (isLoading) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6">
        <PageHeader title="Unit Availability Board" description="Loading board..." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  // Group units by status
  const groupedUnits = units.reduce((acc, unit) => {
    const status = unit.currentStatus || "Vacant";
    if (!acc[status]) acc[status] = [];
    acc[status].push(unit);
    return acc;
  }, {} as Record<string, typeof units>);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden p-4 md:p-8 pt-6">
      <PageHeader 
        title="Unit Availability Board" 
        description="Kanban view of all units across all properties."
      />

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max items-start">
          {COLUMNS.map((column) => {
            const columnUnits = groupedUnits[column.id] || [];
            
            return (
              <div 
                key={column.id} 
                className={`flex flex-col w-80 max-h-full rounded-xl border ${column.color} bg-background overflow-hidden shadow-sm`}
              >
                {/* Column Header */}
                <div className={`${column.headerColor} text-white px-4 py-3 flex justify-between items-center`}>
                  <h3 className="font-semibold">{column.title}</h3>
                  <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none">
                    {columnUnits.length}
                  </Badge>
                </div>

                {/* Column Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/10">
                  {columnUnits.length === 0 ? (
                    <div className="text-center p-4 text-sm text-muted-foreground border-2 border-dashed rounded-lg border-muted-foreground/20">
                      No units in this status.
                    </div>
                  ) : (
                    columnUnits.map((unit) => {
                      const prop = unit.propertyId as any;
                      const tenant = unit.currentTenantId as any;

                      return (
                        <Link 
                          href={`/units/${unit._id}`} 
                          key={unit._id.toString()}
                          className="block bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-primary text-lg flex items-center">
                              <BoxSelect className="h-4 w-4 mr-1.5" />
                              {unit.unitNumber}
                            </div>
                            <div className="text-sm font-semibold">${unit.rentAmount}</div>
                          </div>
                          
                          {prop && (
                            <div className="text-xs text-muted-foreground flex items-center mb-1">
                              <Building className="h-3 w-3 mr-1" />
                              <span className="truncate">{prop.propertyName}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-4 pt-3 border-t">
                            <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md">
                              {unit.unitType || "Unit"}
                            </span>
                            
                            {tenant ? (
                              <span className="text-xs text-primary font-medium truncate max-w-[120px]">
                                {tenant.contactId?.firstName || 'Tenant'} {tenant.contactId?.lastName || ''}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">
                                No Tenant
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
