import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronRight,
  BarChart3,
  Table as TableIcon,
  Download,
  Filter,
  Printer,
  Menu,
  ArrowLeft,
  Folder,
  FileText,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DraggableWrapper from "@/components/details/DraggableWrapper";
import { fetchTableData } from "@/api";
import { useQuery } from "@tanstack/react-query";
import SalesChart from "@/components/reports/SalesChart";
import { useSelector } from "react-redux";
import { RootState } from "@/types/store.type";

// Types
interface ReportConfig {
  id: string;
  name: string;
  type: "table" | "chart";
  chartType?: "line" | "bar" | "pie";
  columns?: Array<{
    key: string;
    label: string;
    sortable?: boolean;
  }>;
  actions?: Array<{
    label: string;
    icon: string;
    action: string;
  }>;
  exportEnabled?: boolean;
  printEnabled?: boolean;
  filterEnabled?: boolean;
}

interface FolderConfig {
  id: string;
  name: string;
  icon: string;
  reports: ReportConfig[];
  isOpen?: boolean;
}

interface ReportData {
  data: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

// Mock API data - in real app this would come from API calls
const mockFoldersData: FolderConfig[] = [
  {
    id: "dept-reports",
    name: "Departmental Reports",
    icon: "folder",
    reports: [
      {
        id: "revenue-report",
        name: "Revenue Report",
        type: "table",
        columns: [
          { key: "department", label: "Department", sortable: true },
          { key: "phoneNumber", label: "Phone Number", sortable: false },
          { key: "totalRevenue", label: "Total Revenue", sortable: true },
          { key: "departmentHead", label: "Department Head", sortable: false },
          { key: "reportDate", label: "Report Date", sortable: true },
        ],
        actions: [
          { label: "Export", icon: "download", action: "export" },
          { label: "Print", icon: "printer", action: "print" },
          { label: "Filter", icon: "filter", action: "filter" },
        ],
        exportEnabled: true,
        printEnabled: true,
        filterEnabled: true,
      },
      {
        id: "performance-chart",
        name: "Performance Chart",
        type: "chart",
        chartType: "line",
        actions: [
          { label: "Export", icon: "download", action: "export" },
          { label: "Print", icon: "printer", action: "print" },
        ],
        exportEnabled: true,
        printEnabled: true,
      },
    ],
    isOpen: true,
  },
  {
    id: "financial",
    name: "Financial Reports",
    icon: "folder",
    reports: [
      {
        id: "budget-analysis",
        name: "Budget Analysis",
        type: "chart",
        chartType: "bar",
        actions: [
          { label: "Export", icon: "download", action: "export" },
          { label: "Filter", icon: "filter", action: "filter" },
        ],
        exportEnabled: true,
        filterEnabled: true,
      },
      {
        id: "growth-analysis",
        name: "Growth Analysis",
        type: "chart",
        chartType: "line",
        actions: [
          { label: "Export", icon: "download", action: "export" },
          { label: "Filter", icon: "filter", action: "filter" },
        ],
        exportEnabled: true,
        filterEnabled: true,
      },
    ],
  },
  {
    id: "hr-reports",
    name: "HR Reports",
    icon: "folder",
    reports: [
      {
        id: "employee-stats",
        name: "Employee Statistics",
        type: "chart",
        chartType: "pie",
        actions: [
          { label: "Export", icon: "download", action: "export" },
          { label: "Print", icon: "printer", action: "print" },
        ],
        exportEnabled: true,
        printEnabled: true,
      },
    ],
  },
  {
    id: "sales-reports",
    name: "Sales Reports",
    icon: "folder",
    reports: [
      {
        id: "monthly-sales",
        name: "Monthly Sales",
        type: "table",
        columns: [
          { key: "month", label: "Month", sortable: true },
          { key: "sales", label: "Sales", sortable: true },

        ],
        actions: [
          { label: "Export", icon: "download", action: "export" },
          { label: "Print", icon: "printer", action: "print" },
        ],
        exportEnabled: true,
        printEnabled: true,
      },
    ],
  },
];

const mockReportData: { [key: string]: any[] } = {
  "revenue-report": [
    {
      department: "Sales",
      phoneNumber: "(225) 555-0118",
      totalRevenue: 77000,
      departmentHead: "John Carter",
      reportDate: "25-01-2025",
    },
    {
      department: "Marketing",
      phoneNumber: "(205) 555-0100",
      totalRevenue: 85000,
      departmentHead: "Sarah Lee",
      reportDate: "29-01-2025",
    },
    {
      department: "R&D",
      phoneNumber: "(302) 555-0107",
      totalRevenue: 99000,
      departmentHead: "Mike Thomas",
      reportDate: "09-02-2025",
    },
    {
      department: "Customer Success",
      phoneNumber: "(952) 555-0126",
      totalRevenue: 53000,
      departmentHead: "Lisa Wong",
      reportDate: "23-02-2025",
    },
    {
      department: "IT",
      phoneNumber: "(629) 555-0129",
      totalRevenue: 70000,
      departmentHead: "Robert Smith",
      reportDate: "26-02-2025",
    },
    {
      department: "HR",
      phoneNumber: "(406) 555-0120",
      totalRevenue: 130000,
      departmentHead: "Karen Patel",
      reportDate: "08-03-2025",
    },
    {
      department: "Operations",
      phoneNumber: "(208) 555-0112",
      totalRevenue: 58000,
      departmentHead: "Daniel White",
      reportDate: "15-03-2025",
    },
    {
      department: "Finance",
      phoneNumber: "(704) 555-0127",
      totalRevenue: 135000,
      departmentHead: "Emily Davis",
      reportDate: "23-04-2025",
    },
    {
      department: "Legal",
      phoneNumber: "(555) 555-0130",
      totalRevenue: 45000,
      departmentHead: "Alex Johnson",
      reportDate: "10-04-2025",
    },
    {
      department: "Procurement",
      phoneNumber: "(555) 555-0131",
      totalRevenue: 62000,
      departmentHead: "Maria Garcia",
      reportDate: "18-04-2025",
    },
    {
      department: "Quality",
      phoneNumber: "(555) 555-0132",
      totalRevenue: 55000,
      departmentHead: "David Lee",
      reportDate: "25-04-2025",
    },
    {
      department: "Logistics",
      phoneNumber: "(555) 555-0133",
      totalRevenue: 73000,
      departmentHead: "Jennifer Wu",
      reportDate: "02-05-2025",
    },
  ],
  "monthly-sales": [
    { month: "January", sales: 125000, target: 120000, achievement: 104.2 },
    { month: "February", sales: 142000, target: 135000, achievement: 105.2 },
    { month: "March", sales: 118000, target: 130000, achievement: 90.8 },
    { month: "April", sales: 156000, target: 140000, achievement: 111.4 },
    { month: "May", sales: 167000, target: 150000, achievement: 111.3 },
    { month: "June", sales: 189000, target: 160000, achievement: 118.1 },
  ],
};

export default function ReportsPage() {
  const userData = useSelector((state: RootState) => state.user)

  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [isMaximized, setIsMaximized] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportConfig | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [foldersData, setFoldersData] = useState<FolderConfig[]>(mockFoldersData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [reportData, setReportData] = useState<any[]>([]);
  const [containerList, setContainerList] = useState<{ id: number; type: string }[]>([
    { id: 1, type: "container-2" },
    { id: 2, type: "container-2" },
  ]);
  const [actionList, setActionist] = useState<
    {
      id: number;
      type: string;
      label: string;
      icon: string;
      action: string;
    }[]
  >([]);
  // const [folderList,setFolderList] = useState([]);
  const [dragType, setDragType] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    setIsAdmin(userData.user.roles.includes("admin"))
  }, [])

