import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { fetchPageConfig } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  Bot,
  Send,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
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
import DraggableTextField from "@/components/details/DraggableTextField";
import DraggableWrapper from "@/components/details/DraggableWrapper";
import pluralize from "pluralize";
import { apiClient } from "@/lib/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/types/store.type";

export default function DetailsPage() {
  const { toast } = useToast();
  const userData = useSelector((state: RootState) => state?.user)

  const [location, navigate] = useLocation();
  const [match, params] = useRoute("page/:entityType/:id");
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isDeleteFormOpen, setDeleteFormOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [contentList, setContentList] = useState<{ id: number, type: string }[]>([{ id: 1, type: "container" }, { id: 2, type: "container" }]);
  const [formFieldList, setFormFieldList] = useState<any[]>([]);
  const [sidebarCards, setSidebarCards] = useState<{ id: number, type: string }[]>([{ id: 1, type: "card" }, { id: 2, type: "card" }]);
  const [buttonList, setButonList] = useState<{ id: number, type: string }[]>([{ id: 1, type: "action-button" }, { id: 2, type: "action-button" }, { id: 3, type: "action-button" }]);
  const [formButtonList, setFormButtonList] = useState<{ id: number, type: string }[]>([{ id: 1, type: "form-button" }, { id: 2, type: "form-button" }, { id: 3, type: "form-button" }]);
  const [dragType, setDragType] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    setIsAdmin(userData?.user?.roles?.includes("admin"))
  }, [userData?.user.roles])

  if (!match || !params) {
    return (
      <main className="flex-1 max-w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 w-full">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900">Invalid URL</h1>
          <p className="text-gray-600 mt-2">
            The URL format is not recognized.
          </p>
        </div>
      </main>
    );
  }
  const { entityType, id } = params;

  // Fetch specific record data
  var {
    data: recordData,
    isLoading: dataLoading,
    refetch,
  } = useQuery({
    queryKey: ["/api/record-data", entityType, id],
    queryFn: async () => {
      const response = await fetch(`/api/${entityType}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch record data");
      }
      return response.json();
    },
  });

  // Update editData when recordData changes
  useEffect(() => {
    if (recordData) {
      setEditData(recordData);
    }
  }, [recordData]);

  useEffect(() => {
    //remove this once Filter is working
    const itemData = JSON.parse(localStorage.getItem("SelectedRecord"));
    const entity = location.split("/")[2];
    if (itemData && itemData.type == entity) {
      setEditData(itemData.item)
    }
  }, [])

  // Form field configurations for different entity types
  const getFormFields = (entityType: string) => {
    console.log("Fields Fetced");
    switch (entityType) {
      case "accounts":
        return [
          {
            key: "name",
            label: "Name",
            type: "text" as const,
            required: true,
            colSpan: 1,
          },
          {
            key: "phone",
            label: "Phone Number",
            type: "phone" as const,
            colSpan: 1,
          },
          { key: "email", label: "Email", type: "email" as const, colSpan: 1 },
          {
            key: "type",
            label: "Type",
            type: "select" as const,
            options: ["Customer", "Partner", "Reseller", "Prospect"],
            colSpan: 1,
          },
          { key: "owner", label: "Owner", type: "text" as const, colSpan: 1 },
          {
            key: "billingStreet",
            label: "Street",
            type: "text" as const,
            colSpan: 1,
          },
          {
            key: "billingCity",
            label: "City",
            type: "text" as const,
            colSpan: 1,
          },
          {
            key: "status",
            label: "Status",
            type: "select" as const,
            options: ["active", "prospect", "inactive"],
            colSpan: 1,
          },
        ];
      case "contacts":
        return [
          {
            key: "name",
            label: "Contact Name",
            type: "text" as const,
            required: true,
            colSpan: 1,
          },
          {
            key: "email",
            label: "Email",
            type: "email" as const,
            required: true,
            colSpan: 1,
          },
          {
            key: "phone",
            label: "Phone Number",
            type: "phone" as const,
            colSpan: 1,
          },
          {
            key: "department",
            label: "Department",
            type: "select" as const,
            options: ["Sales", "Marketing", "Support", "Engineering"],
            colSpan: 1,
          },
        ];
      case "opportunities":
        return [
          {
            key: "name",
            label: "Opportunity Name",
            type: "text" as const,
            required: true,
            colSpan: 1,
          },
          { key: "value", label: "Value", type: "text" as const, colSpan: 1 },
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
            colSpan: 1,
          },
          {
            key: "close_date",
            label: "Expected Close Date",
            type: "date" as const,
            colSpan: 1,
          },
          {
            key: "source",
            label: "Source",
            type: "text",
            colSpan: 1,
          },
          {
            key: "owner",
            label: "Owner",
            type: "text",
            colSpan: 1,
          },
          {
            key: "probability",
            label: "Probability",
            type: "text",
            colSpan: 1,
          },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (entityType != null && entityType !== undefined) {
      const formFields: any = getFormFields(entityType);
      setFormFieldList([...formFields]);
    }
  }, [entityType]);

  const handleFormSubmit = async () => {
    setIsFormLoading(true);
    try {
      // const response = await fetch(`/api/${entityType}/${id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(editData),
      // });
      const { _id, ...temp } = editData;
      const requestData = {
        schemaType: pluralize.singular(entityType),
        records: [{ ...temp, id: id }],
      };
      console.log("request:", requestData);
      const response = await apiClient.patch("/data/update", requestData)
      toast.success("Record Updated: ");
      // refetch();
    } catch (error: any) {
      // toast({
      //   title: "Error",
      //   description: error.message || "There was an error saving the record.",
      //   variant: "destructive",
      // });
      toast.error(`Error : ${error.message || "There was an error saving the record."}`)
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const requestData = {
        schemaType: pluralize.singular(entityType),
        recordIds: [editData._id],
      };
      console.log("delete:", requestData);
      // const response = await apiClient.delete("/data/delete", requestData);

      toast.success("Record Deleted!")

      navigate(`/page/${entityType}`);
    } catch (error: any) {
      toast.error(`Deleted Failed : ${error.message || "There was an error deleting the record."}`)
    } finally {
      setIsDeleting(false);
      setDeleteItem(null);
      setDeleteFormOpen(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCancel = () => {
    setEditData(recordData || {});
    localStorage.removeItem("SelectedRecord")
    navigate(`/page/${entityType}`)
  };

  const renderField = (field: any) => {
    console.log("key:", field.key)
    const value = editData[field.key];

    switch (field.type) {
      case "select":
        return (
          <Select
            value={value || ""}
            onValueChange={(val) => handleInputChange(field.key, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "date":
        const dateString = (new Date(value)).toISOString().split("T")[0] ?? ""
        return (
          <Input
            type="date"
            value={dateString}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        );
      default:
        return (
          <Input
            type={field.type}
            value={value || ""}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={`Enter ${field.label}`}
          />
        );
    }
  };

  if (dataLoading) {
    return (
      <main className="flex-1 max-w-full mx-auto px-2 sm:px-4 lg:px-4 xl:px-4 w-full">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </main>
    );
  }

  if (!editData) {
    return (
      <main className="flex-1 max-w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 w-full">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900">Record Not Found</h1>
          <p className="text-gray-600 mt-2">
            The requested record could not be found.
          </p>
        </div>
      </main>
    );
  }

  // const formFields = getFormFields();
  // useEffect(() => {
  //   console.log("FormFields Fetched");
  //   const formFields = getFormFields();
  //   // setFormFieldList([...formFields]);
  // }, []);

  const MoveFields = (fromIndex: number, toIndex: number, type: string) => {
    if (type == "text-field") {
      const updated = [...formFieldList];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setFormFieldList(updated);
    }
    else if (type == 'card') {
      const updated = [...sidebarCards];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setSidebarCards(updated);
    }
    else if (type == 'action-button') {
      const updated = [...buttonList];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setButonList(updated);
    }
    else if (type == 'container') {
      const updated = [...contentList];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setContentList(updated);
    }
    else if (type == 'form-button') {
      const updated = [...formButtonList];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setFormButtonList(updated);
    }
  };

  const displayCapitals = (str: string) => {
    return str[0].toUpperCase() + str.slice(1);
  }
  const handleBack = () => {
    localStorage.removeItem("SelectedRecord");
    navigate(`/page/${entityType}`)
  }

  return (
    <main className="flex-1 max-w-full mx-auto px-2 sm:px-4 lg:px-4 xl:px-4 w-full">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {displayCapitals(entityType)}
          </Button>
          {/* <h1 className="text-2xl font-bold">
                {recordData?.name || `${displayCapitals(entityType)} Details`}
              </h1> */}
          {/* <p className="text-gray-600 mt-1">
                    Edit {entityType.slice(0, -1)} information
                  </p> */}
        </div>
      </div>
      <div className="flex gap-6 flex-wrap lg:flex-nowrap">
        {contentList.map((content, index) => {
          switch (content.id) {
            case 1:
              {/* Main Content */ }
              return (<DraggableWrapper moveCard={MoveFields} index={index} key={content.id} id={content.id}
                contentType={content.type} dragType={dragType} setDragType={setDragType}
                className='flex-auto flex justify-center'
                isAdmin={isAdmin}
              >
                <div className="w-full sm:flex-1 container-header">

                  <Card>
                    <CardHeader>
                      <CardTitle>
                         {recordData?.name ||
                            `${displayCapitals(entityType)} Details`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {formFieldList.map((field, index) => (
                          <DraggableTextField moveBox={MoveFields}
                            index={index}
                            id={field.key} key={field.key}
                            isAdmin={isAdmin}
                          >
                            <div key={field.key} className="space-y-2">
                              <Label
                                htmlFor={field.key}
                                className="text-sm font-medium text-gray-700"
                              >
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </Label>
                              <div>{renderField(field)}</div>
                            </div>
                          </DraggableTextField>
                        ))}
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-6">
                        {formButtonList.map((formButton, index) => {
                          switch (formButton.id) {
                            case 1:
                              return (<DraggableWrapper moveCard={MoveFields} index={index} key={formButton.id}
                                id={formButton.id} contentType={formButton.type} dragType={dragType} setDragType={setDragType}
                                isAdmin={isAdmin}>
                                <Button
                                  className="flex items-center gap-2 sm:order-3"
                                  onClick={handleFormSubmit}
                                  disabled={isFormLoading}
                                  variant="save"
                                >
                                  <Save className="h-4 w-4" />
                                  {isFormLoading ? "Saving..." : "Save"}
                                </Button>
                              </DraggableWrapper>)
                            case 2:
                              return (<DraggableWrapper moveCard={MoveFields} index={index} key={formButton.id}
                                id={formButton.id} contentType={formButton.type} dragType={dragType}
                                setDragType={setDragType} isAdmin={isAdmin}>
                                <Button
                                  variant="cancel"
                                  className="flex items-center gap-2 sm:order-2"
                                  onClick={handleCancel}
                                  disabled={isFormLoading}
                                >
                                  <X className="h-4 w-4" />
                                  Cancel
                                </Button>
                              </DraggableWrapper>)
                            case 3:
                              return (<DraggableWrapper moveCard={MoveFields} index={index} key={formButton.id}
                                id={formButton.id} contentType={formButton.type} dragType={dragType}
                                setDragType={setDragType} isAdmin={isAdmin} >
                                <Button
                                  variant="delete"
                                  // className="flex items-center gap-2 text-red-600 hover:text-red-700 sm:order-1"
                                  onClick={() => setDeleteFormOpen(true)}
                                  disabled={isFormLoading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </Button>
                              </DraggableWrapper>)
                          }
                        })}



                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DraggableWrapper>)
            case 2: {/* Right Sidebar */ }
              return (<DraggableWrapper moveCard={MoveFields} index={index} key={content.id} id={content.id}
                dragType={dragType} setDragType={setDragType} contentType={content.type}
                className="w-full flex justify-center lg:w-auto" isAdmin={isAdmin}>
                <div className="flex flex-col w-full gap-4
                   md:flex md:flex-row md:gap-3  container-header
                   lg:flex-col lg:w-80">
                  {sidebarCards.map((card, index) => {
                    if (card.id == 1) {
                      {/* Total Spend Chart */ }
                      return (
                        <DraggableWrapper moveCard={MoveFields} index={index} key={card.id}
                          id={card.id} contentType={card.type}
                          dragType={dragType} setDragType={setDragType}
                          className="flex-1" isAdmin={isAdmin} >
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">Total Spend</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">Total Spend $</span>
                                  <span className="font-semibold">$245K</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span>Q1</span>
                                    <span>$60K</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: "60%" }}
                                    ></div>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span>Q2</span>
                                    <span>$85K</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: "85%" }}
                                    ></div>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span>Q3</span>
                                    <span>$100K</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: "100%" }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </DraggableWrapper>)
                    } else if (card.id == 2) {
                      return (<DraggableWrapper moveCard={MoveFields} index={index} key={card.id}
                        id={card.id} contentType={card.type}
                        dragType={dragType} setDragType={setDragType}
                        className="flex-1" isAdmin={isAdmin} >
                        {/* Quick Actions */}
                        <Card className="md:h-full lg:h-auto">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {buttonList.map((ActionButton, index) => {
                              switch (ActionButton.id) {
                                case 1:
                                  return (<DraggableWrapper moveCard={MoveFields} index={index} id={ActionButton.id}
                                    key={ActionButton.id} contentType={ActionButton.type}
                                    dragType={dragType} setDragType={setDragType} isAdmin={isAdmin} >
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start text-sm"
                                      onClick={() => navigate("/contacts")}
                                    >
                                      <User className="h-4 w-4 mr-2" />
                                      View Contacts
                                    </Button>
                                  </DraggableWrapper>)
                                case 2:
                                  return (<DraggableWrapper moveCard={MoveFields} index={index} id={ActionButton.id} key={ActionButton.id} contentType={ActionButton.type}
                                    dragType={dragType} setDragType={setDragType} isAdmin={isAdmin} >
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start text-sm"
                                      onClick={() => navigate("/opportunities")}
                                    >
                                      <div className="h-4 w-4 mr-2 rounded-full bg-green-500"></div>
                                      View Opportunities
                                    </Button>
                                  </DraggableWrapper>)
                                case 3:
                                  return (<DraggableWrapper moveCard={MoveFields} index={index} key={ActionButton.id} id={ActionButton.id} contentType={ActionButton.type}
                                    dragType={dragType} setDragType={setDragType} isAdmin={isAdmin} >
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start text-sm"
                                      onClick={() => navigate("/page/accounts")}
                                    >
                                      <div className="h-4 w-4 mr-2 rounded-sm bg-gray-500"></div>
                                      View Accounts
                                    </Button>
                                  </DraggableWrapper>)
                              }
                            })}
                          </CardContent>
                        </Card>
                      </DraggableWrapper>)
                    }
                  })}
                </div>
              </DraggableWrapper>)
          }
        })}




      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteFormOpen} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription className="text-black" >
              Are you sure you want to delete "{editData?.name || "this item"}
              "? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => setDeleteFormOpen(false)} >Cancel</AlertDialogCancel>
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
    </main>
  );
}