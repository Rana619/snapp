interface ListingColumn {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  type?: string;
  editable: boolean;
}
interface ListingConfig {
    id:number;
    slug:string;
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

export const staticListingConfig:any={
    "accounts" :{   "id": 2,
    "slug": "accounts",
    "title": "Accounts",
    "layout": {
        "type": "table",
        "columns": 1,
        "gutter": 16
    },
    "dataKey": "accounts",
    "actions": {
        "toolbar": [
            {
                "label": "Add Account",
                "action": "add",
                "icon": "plus",
                "route": "/accounts/new"
            },
            {
                "label": "Export",
                "action": "export",
                "icon": "download",
                "route": "/api/accounts/export"
            }
        ],
        "bulk": [
            {
                "label": "Bulk Edit",
                "action": "bulk_edit",
                "route": "/api/accounts/bulkedit"
            },
            {
                "label": "Delete Selected",
                "action": "bulk_delete",
                "confirm": true,
                "route": "/api/accounts/deleteselected"
            }
        ],
        "row": [
            {
                "label": "View",
                "action": "view",
                "icon": "eye",
                "route": "/accounts/view/:id"
            },
            {
                "label": "Edit",
                "action": "edit",
                "icon": "edit",
                "route": "/accounts/edit/:id"
            },
            {
                "label": "Delete",
                "action": "delete",
                "icon": "trash",
                "confirm": true,
                "route": "/accounts/delete/:id"
            }
        ]
    },
    "filters": {
        "type": {
            "type": "dropdown",
            "options": [
                "Customer",
                "Partner",
                "Reseller",
                "Prospect"
            ]
        },
        "status": {
            "type": "dropdown",
            "options": [
                "Active",
                "Prospect",
                "Inactive"
            ]
        },
        "createdRange": {
            "type": "daterange",
            "label": "Created Date Range"
        }
    },
    "columns": [
        {
            "key": "name",
            "label": "Account Name",
            "sortable": true,
            "searchable": true,
            "editable": true
        },
        {
            "key": "phone",
            "label": "Phone Number",
            "sortable": false,
            "editable": true
        },
        {
            "key": "email",
            "label": "Email",
            "sortable": true,
            "searchable": true,
            "editable": true
        },
        {
            "key": "type",
            "label": "Account Type",
            "sortable": true,
            "editable": true
        },
        {
            "key": "owner",
            "label": "Owner",
            "sortable": true,
            "editable": true
        },
        {
            "key": "createdAt",
            "label": "Created Date",
            "sortable": true,
            "editable": false
        },
        {
            "key": "billingStreet",
            "label": "Billing Street",
            "sortable": false,
            "editable": true
        },
        {
            "key": "billingCity",
            "label": "Billing City",
            "sortable": false,
            "editable": true
        },
        {
            "key": "status",
            "label": "Status",
            "sortable": true,
            "editable": false
        },
        {
            "key": "id",
            "label": "Account ID",
            "sortable": false,
            "editable": false
        },
        {
            "key": "actions",
            "label": "Actions",
            "type": "actions",
            "editable": false
        }
    ],
    "pagination": {
        "enabled": true,
        "defaultPageSize": 10
    },
    "searchEnabled": true,
    "selectionEnabled": true} as ListingConfig,
    "opportunities":{  "id": 2,
    "slug": "opportunity",
    "title": "Opportunities",
    "layout": {
        "type": "table",
        "columns": 1,
        "gutter": 16
    },
    "dataKey": "accounts",
    "actions": {
        "toolbar": [
            {
                "label": "Add Opportunity",
                "action": "add",
                "icon": "plus",
                "route": "/opportunities/new"
            },
            {
                "label": "Export",
                "action": "export",
                "icon": "download",
                "route": "/api/accounts/export"
            }
        ],
        "bulk": [
            {
                "label": "Bulk Edit",
                "action": "bulk_edit",
                "route": "/api/accounts/bulkedit"
            },
            {
                "label": "Delete Selected",
                "action": "bulk_delete",
                "confirm": true,
                "route": "/api/accounts/deleteselected"
            }
        ],
        "row": [
            {
                "label": "View",
                "action": "view",
                "icon": "eye",
                "route": "/opportunities/view/:id"
            },
            {
                "label": "Edit",
                "action": "edit",
                "icon": "edit",
                "route": "/opportunities/edit/:id"
            },
            {
                "label": "Delete",
                "action": "delete",
                "icon": "trash",
                "confirm": true,
                "route": "/opportunities/delete/:id"
            }
        ]
    },
    "filters": {
        "type": {
            "type": "dropdown",
            "options": [
                "Customer",
                "Partner",
                "Reseller",
                "Prospect"
            ]
        },
        "status": {
            "type": "dropdown",
            "options": [
                "Active",
                "Prospect",
                "Inactive"
            ]
        },
        "createdRange": {
            "type": "daterange",
            "label": "Created Date Range"
        }
    },
    "columns": [
        {
            "key": "name",
            "label": "Opportunity Name",
            "sortable": true,
            "searchable": true,
            "editable": true
        },
        {
            "key": "close_date",
            "label": "Close Date",
            "sortable": false,
            "editable": true
        },
        {
            "key": "owner",
            "label": "Owner",
            "sortable": true,
            "searchable": true,
            "editable": true
        },
        {
            "key": "source",
            "label": "Source",
            "sortable": true,
            "editable": true
        },
        {
            "key": "probability",
            "label": "Probabilty",
            "sortable": true,
            "editable": false
        },
        {
            "key": "stage",
            "label": "Stage",
            "sortable": false,
            "editable": true
        },
        {
            "key": "value",
            "label": "Value",
            "sortable": false,
            "editable": true
        },

        {
            "key": "_id",
            "label": "Account ID",
            "sortable": false,
            "editable": false
        },
        {
            "key": "actions",
            "label": "Actions",
            "type": "actions",
            "editable": false
        }
    ],
    "pagination": {
        "enabled": true,
        "defaultPageSize": 10
    },
    "searchEnabled": true,
    "selectionEnabled": true} as ListingConfig,
}
// export const staticListingConfig:ListingConfig = {   "id": 2,
//     "slug": "accounts",
//     "title": "Accounts",
//     "layout": {
//         "type": "table",
//         "columns": 1,
//         "gutter": 16
//     },
//     "dataKey": "accounts",
//     "actions": {
//         "toolbar": [
//             {
//                 "label": "Add Account",
//                 "action": "add",
//                 "icon": "plus",
//                 "route": "/accounts/new"
//             },
//             {
//                 "label": "Export",
//                 "action": "export",
//                 "icon": "download",
//                 "route": "/api/accounts/export"
//             }
//         ],
//         "bulk": [
//             {
//                 "label": "Bulk Edit",
//                 "action": "bulk_edit",
//                 "route": "/api/accounts/bulkedit"
//             },
//             {
//                 "label": "Delete Selected",
//                 "action": "bulk_delete",
//                 "confirm": true,
//                 "route": "/api/accounts/deleteselected"
//             }
//         ],
//         "row": [
//             {
//                 "label": "View",
//                 "action": "view",
//                 "icon": "eye",
//                 "route": "/accounts/view/:id"
//             },
//             {
//                 "label": "Edit",
//                 "action": "edit",
//                 "icon": "edit",
//                 "route": "/accounts/edit/:id"
//             },
//             {
//                 "label": "Delete",
//                 "action": "delete",
//                 "icon": "trash",
//                 "confirm": true,
//                 "route": "/accounts/delete/:id"
//             }
//         ]
//     },
//     "filters": {
//         "type": {
//             "type": "dropdown",
//             "options": [
//                 "Customer",
//                 "Partner",
//                 "Reseller",
//                 "Prospect"
//             ]
//         },
//         "status": {
//             "type": "dropdown",
//             "options": [
//                 "Active",
//                 "Prospect",
//                 "Inactive"
//             ]
//         },
//         "createdRange": {
//             "type": "daterange",
//             "label": "Created Date Range"
//         }
//     },
//     "columns": [
//         {
//             "key": "name",
//             "label": "Account Name",
//             "sortable": true,
//             "searchable": true,
//             "editable": true
//         },
//         {
//             "key": "phone",
//             "label": "Phone Number",
//             "sortable": false,
//             "editable": true
//         },
//         {
//             "key": "email",
//             "label": "Email",
//             "sortable": true,
//             "searchable": true,
//             "editable": true
//         },
//         {
//             "key": "type",
//             "label": "Account Type",
//             "sortable": true,
//             "editable": true
//         },
//         {
//             "key": "owner",
//             "label": "Owner",
//             "sortable": true,
//             "editable": true
//         },
//         {
//             "key": "createdAt",
//             "label": "Created Date",
//             "sortable": true,
//             "editable": false
//         },
//         {
//             "key": "billingStreet",
//             "label": "Billing Street",
//             "sortable": false,
//             "editable": true
//         },
//         {
//             "key": "billingCity",
//             "label": "Billing City",
//             "sortable": false,
//             "editable": true
//         },
//         {
//             "key": "status",
//             "label": "Status",
//             "sortable": true,
//             "editable": false
//         },
//         {
//             "key": "id",
//             "label": "Account ID",
//             "sortable": false,
//             "editable": false
//         },
//         {
//             "key": "actions",
//             "label": "Actions",
//             "type": "actions",
//             "editable": false
//         }
//     ],
//     "pagination": {
//         "enabled": true,
//         "defaultPageSize": 10
//     },
//     "searchEnabled": true,
//     "selectionEnabled": true
// }