  // Initialize with first report
  useEffect(() => {
    if (foldersData.length > 0 && foldersData[0].reports.length > 0) {
      const firstReport = foldersData[0].reports[0];
      setSelectedReport(firstReport);
      setSelectedFolder(foldersData[0].id);
      setViewMode(firstReport.type);
      loadReportData(firstReport.id);
    }
  }, []);

  useEffect(() => {
    const tempList =
      selectedReport?.actions?.map((action, index) => {
        return { ...action, id: index, type: "action" };
      }) || [];
    setActionist([...tempList]);
  }, [selectedReport]);

  const MoveFields = (fromIndex: number, toIndex: number, type: string) => {
    if (type == "action") {
      const updated = [...actionList];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setActionist(updated);
    }
    if (type == "folder") {
      const updated = [...foldersData];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setFoldersData(updated);
    }
    if (type == "container-2") {
      const updated = [...containerList];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setContainerList(updated);
    }
  };

  const { data: salesData, isLoading: pageLoading } = useQuery({
    queryKey: ["/data/view", "sales_chart"],
    queryFn: () => fetchTableData("sales_chart"),
  });
  const { data: growthData, isLoading: chartLoading } = useQuery({
    queryKey: ["/data/view", "growth_chart"],
    queryFn: () => fetchTableData("growth_chart"),
  });

