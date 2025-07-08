import {
  Handshake,
  Filter,
  Plus,
  MoreHorizontal,
  Building,
  Users,
  Phone,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { SlideForm } from "@/components/ui/slide-form";
import { useToast } from "@/hooks/use-toast";
import type { WidgetDataProps } from "@/types";
import { apiClient } from "@/lib/apiClient";
import pluralize from 'pluralize';

export function TableWidget({ widget, data, cardHeight, cardWidth, getWidgetData

}: WidgetDataProps) {
  const tableData = data as any[];
  const [, setLocation] = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data && data.length > 0) {
      setIsLoading(false);
    }
  }, [data]);



  if (isLoading) {
    return (
      <Card className="widget-card">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-gray-500">Loading data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!tableData || tableData.length === 0) {
    return (
      <Card className="widget-card">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-gray-500">No data available</p>
        </CardContent>
      </Card>
    );
  }
  // Determine table type based on data structure
  const firstItem = tableData[0];
  let tableType = "generic";
  let title = "Data Table";

  if ((firstItem.email || firstItem.name) && firstItem.status) {
    tableType = "accounts";
    title = "Accounts";
  } else if ((firstItem.email || firstItem.name) && firstItem.phone) {
    tableType = "contacts";
    title = "Contacts";
  } else if ((firstItem.email || firstItem.name) && firstItem.value) {
    tableType = "opportunities";
    title = "Opportunities";
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Negotiation":
        return "bg-yellow-100 text-yellow-800";
      case "Proposal":
        return "bg-blue-100 text-blue-800";
      case "Qualification":
        return "bg-orange-100 text-orange-800";
      case "Discovery":
        return "bg-gray-100 text-gray-800";
      case "Closed Won":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Prospect":
        return "bg-blue-100 text-blue-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Form field configurations for different entity types
  const getFormFields = () => {
    switch (tableType) {
      case "accounts":
        return [
          {
            key: "name",
            label: "Account Name",
            type: "text" as const,
            required: true,
          },
          { key: "phone", label: "Phone Number", type: "phone" as const },
          { key: "email", label: "Email", type: "email" as const },
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
            key: "name",
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
          { key: "phone", label: "Phone Number", type: "phone" as const },
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

  const renderTableHeaders = () => {
    return null; // No headers needed
  };

  const handleRowClick = (item: any) => {
    if (tableType === "accounts") {
      setLocation(`/page/accounts/${item.id}`);
    }
    // } else if (tableType === "contacts") {
    //   setLocation(`/contacts/${item.id}`);
    // }
    else if (tableType === "opportunities") {
      setLocation(`/page/opportunities/${item.id}`);
    }
  };

  const handleTableTitleClick = () => {
    if (tableType === "accounts") {
      setLocation("/page/accounts");
    }
    // } else if (tableType === "contacts") {
    //   setLocation("/contacts");
    // } else if (tableType === "opportunities") {
    //   setLocation("/opportunities");
    // }
  };

  const handleAction = (action: string, item: any, event: React.MouseEvent) => {
    event.stopPropagation();
    if (action === "view") {
      handleRowClick(item);
    } else if (action === "edit") {
      setEditingItem(item);
      setIsFormOpen(true);
    } else if (action === "delete") {
      setDeleteItem(item);
    }
  };

  const handleViewAll = () => {
    handleTableTitleClick();
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const getTableType = (entity: string) => {
    switch (entity) {
      case "accounts": return "account";
      case "opportunities": return "opportunity";
      case "contacts": return "contact";
    }
  }

  function getSingular(word: string) {
    return pluralize.singular(word);
  }

  const handleFormSubmit = async (formData: Record<string, any>) => {
    setIsFormLoading(true);
    try {
      const method = editingItem ? "PATCH" : "POST";
      const url = editingItem
        ? `/data/update`
        : `/data/insert`;
      const requestData = {
        "schemaType": getTableType(tableType),
        records: [{ ...formData }]
      }
      const response = editingItem ?

        await apiClient.patch("/data/update", requestData) :

        await apiClient.post(url, requestData)
      console.log("Insert Response: ", response);
      if (editingItem) {
        toast.success("Record Updated");
      } else {
        toast.success("Record Created!")
        getWidgetData()
      }

      setIsFormOpen(false);
      setEditingItem(null);
      // Refetch data would go here in a real implementation
    } catch (error: any) {
      toast.error(`Error Saving: ${error.message || "There was an error saving the record."}`);
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

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;

    setIsDeleting(true);
    try {
      const requestData = {
        schemaType: getTableType(tableType),
        recordIds: [deleteItem.id],
      };
      const response = await apiClient.delete("/data/delete", requestData);
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Failed to delete record");
      // }
      toast.success("Record Deleted!");
      // toast({
      //   title: "Record Deleted",
      //   description: `${tableType.slice(0, -1)} has been deleted successfully.`,
      // });

      setDeleteItem(null);
      // In a real implementation, you would refetch the widget data here
    } catch (error: any) {
      toast.error(
        `Delete Error: ${error.message || "There was an error deleting the record."
        }`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const renderTableRows = () => {
    console.log(tableData)
    return tableData.slice(0, 7).map((item, index) => (
      <tr
        key={index}
        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${tableType === "accounts" ? "cursor-pointer" : "cursor-default"
          }`}
        onClick={
          tableType === "accounts" ? () => handleRowClick(item) : undefined
        }
      >
        <td className="">
          <div className="flex items-center">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {item.name || (item?.first_name + " " + item?.last_name)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {item?.email || item?.owner}
              </div>
            </div>
          </div>
        </td>
        <td className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => handleAction("view", item, e)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleAction("edit", item, e)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleAction("delete", item, e)}
                className="cursor-pointer text-red-600 dark:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    ));
  };

  return (
    <Card
      className="widget-card hover:shadow-lg transition-all duration-200 flex flex-col"
      style={{
        height: cardHeight,
        width: cardWidth,
        // margin: "5px",
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4 flex-shrink-0">
        <div
          className={`flex items-center space-x-2 ${tableType === "accounts" ? "cursor-pointer" : "cursor-default"
            }`}
          onClick={tableType === "accounts" ? handleTableTitleClick : undefined}
        >
          <CardTitle
            className={`text-lg font-semibold hover:text-blue-600 transition-colors capitalize hover:cursor-default`}  >
            {widget?.dataKey.split("_").map((s) => `${s} `)}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleViewAll}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleAddNew}
                className="cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-4 pb-4 pt-0 overflow-hidden">
        <div className="overflow-y-auto h-full">
          <table className="min-w-full">
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {renderTableRows()}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Slide Form */}
      <SlideForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={
          editingItem
            ? `Edit ${getSingular(title)}`
            : `Add ${getSingular(title)}`
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
    </Card>
  );
}
