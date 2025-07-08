import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { fetchPageConfigNew } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Filter,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns,
  Eye,
  Edit,
  Trash2,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FilterSlider } from "@/components/ui/filter-slider";
import { Checkbox } from "@/components/ui/checkbox";
import { SlideForm } from "@/components/ui/slide-form";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { staticListingConfig } from "@/lib/listingData";
import { apiClient } from "@/lib/apiClient";
import pluralize from "pluralize";
import { formatDate } from "@/utils/date.js";

interface ListingData {
  data: any[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  sort?: {
    by: string;
    order: "asc" | "desc";
  };
}

interface ListingColumn {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  type?: string;
}

interface ListingConfig {
  title: string;
  dataKey: string;
  actions: {
    toolbar: Array<{
      label: string;
      action: string;
      icon?: string;
      route?: string;
    }>;
    bulk: Array<{
      label: string;
      action: string;
      confirm?: boolean;
      route?: string;
    }>;
    row: Array<{
      label: string;
      action: string;
      icon?: string;
      route?: string;
      confirm?: boolean;
    }>;
  };
  filters: Record<string, any>;
  columns: ListingColumn[];
  pagination: {
    enabled: boolean;
    defaultPageSize: number;
  };
  searchEnabled: boolean;
  selectionEnabled: boolean;
}

export default function ListingPage() {
  const [location, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [dataLoading, setDataLoading] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [bulkEditFields, setBulkEditFields] = useState<Record<string, any>>({});
  const [listData, setListData] = useState<any[]>([])
  const { toast } = useToast();

  function getSingular(word: string) {
    return pluralize.singular(word);
  }

  //#region Extract entity type from URL (e.g., /accounts -> accounts)
  const entityType = location.split("/")[2] || "items";

  const { data: pageConfig, isLoading: pageLoading } = useQuery({
    queryKey: ["/api/page-config", `${entityType}-listing`],
    queryFn: () => fetchPageConfigNew(`${entityType}`),
  });

  // Initialize visible columns when page config loads
  useEffect(() => {
    if (pageConfig?.listingConfig?.columns) {
      const initialColumns = new Set(
        pageConfig.listingConfig.columns
          .filter((col: ListingColumn) => col.key !== "actions")
          .map((col: ListingColumn) => col.key)
      );
      setVisibleColumns(initialColumns);
      setPageSize(pageConfig.listingConfig.pagination.defaultPageSize || 10);
    } else {
      // Remove this after correct API.
      const initialColumns = new Set(
        staticListingConfig[entityType].columns
          .filter((col: ListingColumn) => col.key !== "actions")
          .map((col: ListingColumn) => col.key)
      );
      setVisibleColumns(initialColumns);
      setPageSize(staticListingConfig[entityType].pagination.defaultPageSize || 10);
    }
  }, [pageConfig]);

  const widget = pageConfig?.widgets.find((widget) => widget.dataKey?.trim());
  const dataKey: string = widget?.dataKey ?? "";
  //#endregion

  const config = staticListingConfig[entityType] as ListingConfig;
  const columns = config.columns || [];
  const displayColumns = columns.filter((col) => visibleColumns.has(col.key) || col.type === "actions")

  //Initial data load for pagination count
  const getInitialListingData = async () => {
    setDataLoading(true)
    await apiClient.get(`/data/view/${dataKey}`)
      .then((data: any) => {
        console.log(data)
        setPageSize(data?.meta?.pageSize)
        setTotalRecords(data?.meta?.totalRecords)
        setPage(data?.meta?.page)
        setTotalPages(Math.ceil((data?.meta?.totalRecords) / (data?.meta?.pageSize || 1)))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (dataKey) {
      getInitialListingData()
    }
  }, [dataKey])

  //to get data from query
  const getLisitingDataWithPage = async () => {
    setDataLoading(true)
    const fields = (staticListingConfig[entityType].columns.filter((s: any) => s.type != 'actions')).map((s: any) => s.key)
    if(fields.indexOf("_id")>0){
      fields[fields.indexOf("_id")] ="id";
    }
    await apiClient.post(`/query`, {
      table: getSingular(entityType),
      fields: fields,
      page: page,
      pageSize: pageSize
    })
      .then((data: any) => {
        console.log(data)
        setListData(data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setDataLoading(false)
      })
  }

  //only on page change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page > 0 && pageSize > 0) {
        setTotalPages(Math.ceil(totalRecords / (pageSize || 1)))
        getLisitingDataWithPage()
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [pageSize, page]);


  if (pageLoading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto sm:px-2 lg:px-2 w-full">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </main>
    );
  }

  if (!pageConfig?.widgets) {
    return (
      <main className="flex-1 h-screen bg-gray-50 max-w-7xl mx-auto sm:px-2 lg:px-2 w-full">
        <div className="text-center ">
          <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600 mt-2">
            The requested listing configuration could not be found.
          </p>
        </div>
      </main>
    );
  }

  // const config = pageConfig.listingConfig as ListingConfig;
  // const config = staticListingConfig[entityType]as ListingConfig;
  // console.log("config for ",entityType,"is :",config);
  // const listData = listingData?.data || [];
  // const columns = config.columns || [];
  // const displayColumns = columns.filter(
  //   (col) => visibleColumns.has(col.key) || col.type === "actions"
  // );

  // Form field configurations for different entity types
  const getFormFields = () => {
    switch (entityType) {
      case "accounts":
        return [
          {
            key: "name",
            label: "Account Name",
            type: "text" as const,
            required: true,
          },
          { key: "phone", label: "Phone Number", type: "phone" as const },
          {
            key: "email",
            label: "Email",
            required: true,
            type: "email" as const,
          },
          {
            key: "type",
            label: "Account Type",
            type: "select" as const,
            options: ["Customer", "Partner", "Reseller", "Prospect"],
          },
          { key: "owner", label: "Owner", type: "text" as const },
          {
            key: "billingStreet",
            label: "Billing Street",
            type: "text" as const,
          },
          { key: "billingCity", label: "Billing City", type: "text" as const },
          {
            key: "status",
            label: "Status",
            type: "select" as const,
            options: ["active", "prospect", "inactive"],
          },
        ];
      case "contacts":
        return [
          {
            key: "first_name",
            label: "Contact Name",
            type: "text" as const,
            required: true,
          },
          {
            key: "last_name",
            label: "Contact Name",
            type: "text" as const,
            required: true,
          },
          {
            key: "email",
            label: "Email",
            type: "email" as const,
            required: true,
          },
          { key: "phone_number", label: "Phone Number", type: "phone" as const },
          {
            key: "department",
            label: "Department",
            type: "select" as const,
            options: ["Sales", "Marketing", "Support", "Engineering"],
          },
        ];
      case "opportunities":
        return [
          {
            key: "name",
            label: "Opportunity Name",
            type: "text" as const,
            required: true,
          },
          { key: "value", label: "Value", type: "number" as const },
          { key: "owner", label: "Owner", type: "text", required: true as const },
          {
            key: "stage",
            label: "Stage",
            type: "select" as const,
            options: [
              "Prospecting",
              "Qualification",
              "Proposal",
              "Negotiation",
              "Closed Won",
              "Closed Lost",
            ],
          },
          {
            key: "close_date",
            label: "Expected Close Date",
            type: "date" as const,
          },
        ];
      default:
        return [];
    }
  };

  const handleRowClick = (item: any) => {
    if (!selectedRows.has(item?._id)) {
        localStorage.setItem("SelectedRecord",JSON.stringify({type:entityType,item}))
      navigate(`${entityType}/${item?._id}`);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleRowAction = (action: any, item: any) => {
    if (action.action === "edit") {
      setEditingItem(item);
      setIsFormOpen(true);
      return;
    }

    if (action.action === "delete") {
      setDeleteItem(item);
      return;
    }

    if (action.action === "view") {
      navigate(`/page/${entityType}/${item?._id}`);
      return;
    }

    const route = action.route?.replace(
      /:(\w+)/g,
      (match: string, param: string) => {
        return item[param] || item?._id;
      }
    );

    if (route) {
      navigate(route);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      // API Call for Deleting record.
      const requestData = {
        schemaType: getTableType(entityType),
        recordIds: [deleteItem?._id],
      };
      const response = await apiClient.delete("/data/delete", requestData);
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Failed to delete record");
      // }
      toast.success("Record Deleted!");
      setDeleteItem(null);
      // Refetch data would go here in a real implementation
    } catch (error: any) {
      toast.error(
        `Delete Error: ${error.message || "There was an error deleting the record."
        }`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getTableType = (entity: string) => {
    switch (entity) {
      case "accounts":
        return "account";
      case "opportunities":
        return "opportunity";
      case "contacts":
        return "contact";
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    setIsFormLoading(true);

    try {
      const method = editingItem ? "PATCH" : "POST";

      const url = editingItem ? `/data/update` : `/data/insert`;
      const requestData = {
        schemaType: getTableType(entityType),
        records: [{ ...formData }],
      };
      const response = editingItem
        ? await apiClient.patch("/data/update", requestData)
        : await apiClient.post(url, requestData);
      console.log("Insert Response: ", response);
      if (editingItem) {
        toast.success("Record Updated");
      } else {
        toast.success("Record Created!");
      }

      setIsFormOpen(false);
      setEditingItem(null);
      // Refetch data would go here in a real implementation
    } catch (error: any) {
      toast.error(
        `Error Saving: ${error.message || "There was an error saving the record."
        }`
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleToolbarAction = async (action: any) => {
    if (action.action === "add") {
      setEditingItem(null);
      setIsFormOpen(true);
    } else if (action.action === "export") {
      await handleExport();
    } else if (action.route) {
      navigate(action.route);
    }
  };

  const handleExport = async () => {
    try {
      // Fetch all data with current filters and sort, but without pagination
      const exportRequestBody = {
        companyId: "company_123",
        userId: "user_456",
        page: 1,
        pageSize: 999999, // Large number to get all records
        search: debouncedSearch,
        sort: {
          by: sortBy,
          order: sortOrder,
        },
        filters,
      };

      const response = await fetch(`/api/listing/${entityType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exportRequestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch export data");
      }

      const exportData = await response.json();

      // Filter data to only include visible columns
      const visibleColumnKeys = Array.from(visibleColumns);
      const filteredData = exportData.data.map((row: any) => {
        const filteredRow: any = {};
        visibleColumnKeys.forEach((key) => {
          if (row[key] !== undefined) {
            filteredRow[key] = row[key];
          }
        });
        return filteredRow;
      });

      const csvData = convertToCSV(filteredData);
      downloadCSV(csvData, `${entityType}_export.csv`);
      toast.success("Export Successful");
    } catch (error) {
      toast.error(`Export Failed:There was an error exporting the data.`);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return "";

    const headers = Object.keys(data[0]).filter((key) => key !== "actions");
    const csvHeaders = headers.join(",");

    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || "";
        })
        .join(",")
    );

    return [csvHeaders, ...csvRows].join("\n");
  };

  const downloadCSV = (csvData: string, filename: string) => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkEditSubmit = async () => {
    if (selectedRows.size === 0) return;

    try {
      const response = await fetch(`/api/${entityType}/bulk/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: Array.from(selectedRows),
          updates: bulkEditFields,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk update records");
      }
      toast.success(
        `Bulk Update Sucessful: Successfully updated ${selectedRows.size} records.`
      );
      setIsBulkEditOpen(false);
      setBulkEditFields({});
      setSelectedRows(new Set());
      // Refetch data would go here in a real implementation
    } catch (error: any) {
      toast.error(
        "Bulk Update Failed : There was an error updating the records."
      );
    }
  };

  const handleBulkAction = async (action: any) => {
    if (selectedRows.size === 0) {
      toast.warning("No Items Selected: Please select items first.");
      return;
    }

    if (action.confirm) {
      try {
        const response = await fetch(
          `/api/${entityType}/bulk/${action.action}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ids: Array.from(selectedRows),
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `Failed to ${action.action} records`
          );
        }
        toast(
          `Bulk Action Completed : Successfully ${action.action}d ${selectedRows.size} items. `
        );
        setSelectedRows(new Set());
        // Refetch data would go here in a real implementation
      } catch (error: any) {
        toast.error(
          `Bulk Action Failed: ${error.message ||
          `There was an error performing the bulk ${action.action}.`
          }`
        );
      }
    }
  };

  const formatValue = (value: any, column: ListingColumn) => {
    if (value === null || value === undefined) return "";

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (
      column.key.toLowerCase().includes("status") ||
      column.key.toLowerCase().includes("type")
    ) {
      return (
        <Badge
          variant={value}
          className=" w-full text-center block"
        >
          {value}
        </Badge>
      );
    }

    if (column.key.toLowerCase().includes("date") || column.key.toLowerCase().includes("createdat")) {
      return formatDate(value);
    }

    if (
      typeof value === "number" &&
      column.key.toLowerCase().includes("value")
    ) {
      return `$${value.toLocaleString()}`;
    }

    return String(value);
  };

  const getSortIcon = (field: string) => {
    // Show sort icon for the current sort field, including default sort
    if (sortBy === field) {
      return sortOrder === "asc" ? (
        <ChevronUp className="h-4 w-4 inline ml-1" />
      ) : (
        <ChevronDown className="h-4 w-4 inline ml-1" />
      );
    }
    return null;
  };

  const getActionIcon = (iconName?: string) => {
    switch (iconName) {
      case "eye":
        return <Eye className="h-4 w-4" />;
      case "edit":
        return <Edit className="h-4 w-4" />;
      case "trash":
        return <Trash2 className="h-4 w-4" />;
      case "download":
        return <Download className="h-4 w-4" />;
      case "plus":
        return <Plus className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 max-w-full mx-auto px-2 sm:px-4 lg:px-4 xl:px-4 w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ">
            {/* <CardTitle className="text-lg sm:text-xl">{config.title}</CardTitle> */}
            <CardTitle className="text-lg sm:text-xl">{`${entityType[0].toUpperCase()}${entityType.slice(1)}`}</CardTitle>

            {/* Search, Filters, and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center flex-1">
              {/* Search */}
              {config.searchEnabled && (
                <div className="relative flex-1 min-w-0 max-w-[30rem] min-w-[15rem]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={`Search ${config.title.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-[6px] shadow dark:bg-[#1C2A56] focus-visible:ring-0 placeholder-gray-600"
                  />
                </div>
              )}
            </div>
            {/* Toolbar Actions */}
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                {/* Filter and action buttons will go here */}

                {/* Filters */}
                {Object.keys(config.filters).length > 0 && (
                  <FilterSlider
                    isOpen={isFilterOpen}
                    onOpenChange={setIsFilterOpen}
                    filters={config.filters}
                    values={filters}
                    onFiltersChange={(newFilters) => {
                      setFilters(newFilters);
                      setPage(1);
                    }}
                    title={`Filter ${config.title}`}
                  />
                )}

                {/* Column Visibility */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-[#081028] hover:dark:bg-white hover:dark:text-black"
                    >
                      <Columns className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Columns</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {columns
                      .filter((col) => col.type !== "actions")
                      .map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.key}
                          checked={visibleColumns.has(column.key)}
                          onCheckedChange={(checked) => {
                            const newVisible = new Set(visibleColumns);
                            if (checked) {
                              newVisible.add(column.key);
                            } else {
                              newVisible.delete(column.key);
                            }
                            setVisibleColumns(newVisible);
                          }}
                        >
                          {column.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Bulk Actions */}
                {config.selectionEnabled && selectedRows.size > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white dark:bg-[#081028] hover:dark:bg-white "
                      >
                        <span className="hidden sm:inline">Actions </span>(
                        {selectedRows.size})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {config.actions.bulk.map((action, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() =>
                            action.action === "bulk_edit"
                              ? setIsBulkEditOpen(true)
                              : handleBulkAction(action)
                          }
                        >
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {config.actions.toolbar.map((action, index) => (
                <Button
                  key={index}
                  variant={"outline"}
                  onClick={() => handleToolbarAction(action)}
                  className="flex-shrink-0 bg-white dark:bg-[#081028] hover:dark:bg-white hover:dark:text-black"
                  size="sm"
                >
                  {getActionIcon(action.icon)}
                  <span
                    className={`${action.icon ? "ml-2" : ""} hidden sm:inline`}
                  >
                    {action.label}
                  </span>
                  <span className="hidden sm:inline">
                    {action.icon ? "" : action.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {dataLoading ? (<>
            <Skeleton className="h-10 w-full mb-1" />
            <Skeleton className="h-10 w-full mb-1" />
            <Skeleton className="h-10 w-full mb-1" />
            <Skeleton className="h-10 w-full mb-1" />
            <Skeleton className="h-10 w-full mb-1" />
            <Skeleton className="h-10 w-full mb-1" />
            <Skeleton className="h-10 w-full mb-1" />
            <Skeleton className="h-10 w-full mb-1" />
            <Skeleton className="h-10 w-full" />
          </>) : listData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm
                  ? "No results found"
                  : `No ${config.title.toLowerCase()} available`}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-white dark:bg-[#081028] sticky top-0 z-20">
                    <tr className="border-b-2 border-[#E8E8E8]">
                      {config.selectionEnabled && (
                        <th className="text-left py-2 px-2 w-12">
                          <Checkbox
                            className="shadow-none border-[#C9C5C5] border-2"
                            checked={
                              selectedRows.size === listData.length &&
                              listData.length > 0
                            }
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRows(
                                  new Set(listData.map((item) => item?._id))
                                );
                              } else {
                                setSelectedRows(new Set());
                              }
                            }}
                          />
                        </th>
                      )}
                      {displayColumns.map((column) => (
                        <th
                          key={column.key}
                          className={`text-left py-3 px-2 font-semibold  text-gray-900 dark:text-white text-sm ${column.sortable
                            ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                            : ""
                            }`}
                          onClick={() =>
                            column.sortable && handleSort(column.key)
                          }
                        >
                          <div className="flex items-center">
                            <span className="truncate">{column.label}</span>
                            {column.sortable && getSortIcon(column.key)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody >
                    {listData.map((item: any, index: number) => (
                      <tr
                        key={item?._id || index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b-2 border-[#E8E8E8] dark:border-gray-700"
                      >
                        {config.selectionEnabled && (
                          <td className="py-2 px-2">
                            <Checkbox
                              className="shadow-none border-[#C9C5C5] border-2"
                              checked={selectedRows.has(item?._id)}
                              onCheckedChange={(checked) => {
                                console.log(item)
                                const newSelected = new Set(selectedRows);
                                if (checked) {
                                  newSelected.add(item?._id);
                                } else {
                                  newSelected.delete(item?._id);
                                }
                                setSelectedRows(newSelected);
                              }}
                            />
                          </td>
                        )}
                        {displayColumns.map((column) => (
                          <td
                            key={column.key}
                            className={`py-1 px-2 text-sm ${column.type !== "actions" ? "cursor-pointer" : ""
                              }`}
                            onClick={() =>
                              column.type !== "actions" && handleRowClick(item)
                            }
                          >
                            {column.type === "actions" ? (
                              <div className="flex items-center gap-1">
                                {config.actions.row.map(
                                  (action, actionIndex) => (
                                    <Button
                                      key={actionIndex}
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRowAction(action, item);
                                      }}
                                      title={action.label}
                                      className={
                                        action.action === "delete"
                                          ? "text-red-500 hover:text-red-700"
                                          : ""
                                      }
                                    >
                                      {getActionIcon(action.icon)}
                                    </Button>
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="truncate max-w-[200px]">
                                {formatValue(item[column.key], column)}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {config.pagination.enabled && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <p className="text-sm text-gray-500">
                      Showing {(page - 1) * pageSize + 1} to{" "}
                      {Math.min(page * pageSize, totalRecords)} of {totalRecords}{" "}
                      results
                    </p>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) => {
                        setPageSize(parseInt(value));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 per page</SelectItem>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="25">25 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </Button>

                    {/* Page numbers */}
                    <div className="hidden sm:flex gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                page === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    {/* Mobile page indicator */}
                    <div className="sm:hidden flex items-center text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage(Math.min(totalPages, page + 1))
                      }
                      disabled={page >= totalPages}
                    >
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Slide Form */}
      <SlideForm
        key={1}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={
          editingItem
            ? `Edit ${pluralize.singular(config.title)}`
            : `Add ${pluralize.singular(config.title)}`
        }
        fields={getFormFields()}
        initialData={editingItem || {}}
        onSubmit={handleFormSubmit}
        isLoading={isFormLoading}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.name || "this item"}
              "? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Edit Slide Form */}
      <SlideForm
        key={2}
        isOpen={isBulkEditOpen}
        onOpenChange={setIsBulkEditOpen}
        title={`Bulk Edit ${selectedRows.size} ${config.title}`}
        fields={getFormFields().map((field) => ({
          ...field,
          required: false,
          label: `Update ${field.label}`,
        }))}
        initialData={bulkEditFields}
        onSubmit={(data) => {
          // Filter out empty values
          const filteredData = Object.entries(data).reduce(
            (acc, [key, value]) => {
              if (value !== "" && value !== null && value !== undefined) {
                acc[key] = value;
              }
              return acc;
            },
            {} as Record<string, any>
          );

          setBulkEditFields(filteredData);
          handleBulkEditSubmit();
        }}
        isLoading={false}
        stickyButtons={true}
      />
    </main>
  );
}