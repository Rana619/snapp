import { apiClient } from "@/lib/apiClient";
import { apiRequest } from "@/lib/queryClient";
import type { LayoutConfig, PageConfig } from "@/types";

const SALESFORCE_BASE_URL =
  "https://17grapes--snpp.sandbox.my.salesforce-sites.com/snpptest/services/apexrest/SnTesting";

// For now using empty Bearer token as per your requirement
const getAuthHeaders = () => ({
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTAxMDMzMD",
  "Content-Type": "application/json",
  Accept: "application/json",
});

export async function fetchLayout(): Promise<LayoutConfig> {
  const response: any = await apiClient.get("/meta/layout");

  if (!response?.header) {
    throw new Error("Failed to fetch layout: Invalid response structure");
  }

  if (!response.header || !response.footer || !response.theme) {
    console.error("Invalid layout structure. Missing required fields:", {
      hasHeader: !!response.header,
      hasFooter: !!response.footer,
      hasTheme: !!response.theme,
    });
    throw new Error("Invalid layout structure");
  }

  return response;
}

export async function fetchPageConfigNew(slug: string): Promise<PageConfig> {
  const response: any = await apiClient.get(`/meta/page/${slug}`);

  const pageConfigData: PageConfig = {
    title: response.title,
    layout: response.layout,
    grid: {
      columns: 12,
      rowHeight: 350,
    },
    widgets: response.components.map((s: any, index: number) => {
      return {
        type: s.type,
        id: s.id,
        dataKey: s?.dataKey,
        xl: {
          size: {
            width: 4,
            height: 1,
          },
          position: {
            row: 0,
            col: 0,
          },
        },
      };
    }),
  };

  return pageConfigData;
}

export async function getWidgetData(dataKey: string): Promise<any> {
  try {
    if (dataKey == null || dataKey == undefined || dataKey == "") {
      return [];
    }

    console.log("Fetching widget data for:", dataKey);
    const response: any = await apiClient.get(`/data/view/${dataKey}`);

    return response;
  } catch (error) {
    console.error("Error fetching widget data:", error);
    return [];
  }
}

export async function fetchPageConfig(slug: string): Promise<PageConfig> {
  const response = await fetch(`${SALESFORCE_BASE_URL}/page-config/${slug}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page config: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`Salesforce Page Config Response for ${slug}:`, data);

  // Validate that we have the required structure
  if (!data.title || !data.layout || !data.widgets) {
    throw new Error(
      `Invalid page config structure from Salesforce for ${slug}`
    );
  }

  return data;
}

export async function fetchWidgetData(
  keys: string[],
  isDashboard = false
): Promise<Record<string, any>> {
  const params = new URLSearchParams({
    keys: keys.join(","),
    ...(isDashboard && { dashboard: "true" }),
  });
  return apiClient.get(`/widget-data?${params}`);
}

export async function fetchTableData(slug: string): Promise<any> {
  try {
    const response: any = await apiClient.get(`/data/view/${slug}`);

    const TableData: any = {
      pagination: {
        page: response.meta.page,
        pageSize: response.meta.pageSize,
        total: response.meta.totalRecords,
      },
      data: response.records,
    };
    return TableData;
  } catch (error) {
    console.error("Error fetching page config from Salesforce:", error);
  }
}