  const loadReportData = (reportId: string) => {
    var data = []
    if (reportId == "monthly-sales") {
      data = salesData.data.map((item:any) => { return { month: item.month, sales: item.revenue } });
    } else {
      data = mockReportData[reportId] || [];
    }
    console.log("report ", data);
    setReportData(data);
    setCurrentPage(1);
  };



  const handleReportSelect = (report: ReportConfig, folderId: string) => {
    setSelectedReport(report);
    setSelectedFolder(folderId);
    setViewMode(report.type);
    loadReportData(report.id);
  };

  const handleFolderToggle = (folderId: string) => {
    setFoldersData((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, isOpen: !folder.isOpen } : folder
      )
    );
  };

  const handleExport = () => {
    if (!selectedReport || !reportData.length) return;

    let dataToExport = reportData;
    if (selectedReport.type === "table") {
      // For table view, use pagination
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      dataToExport = reportData.slice(startIndex, endIndex);
    }

    const csvContent = convertToCSV(dataToExport);
    downloadCSV(
      csvContent,
      `${selectedReport.name.replace(/\s+/g, "_")}_export.csv`
    );
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return "";

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(",");

    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
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

  const handlePrint = () => {
    window.print();
  };

  const handleFilter = () => {
    console.log("Opening filters...");
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized && selectedReport?.type === "chart") {
      setViewMode("chart");
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Pagination logic
  const totalItems = reportData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = reportData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1);
  };

  const getChartData = () => {
    if (selectedReport?.id == "monthly-sales") {
      return salesData.data;
    }
    if (selectedReport?.id == "growth-analysis") {
      console.log("growthData:", growthData);
      return growthData.data;
    }
    if (
      selectedReport?.id === "revenue-report" ||
      selectedReport?.id === "performance-chart"
    ) {
      return reportData.map((item) => ({
        name: item.department,
        revenue: item.totalRevenue,
      }));
    }
    if (selectedReport?.id === "budget-analysis") {
      return [
        { name: "Q1", budget: 150000, actual: 142000 },
        { name: "Q2", budget: 180000, actual: 165000 },
        { name: "Q3", budget: 200000, actual: 195000 },
        { name: "Q4", budget: 220000, actual: 210000 },
      ];
    }
    if (selectedReport?.id === "employee-stats") {
      return [
        { name: "Full-time", value: 65, color: "#0088FE" },
        { name: "Part-time", value: 25, color: "#00C49F" },
        { name: "Contract", value: 10, color: "#FFBB28" },
      ];
    }
    return reportData;
  };
  const renderChart = () => {
    const chartData = getChartData();
    console.log("Selected Report:", selectedReport);
    if (selectedReport?.id == "monthly-sales") {
      return (<SalesChart chartData={chartData} chartId={selectedReport.id} />)
    }
    else if (selectedReport?.id == "growth-analysis") {
      return (<SalesChart chartData={chartData} chartId={selectedReport.id} />)
    }
    else if (
      selectedReport?.chartType === "bar" ||
      selectedReport?.id === "budget-analysis"
    ) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: any, name: string) => [
                `$${value.toLocaleString()}`,
                name,
              ]}
            />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (
      selectedReport?.chartType === "pie" ||
      selectedReport?.id === "employee-stats"
    ) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.color ||
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`
                  }
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    // Default line chart
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value: any) => [
              `$${value.toLocaleString()}`,
              "Revenue",
            ]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: "#2563eb", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  const SidebarContent = () => (
    <div>
      {/* Sidebar Header */}
      <div
        className={`p-4 flex items-center justify-between 
        ${containerList[0].id == 2 ? "flex-row-reverse" : "flex-row"}`}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reports</h2>
        {/* Hamburger Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
        // className="lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Sidebar toggle for desktop */}
        {sidebarCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
          // className="hidden lg:flex"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Folders Cards */}
      <div className="p-4 space-y-3">
        {foldersData.map((folder, index) => (
          <DraggableWrapper
            key={folder.id}
            id={folder.id}
            index={index}
            contentType="folder"
            dragType={dragType}
            setDragType={setDragType}
            moveCard={MoveFields}
            isAdmin={isAdmin}
          >
            <Card key={folder.id}>
              <Collapsible open={folder.isOpen}>
                <CollapsibleTrigger
                  className="flex items-center justify-between w-full p-4 text-left text-gray-500 hover:bg-gray-50 dark:text-white hover:dark:text-black rounded-md transition-colors "
                  onClick={() => handleFolderToggle(folder.id)}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {folder.name}
                    </span>
                  </div>
                  {folder.isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4 pt-2">
                  <div className="ml-6 space-y-1">
                    {folder.reports.map((report) => (
                      <div
                        key={report.id}
                        className={`py-2 px-3 rounded-md cursor-pointer transition-colors text-sm ${
                          selectedReport?.id === report.id
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "text-gray-600 hover:bg-gray-50 hover:dark:text-black dark:text-white"
                        }`}
                        onClick={() => handleReportSelect(report, folder.id)}
                      >
                        {report.name}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </DraggableWrapper>
        ))}
      </div>
    </div>
  );

  if (isMaximized) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="p-4 border-b bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={toggleMaximize}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Folder className="h-4 w-4 text-gray-500 dark:text-white" />
              <h1 className="text-lg font-semibold">
                {foldersData.find((f) => f.id === selectedFolder)?.name} /{" "}
                {selectedReport?.name}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              {selectedReport?.actions?.map((action) => (
                <Button
                  key={action.action}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (action.action === "export") handleExport();
                    if (action.action === "print") handlePrint();
                    if (action.action === "filter") handleFilter();
                  }}
                >
                  {action.icon === "download" && (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {action.icon === "printer" && (
                    <Printer className="h-4 w-4 mr-2" />
                  )}
                  {action.icon === "filter" && (
                    <Printer className="h-4 w-4 mr-2" />
                  )}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {viewMode === "chart" ? (
            <div className="h-full">{renderChart()}</div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedReport?.columns?.map((column) => (
                      <TableHead key={column.key}>
                        {column.label}
                        {column.sortable && (
                          <ChevronDown className="ml-1 h-3 w-3 inline" />
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageData.map((item, index) => (
                    <TableRow key={index}>
                      {selectedReport?.columns?.map((column) => (
                        <TableCell
                          key={column.key}
                          className={
                            column.key === selectedReport?.columns?.[0]?.key
                              ? "font-medium"
                              : ""
                          }
                        >
                          {column.key === "totalRevenue" ||
                            column.key === "sales" ||
                            column.key === "target"
                            ? `$${item[column.key]?.toLocaleString()}`
                            : item[column.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, totalItems)} of {totalItems} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">
                        Records per page:
                      </span>
                      <Select
                        value={pageSize.toString()}
                        onValueChange={handlePageSizeChange}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#E8E8E8] dark:bg-[#081028] text-primary-foreground">
      {/* Sidebar - Now properly toggleable */}
      {containerList.map((container, index) => {
        if (container.id == 1) {
          return (
            <React.Fragment key={container.id}>
              <DraggableWrapper
                id={container.id}
                moveCard={MoveFields}
                index={index}
                contentType={container.type}
                dragType={dragType}
                setDragType={setDragType}
                isAdmin={isAdmin}
              >
                {!sidebarCollapsed && (
                  <div className="fixed rounded-e-xl lg:relative z-30 h-full w-4/5 max-w-xs lg:w-64 bg-white dark:bg-[#081028] shadow-lg lg:shadow-none transition-all duration-300">
                    <SidebarContent />
                  </div>
                )}
                {/* Overlay for mobile */}
                {!sidebarCollapsed && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
                    onClick={toggleSidebar}
                  />
                )}
                {sidebarCollapsed && (
                  <div className="py-2 flex justify-start lg:justify-end">
                    <button
                      onClick={toggleSidebar}
                      className="border-solid border-border border-2 p-1 rounded-e-md bg-secondary"
                    >
                      {containerList[0].id == 2 ? (
                        <ChevronLeft />
                      ) : (
                        <ChevronRight />
                      )}
                    </button>
                  </div>
                )}
              </DraggableWrapper>
            </React.Fragment>
          );
        } else if (container.id == 2) {
          // Main Content
          return (
            <DraggableWrapper
              id={container.id}
              moveCard={MoveFields}
              index={index}
              contentType={container.type}
              dragType={dragType}
              setDragType={setDragType}
              className="flex-1"
              isAdmin={isAdmin}
            >
              <div
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 w-full ${sidebarCollapsed ? "ml-0" : "ml-0"
                  }`}
              >
                {/* Content Area */}
                <div className="flex-1 px-2 sm:px-4 md:px-6 py-2 overflow-auto pt-0 w-full">
                  <Card className="shadow-sm p-1 sm:p-2 w-full max-w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b p-2 gap-2 sm:gap-0">
                      <div className="flex flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                        <Folder className="h-6 w-6 mr-2 text-gray-500 dark:text-white" />
                        <h1 className="text-base sm:text-lg text-wrap font-semibold text-gray-900 dark:text-white max-w-xs sm:max-w-none">
                          {
                            foldersData.find((f) => f.id === selectedFolder)?.name
                          }{" "}
                          / {selectedReport?.name}
                        </h1>
                      </div>
                      <div className="flex flex-wrap sm:flex-nowrap items-center">
                        {actionList.map((action, index) => (
                          <DraggableWrapper
                            key={action.id}
                            moveCard={MoveFields}
                            index={index}
                            id={action.id}
                            dragType={dragType}
                            setDragType={setDragType}
                            contentType={action.type}
                            isAdmin={isAdmin}
                            className="m-0 px-1"
                          >
                            <Button
                              key={action.action}
                              variant="outline"
                              size="sm"
                              className="bg-white dark:bg-[#081028] mb-1"
                              onClick={() => {
                                if (action.action === "export") handleExport();
                                if (action.action === "print") handlePrint();
                                if (action.action === "filter") handleFilter();
                              }}
                            >
                              {action.icon === "download" && (
                                <Download className="h-4 w-4 mr-2" />
                              )}
                              {action.icon === "printer" && (
                                <Printer className="h-4 w-4 mr-2" />
                              )}
                              {action.icon === "filter" && (
                                <Filter className="h-4 w-4 mr-2" />
                              )}
                              {action.label}
                            </Button>
                          </DraggableWrapper>
                        ))}
                        <Separator orientation="vertical" className="h-6 hidden mr-1 sm:block" />
                        <div className="flex rounded-lg mt-2 sm:mt-0">
                          <Button
                            variant={viewMode === "table" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("table")}
                            className="h-8 border-border border-[0.5px] border-solid rounded-none rounded-l-lg bg-white dark:bg-[#081028] dark:text-white"
                          >
                            <TableIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={viewMode === "chart" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("chart")}
                            className="h-8 border-border border-[0.5px] border-solid rounded-none rounded-r-lg dark:bg-[#081028] dark:text-white"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {viewMode === "table" ? (
                      <CardContent className="p-2 sm:p-4 w-full max-w-full">
                        <div className="w-full overflow-x-auto max-h-[60vh] overflow-y-auto">
                          <Table className="min-w-[400px] w-full">
                            <TableHeader className="sticky top-0 z-20 bg-white dark:bg-[#0B1739]">
                              <TableRow className="border-b ">
                                {selectedReport?.type === "table" &&
                                  selectedReport?.columns?.map((column) => (
                                    <TableHead
                                      key={column.key}
                                      className="font-semibold text-gray-900 py-3 dark:text-white whitespace-nowrap"
                                    >
                                      {column.label}
                                      {column.sortable && (
                                        <ChevronDown className="ml-1 h-3 w-3 inline" />
                                      )}
                                    </TableHead>
                                  ))}
                                {selectedReport?.type === "chart" && (
                                  <>
                                    <TableHead className="font-semibold text-gray-900 py-3 dark:text-white">
                                      Name
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-3 dark:text-white">
                                      Value
                                    </TableHead>
                                  </>
                                )}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedReport?.type === "table" &&
                                currentPageData.map((item, index) => (
                                  <TableRow key={index} className="text-xs sm:text-sm">
                                    {selectedReport?.columns?.map((column) => (
                                      <TableCell
                                        key={column.key}
                                        className={
                                          column.key ===
                                            selectedReport?.columns?.[0]?.key
                                            ? "font-medium"
                                            : ""
                                        }
                                      >
                                        {column.key === "totalRevenue" ||
                                          column.key === "sales" ||
                                          column.key === "target"
                                          ? `$${item[
                                            column.key
                                          ]?.toLocaleString()}`
                                          : item[column.key]}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              {selectedReport?.type === "chart" &&
                                getChartData().map((item:any, index:any) => (
                                  <TableRow key={index} className="text-xs sm:text-sm">
                                    <TableCell className="font-medium">
                                      {item.name}
                                    </TableCell>
                                    <TableCell>
                                      {item.revenue &&
                                        `$${item.revenue.toLocaleString()}`}
                                      {item.budget &&
                                        `Budget: $${item.budget.toLocaleString()}, Actual: $${item.actual.toLocaleString()}`}
                                      {item.value && `${item.value}%`}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                        {/* Enhanced Pagination - only for table type reports */}
                        {selectedReport?.type === "table" && totalPages > 0 && (
                          <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 border-t gap-2 sm:gap-0">
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                              <div className="text-xs sm:text-sm text-gray-500 dark:text-white">
                                Showing {startIndex + 1} to{" "}
                                {Math.min(endIndex, totalItems)} of {totalItems}{" "}
                                results
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs sm:text-sm text-gray-700 dark:text-white ">
                                  Records per page:
                                </span>
                                <Select
                                  value={pageSize.toString()}
                                  onValueChange={handlePageSizeChange}
                                >
                                  <SelectTrigger className="w-16 sm:w-20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                              >
                                <ChevronLeft className="h-4 w-4 dark:text-white" />
                              </Button>
                              {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                              ).map((page) => (
                                <Button
                                  key={page}
                                  variant={
                                    currentPage === page ? "default" : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(page)}
                                  className="dark:text-white"
                                >
                                  {page}
                                </Button>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                              >
                                <ChevronRightIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    ) : (
                      <CardContent className="p-2 sm:p-6 w-full max-w-full">
                        <div className="h-64 sm:h-96 w-full max-w-full min-w-0">
                          {renderChart()}
                        </div>
                        <div className="mt-4 text-center">
                          <Badge variant="outline" className="text-blue-600">
                            2025
                          </Badge>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              </div>
            </DraggableWrapper>
          );
        }
      })}
    </div>
  );
}
