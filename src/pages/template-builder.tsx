import React, { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Save,
  FileText,
  BarChart3,
  Image as ImageIcon,
  Type,
  Grid3X3,
  Plus,
  Trash2,
  Edit,
  AlignLeft,
  Calculator,
  Calendar,
  X,
  Printer,
  Monitor,
  ScanLine,
  Upload,
  Book,
  BookOpen,
  Bold,
  Italic,
  Underline,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Palette,
  FontSize,
  Highlighter,
  Strikethrough,
  Subscript,
  Superscript,
  IndentIncrease,
  IndentDecrease,
  Copy,
  Clipboard,
  Undo,
  Redo,
  Search,
  Replace,
} from "lucide-react";

interface ComponentItem {
  id: string;
  type: string;
  name: string;
  icon: React.ReactNode;
}

interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  color: string;
  backgroundColor: string;
  textAlign: string;
  lineHeight: number;
  letterSpacing: number;
  textTransform: string;
  textShadow: string;
  listStyle: string;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
}

interface DroppedComponent {
  id: string;
  type: string;
  content: any;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  style?: Partial<TextStyle>;
}

interface TemplateData {
  title: string;
  components: DroppedComponent[];
  pages: number;
}

// Static component data - no API calls needed
const COMPONENT_TYPES: ComponentItem[] = [
  {
    id: "text",
    type: "text",
    name: "Text Component",
    icon: <Type className="w-4 h-4" />,
  },
  {
    id: "description",
    type: "description",
    name: "Description Component",
    icon: <AlignLeft className="w-4 h-4" />,
  },
  {
    id: "table",
    type: "table",
    name: "Table Component",
    icon: <Grid3X3 className="w-4 h-4" />,
  },
  {
    id: "chart",
    type: "chart",
    name: "Graph Component",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "image",
    type: "image",
    name: "Image Component",
    icon: <ImageIcon className="w-4 h-4" />,
  },
  {
    id: "details",
    type: "details",
    name: "Details Component",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "calculation",
    type: "calculation",
    name: "Calculation Component",
    icon: <Calculator className="w-4 h-4" />,
  },
];

// Static sample data for components
const STATIC_TABLE_DATA = [
  { product: "Item 1", quantity: 2, total: "$150.00" },
  { product: "Item 2", quantity: 5, total: "$150.00" },
  { product: "Item 3", quantity: 10, total: "$75.00" },
  { product: "Item 4", quantity: 2, total: "$150.00" },
  { product: "Item 5", quantity: 2, total: "$10.00" },
  { product: "Item 6", quantity: 4, total: "$400.00" },
];

const PAGE_HEIGHT = 1056; // A4 height in pixels at 96 DPI
const PAGE_WIDTH = 816; // A4 width in pixels at 96 DPI

// Font families
const FONT_FAMILIES = [
  "Arial",
  "Times New Roman",
  "Helvetica",
  "Georgia",
  "Verdana",
  "Trebuchet MS",
  "Comic Sans MS",
  "Impact",
  "Lucida Console",
  "Courier New",
  "Palatino",
  "Garamond",
  "Bookman",
  "Avant Garde",
];

// Font sizes
const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72,
];

// Color palette
const COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#C0C0C0",
  "#808080",
  "#9999FF",
  "#993366",
  "#FFFFCC",
  "#CCFFFF",
  "#660066",
  "#FF8080",
  "#0066CC",
  "#CCCCFF",
];

const DEFAULT_STYLE: TextStyle = {
  fontFamily: "Arial",
  fontSize: 12,
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  color: "#000000",
  backgroundColor: "transparent",
  textAlign: "left",
  lineHeight: 1.5,
  letterSpacing: 0,
  textTransform: "none",
  textShadow: "none",
  listStyle: "none",
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
};

function DraggableComponent({ component }: { component: ComponentItem }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { type: component.type, name: component.name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 border rounded-lg cursor-move hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 ${isDragging ? "opacity-50" : ""
        }`}
    >
      {component.icon}
      <span className="text-sm">{component.name}</span>
    </div>
  );
}

// function ComponentConfigPanel({
//   component,
//   onUpdate,
//   onDelete,
//   totalPages,
// }: {
//   component: DroppedComponent | undefined;
//   onUpdate: (id: string, updates: Partial<DroppedComponent>) => void;
//   onDelete: (id: string) => void;
//   totalPages: number;
// }) {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   if (!component) return null;

//   const handleContentUpdate = (newContent: any) => {
//     onUpdate(component.id, {
//       content: { ...component.content, ...newContent },
//     });
//   };

//   const handlePositionUpdate = (field: string, value: number) => {
//     onUpdate(component.id, { [field]: Math.max(0, value) });
//   };

//   const handleImageUpload = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const result = e.target?.result as string;
//       handleContentUpdate({ src: result });
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="border-b pb-4">
//         <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
//           {COMPONENT_TYPES.find((t) => t.type === component.type)?.icon}
//           {COMPONENT_TYPES.find((t) => t.type === component.type)?.name ||
//             component.type}
//         </h3>
//         <Badge variant="secondary">{component.id}</Badge>
//       </div>

//       {/* Position & Size */}
//       <div className="space-y-4">
//         <h4 className="font-medium">Position & Size</h4>
//         <div className="grid grid-cols-2 gap-2">
//           <div>
//             <label className="text-xs text-gray-600">X Position</label>
//             <Input
//               type="number"
//               value={component.x}
//               onChange={(e) =>
//                 handlePositionUpdate("x", parseInt(e.target.value) || 0)
//               }
//               className="h-8"
//             />
//           </div>
//           <div>
//             <label className="text-xs text-gray-600">Y Position</label>
//             <Input
//               type="number"
//               value={component.y}
//               onChange={(e) =>
//                 handlePositionUpdate("y", parseInt(e.target.value) || 0)
//               }
//               className="h-8"
//             />
//           </div>
//           <div>
//             <label className="text-xs text-gray-600">Width</label>
//             <Input
//               type="number"
//               value={component.width}
//               onChange={(e) =>
//                 handlePositionUpdate("width", parseInt(e.target.value) || 100)
//               }
//               className="h-8"
//             />
//           </div>
//           <div>
//             <label className="text-xs text-gray-600">Height</label>
//             <Input
//               type="number"
//               value={component.height}
//               onChange={(e) =>
//                 handlePositionUpdate("height", parseInt(e.target.value) || 50)
//               }
//               className="h-8"
//             />
//           </div>
//         </div>
//         <div>
//           <label className="text-xs text-gray-600">Page</label>
//           <Select
//             value={component.page.toString()}
//             onValueChange={(value) =>
//               handlePositionUpdate("page", parseInt(value))
//             }
//           >
//             <SelectTrigger className="h-8">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {Array.from(
//                 { length: Math.max(component.page, totalPages) },
//                 (_, i) => i + 1
//               ).map((page) => (
//                 <SelectItem key={page} value={page.toString()}>
//                   Page {page}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Component-Specific Content */}
//       <div className="space-y-4">
//         <h4 className="font-medium">Content</h4>

//         {component.type === "text" && (
//           <div>
//             <label className="text-xs text-gray-600">Text Content</label>
//             <Textarea
//               value={component.content?.text || ""}
//               onChange={(e) => handleContentUpdate({ text: e.target.value })}
//               placeholder="Enter text content..."
//               className="min-h-20"
//             />
//           </div>
//         )}

//         {component.type === "description" && (
//           <div>
//             <label className="text-xs text-gray-600">Description</label>
//             <Textarea
//               value={component.content?.description || ""}
//               onChange={(e) =>
//                 handleContentUpdate({ description: e.target.value })
//               }
//               placeholder="Enter description content..."
//               className="min-h-24"
//             />
//           </div>
//         )}

//         {component.type === "details" && (
//           <div className="space-y-3">
//             <div>
//               <label className="text-xs text-gray-600">Payable To</label>
//               <Textarea
//                 value={component.content?.payableTo || ""}
//                 onChange={(e) =>
//                   handleContentUpdate({ payableTo: e.target.value })
//                 }
//                 placeholder="Enter payable to details..."
//                 className="min-h-20"
//               />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Bill To</label>
//               <Textarea
//                 value={component.content?.billTo || ""}
//                 onChange={(e) =>
//                   handleContentUpdate({ billTo: e.target.value })
//                 }
//                 placeholder="Enter bill to details..."
//                 className="min-h-20"
//               />
//             </div>
//           </div>
//         )}

//         {component.type === "calculation" && (
//           <div className="space-y-3">
//             <div>
//               <label className="text-xs text-gray-600">Label</label>
//               <Input
//                 value={component.content?.label || ""}
//                 onChange={(e) => handleContentUpdate({ label: e.target.value })}
//                 placeholder="Enter label (e.g., Sub Total)..."
//                 className="h-8"
//               />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Value</label>
//               <Input
//                 value={component.content?.value || ""}
//                 onChange={(e) => handleContentUpdate({ value: e.target.value })}
//                 placeholder="Enter value (e.g., $935.00)..."
//                 className="h-8"
//               />
//             </div>
//           </div>
//         )}

//         {component.type === "image" && (
//           <div className="space-y-3">
//             <div>
//               <label className="text-xs text-gray-600">Image URL</label>
//               <Input
//                 value={component.content?.src || ""}
//                 onChange={(e) => handleContentUpdate({ src: e.target.value })}
//                 placeholder="Enter image URL..."
//                 className="h-8"
//               />
//             </div>
//             <div className="text-center">
//               <p className="text-xs text-gray-500 mb-2">Or upload an image</p>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) {
//                     handleImageUpload(file);
//                   }
//                 }}
//                 className="hidden"
//               />
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full h-8"
//                 size="sm"
//               >
//                 <Upload className="w-3 h-3 mr-2" />
//                 Upload Image
//               </Button>
//             </div>
//             {component.content?.src && (
//               <div className="mt-2">
//                 <img
//                   src={component.content.src}
//                   alt="Preview"
//                   className="max-w-full h-20 object-contain border rounded"
//                 />
//               </div>
//             )}
//           </div>
//         )}

//         {component.type === "table" && (
//           <div>
//             <label className="text-xs text-gray-600 mb-2 block">
//               Table Data
//             </label>
//             <div className="text-xs text-gray-500 mb-2">
//               Currently showing static data. Future versions will support
//               dynamic data sources.
//             </div>
//             <div className="border rounded p-2 bg-gray-50 dark:bg-gray-900">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="text-xs p-1">Product</TableHead>
//                     <TableHead className="text-xs p-1">Quantity</TableHead>
//                     <TableHead className="text-xs p-1">Total</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {STATIC_TABLE_DATA.slice(0, 3).map((row, index) => (
//                     <TableRow key={index}>
//                       <TableCell className="text-xs p-1">
//                         {row.product}
//                       </TableCell>
//                       <TableCell className="text-xs p-1">
//                         {row.quantity}
//                       </TableCell>
//                       <TableCell className="text-xs p-1">{row.total}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Actions */}
//       <div className="space-y-2 pt-4 border-t">
//         <Button
//           onClick={() => onDelete(component.id)}
//           variant="destructive"
//           size="sm"
//           className="w-full"
//         >
//           <Trash2 className="w-4 h-4 mr-2" />
//           Delete Component
//         </Button>
//       </div>
//     </div>
//   );
// }

function StyleToolbar({
  selectedComponent,
  components,
  onUpdateComponent,
}: {
  selectedComponent: string | null;
  components: DroppedComponent[];
  onUpdateComponent: (id: string, updates: Partial<DroppedComponent>) => void;
}) {
  const component = components.find((c) => c.id === selectedComponent);
  if (!component || !["text", "description"].includes(component.type))
    return null;

  const style = { ...DEFAULT_STYLE, ...component.style };

  const updateStyle = (styleUpdates: Partial<TextStyle>) => {
    onUpdateComponent(component.id, {
      style: { ...style, ...styleUpdates },
    });
  };

  return (
    <div className="border-b bg-white dark:bg-gray-800 p-2 space-y-2 mb-2">
      <div className="text-sm font-medium mb-2">Text Formatting</div>

      {/* Font and Size Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select
          value={style.fontFamily}
          onValueChange={(value) => updateStyle({ fontFamily: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={style.fontSize.toString()}
          onValueChange={(value) => updateStyle({ fontSize: parseInt(value) })}
        >
          <SelectTrigger className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Separator orientation="vertical" className="h-6" />
        {/* Style Buttons */}
        <Button
          size="sm"
          variant={style.fontWeight === "bold" ? "default" : "outline"}
          onClick={() =>
            updateStyle({
              fontWeight: style.fontWeight === "bold" ? "normal" : "bold",
            })
          }
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={style.fontStyle === "italic" ? "default" : "outline"}
          onClick={() =>
            updateStyle({
              fontStyle: style.fontStyle === "italic" ? "normal" : "italic",
            })
          }
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant={
            style.textDecoration.includes("underline") ? "default" : "outline"
          }
          onClick={() => {
            const current = style.textDecoration.replace("none", "").trim();
            const isActive = current.includes("underline");
            const updated = isActive
              ? current.replace("underline", "").trim() || "none"
              : `${current} underline`.trim();
            updateStyle({ textDecoration: updated });
          }}
        >
          <Underline className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant={
            style.textDecoration.includes("line-through")
              ? "default"
              : "outline"
          }
          onClick={() => {
            const current = style.textDecoration.replace("none", "").trim();
            const isActive = current.includes("line-through");
            const updated = isActive
              ? current.replace("line-through", "").trim() || "none"
              : `${current} line-through`.trim();
            updateStyle({ textDecoration: updated });
          }}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        {/* Alignment Buttons */}
        <Button
          size="sm"
          variant={style.textAlign === "left" ? "default" : "outline"}
          onClick={() => updateStyle({ textAlign: "left" })}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={style.textAlign === "center" ? "default" : "outline"}
          onClick={() => updateStyle({ textAlign: "center" })}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={style.textAlign === "right" ? "default" : "outline"}
          onClick={() => updateStyle({ textAlign: "right" })}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={style.textAlign === "justify" ? "default" : "outline"}
          onClick={() => updateStyle({ textAlign: "justify" })}
        >
          <AlignJustify className="w-4 h-4" />
        </Button>
        {/* </div> */}
        {/* Colors and Advanced Options */}
        {/* <div className="flex items-center gap-2 flex-wrap"> */}
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1">
          <label className="text-xs">Color:</label>
          <input
            type="color"
            value={style.color}
            onChange={(e) => updateStyle({ color: e.target.value })}
            className="w-8 h-8 border rounded cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs">Background:</label>
          <input
            type="color"
            value={
              style.backgroundColor === "transparent"
                ? "#ffffff"
                : style.backgroundColor
            }
            onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
            className="w-8 h-8 border rounded cursor-pointer"
          />
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1">
          <label className="text-xs">Line Height:</label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={style.lineHeight}
            onChange={(e) =>
              updateStyle({ lineHeight: parseFloat(e.target.value) })
            }
            className="w-16"
          />
          <span className="text-xs w-8">{style.lineHeight}</span>
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs">Spacing:</label>
          <input
            type="range"
            min="-2"
            max="5"
            step="0.1"
            value={style.letterSpacing}
            onChange={(e) =>
              updateStyle({ letterSpacing: parseFloat(e.target.value) })
            }
            className="w-16"
          />
          <span className="text-xs w-8">{style.letterSpacing}px</span>
        </div>
        {/* Text Transform and Advanced */}
        <Separator orientation="vertical" className="h-6" />
        <Select
          value={style.textTransform}
          onValueChange={(value) => updateStyle({ textTransform: value })}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Case" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Normal</SelectItem>
            <SelectItem value="uppercase">UPPER</SelectItem>
            <SelectItem value="lowercase">lower</SelectItem>
            <SelectItem value="capitalize">Title</SelectItem>
          </SelectContent>
        </Select>
        <Separator orientation="vertical" className="h-6" />
        {/* Indent Controls */}
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            updateStyle({ marginLeft: Math.max(0, style.marginLeft - 20) })
          }
        >
          <IndentDecrease className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateStyle({ marginLeft: style.marginLeft + 20 })}
        >
          <IndentIncrease className="w-4 h-4" />
        </Button>
        {/* </div>

      {/* Quick Color Palette }
      <div className="flex items-center gap-1 flex-wrap"> */}
        <Separator orientation="vertical" className="h-6" />
        <span className="text-xs mr-2">Quick Colors:</span>
        {COLORS.slice(0, 12).map((color) => (
          <button
            key={color}
            className="w-6 h-6 rounded border-2 border-gray-300 cursor-pointer hover:border-gray-500"
            style={{ backgroundColor: color }}
            onClick={() => updateStyle({ color })}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}

function DroppedComponentRenderer({
  component,
  onEdit,
  onDelete,
  isSelected,
  onSelect,
  onUpdate,
  isPreviewMode = false,
}: {
  component: DroppedComponent;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<DroppedComponent>) => void;
  isPreviewMode?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const style = { ...DEFAULT_STYLE, ...component.style };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode) return;

    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest(".component-content")
    ) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - component.x,
        y: e.clientY - component.y,
      });
      onSelect(component.id);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode) return;

    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: component.width,
      height: component.height,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(
          0,
          Math.min(PAGE_WIDTH - component.width, e.clientX - dragStart.x)
        );
        const newY = Math.max(
          60,
          Math.min(PAGE_HEIGHT - component.height, e.clientY - dragStart.y)
        );

        // Always update position during drag for smooth movement
        onUpdate(component.id, { x: newX, y: newY });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(
          100,
          Math.min(PAGE_WIDTH - component.x, resizeStart.width + deltaX)
        );
        const newHeight = Math.max(
          50,
          Math.min(PAGE_HEIGHT - component.y, resizeStart.height + deltaY)
        );

        // Only update size during resize for smooth movement
        onUpdate(component.id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    isResizing,
    dragStart,
    resizeStart,
    component,
    onUpdate,
    isPreviewMode,
  ]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component.id);
  };

  const getTextStyles = () => ({
    fontFamily: style.fontFamily,
    fontSize: `${style.fontSize}px`,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    color: style.color,
    backgroundColor: style.backgroundColor,
    textAlign: style.textAlign as any,
    lineHeight: style.lineHeight,
    letterSpacing: `${style.letterSpacing}px`,
    textTransform: style.textTransform as any,
    textShadow: style.textShadow,
    marginLeft: `${style.marginLeft}px`,
    marginRight: `${style.marginRight}px`,
    marginTop: `${style.marginTop}px`,
    marginBottom: `${style.marginBottom}px`,
    paddingLeft: `${style.paddingLeft}px`,
    paddingRight: `${style.paddingRight}px`,
    paddingTop: `${style.paddingTop}px`,
    paddingBottom: `${style.paddingBottom}px`,
  });

  const renderContent = () => {
    switch (component.type) {
      case "text":
        return (
          <div className="p-2 h-full overflow-auto">
            <p className="break-words" style={getTextStyles()}>
              {component.content?.text || "Click to edit text..."}
            </p>
          </div>
        );
      case "description":
        return (
          <div className="p-2 h-full overflow-auto">
            <p className="break-words" style={getTextStyles()}>
              {component.content?.description ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullae quam velit, vulputate eu pharetra nec, mattis ac neque."}
            </p>
          </div>
        );
      case "table":
        return (
          <div className="p-2 h-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Product</TableHead>
                  <TableHead className="text-xs">Quantity</TableHead>
                  <TableHead className="text-xs">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(component.content?.rows || STATIC_TABLE_DATA).map(
                  (row: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="text-xs p-1">
                        {row.product}
                      </TableCell>
                      <TableCell className="text-xs p-1">
                        {row.quantity}
                      </TableCell>
                      <TableCell className="text-xs p-1">{row.total}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        );
      case "image":
        return (
          <div className="p-2 h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-auto">
            {component.content?.src ? (
              <img
                src={component.content.src}
                alt="Uploaded"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs">Click to upload image</span>
              </div>
            )}
          </div>
        );
      case "details":
        return (
          <div className="p-2 h-full overflow-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-xs">Payable to:</p>
                <p className="text-xs break-words whitespace-pre-wrap">
                  {component.content?.payableTo ||
                    "Mingo Industries\n12345 Business St.\nToledo OH\n43635 USA"}
                </p>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs">Bill to:</p>
                <p className="text-xs break-words whitespace-pre-wrap">
                  {component.content?.billTo ||
                    "Client Name\n123 Street\nToledo OH\n43635 USA"}
                </p>
              </div>
            </div>
          </div>
        );
      case "calculation":
        return (
          <div className="p-2 h-full bg-gray-50 dark:bg-gray-800 rounded overflow-auto">
            <div className="flex justify-between items-center h-full">
              <span className="font-medium text-sm break-words">
                {component.content?.label || "Sub Total"}
              </span>
              <span className="font-bold text-sm break-words">
                {component.content?.value || "$935.00"}
              </span>
            </div>
          </div>
        );
      case "chart":
        return (
          <div className="p-2 h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-auto">
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <BarChart3 className="w-8 h-8" />
              <span className="text-xs">Chart Component</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-2 h-full overflow-auto">Unknown component</div>
        );
    }
  };

  return (
    <div
      className={`absolute border rounded-lg bg-white dark:bg-gray-900 shadow-sm select-none ${isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
        } ${!isPreviewMode && (isDragging ? "cursor-grabbing" : "cursor-grab")}`}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
      }}
      data-component-id={component.id}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="component-content h-full">{renderContent()}</div>

      {isSelected && !isPreviewMode && (
        <>
          {/* Action buttons */}
          <div className="absolute -top-8 right-0 flex gap-1 pointer-events-auto">
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(component.id);
              }}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(component.id);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize pointer-events-auto"
            onMouseDown={handleResizeMouseDown}
            style={{
              clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)",
            }}
          />

          {/* Corner indicators for better visibility */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full -translate-x-1 -translate-y-1 pointer-events-none" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full translate-x-1 -translate-y-1 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-500 rounded-full -translate-x-1 translate-y-1 pointer-events-none" />
        </>
      )}
    </div>
  );
}

function DocumentPage({
  pageNumber,
  components,
  onDrop,
  onEdit,
  onDelete,
  onUpdate,
  selectedComponent,
  onSelectComponent,
  isPreviewMode = false,
  documentTitle,
}: {
  pageNumber: number;
  components: DroppedComponent[];
  onDrop: (item: any, offset: { x: number; y: number }, page: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<DroppedComponent>) => void;
  selectedComponent: string | null;
  onSelectComponent: (id: string) => void;
  isPreviewMode?: boolean;
  documentTitle: string;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: (item, monitor) => {
      console.log("Drop detected on page", pageNumber, "with item:", item);
      const offset = monitor.getClientOffset();
      const containerElement = document.getElementById(`page-${pageNumber}`);

      if (offset && containerElement) {
        const containerRect = containerElement.getBoundingClientRect();
        const relativeX = offset.x - containerRect.left;
        const relativeY = offset.y - containerRect.top;

        console.log("Drop position:", {
          relativeX,
          relativeY,
          containerRect: {
            left: containerRect.left,
            top: containerRect.top,
            width: containerRect.width,
            height: containerRect.height,
          },
          offset,
        });

        onDrop(
          item,
          {
            x: relativeX,
            y: relativeY,
          },
          pageNumber
        );

        return { success: true };
      } else {
        console.warn("Drop failed - missing offset or container element");
        return { success: false };
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const pageComponents = components.filter((c) => c.page === pageNumber);

  return (
    <div
      id={`page-${pageNumber}`}
      ref={!isPreviewMode ? drop : null}
      className={`relative  bg-white border border-gray-300 shadow-lg mx-auto mb-8 print:shadow-none print:border-gray-400 ${!isPreviewMode && isOver ? "border-blue-400 bg-blue-50" : ""
        } ${isPreviewMode ? "" : ""}`}
      style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, minHeight: PAGE_HEIGHT }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPreviewMode) {
          onSelectComponent("");
        }
      }}
    >
      {/* Page header - Only show on page 1 */}
      {pageNumber === 1 && (
        <div className="absolute top-4 left-4 right-4">
          <div className="text-center mb-3">
            {isPreviewMode ? (
              <h1 className="text-xl font-bold text-center">{documentTitle}</h1>
            ) : (
              <Input
                className="text-xl font-bold text-center border-none shadow-none bg-transparent"
                defaultValue={documentTitle}
                placeholder="Enter document title..."
              />
            )}
          </div>
        </div>
      )}

      {/* Drop zone indicator */}
      {!isPreviewMode && isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-50 border-2 border-dashed border-blue-400">
          <p className="text-blue-600 font-medium">Drop component here</p>
        </div>
      )}

      {/* Rendered components */}
      {pageComponents.length > 0 &&
        pageComponents.map((component) => {
          console.log(
            "Rendering component:",
            component.id,
            "at",
            component.x,
            component.y
          );
          return (
            <DroppedComponentRenderer
              key={component.id}
              component={component}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isSelected={!isPreviewMode && selectedComponent === component.id}
              onSelect={onSelectComponent}
              isPreviewMode={isPreviewMode}
            />
          );
        })}

      {/* Debug info - remove this after testing */}
      {!isPreviewMode && pageComponents.length === 0 && (
        <div className="absolute top-20 left-4 text-sm text-gray-500 bg-yellow-100 p-2 rounded">
          No components on this page. Drag components from the left panel.
        </div>
      )}

      {/* Page number */}
      <div className="absolute bottom-4 right-4 print:text-gray-600">
        <Badge variant="outline">Page {pageNumber}</Badge>
      </div>
    </div>
  );
}

function PreviewControls({
  onClose,
  onPrint,
  bookViewMode,
  onBookViewModeChange,
}: {
  onClose: () => void;
  onPrint: () => void;
  bookViewMode: "single" | "double";
  onBookViewModeChange: (mode: "single" | "double") => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border print:hidden">
      <Button
        size="sm"
        variant={bookViewMode === "single" ? "default" : "outline"}
        onClick={() => onBookViewModeChange("single")}
      >
        <Book className="w-4 h-4 mr-1" />1 Page
      </Button>
      <Button
        size="sm"
        variant={bookViewMode === "double" ? "default" : "outline"}
        onClick={() => onBookViewModeChange("double")}
      >
        <BookOpen className="w-4 h-4 mr-1" />2 Pages
      </Button>
      <Button size="sm" variant="outline" onClick={onPrint}>
        <Printer className="w-4 h-4 mr-1" />
        Print PDF
      </Button>
      <Button size="sm" variant="outline" onClick={onClose}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function TemplateBuilder() {
  const [components, setComponents] = useState<DroppedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [templateTitle, setTemplateTitle] = useState("Untitled Template");
  const [editingComponent, setEditingComponent] =
    useState<DroppedComponent | null>(null);
  const [editContent, setEditContent] = useState<any>({});
  const [totalPages, setTotalPages] = useState(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [bookViewMode, setBookViewMode] = useState<"single" | "double">(
    "single"
  );
  const [history, setHistory] = useState<DroppedComponent[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkCollision = (
    x: number,
    y: number,
    width: number,
    height: number,
    excludeId: string,
    pageNum: number,
    pageComponents: DroppedComponent[]
  ) => {
    // Allow reasonable overlaps (10px tolerance) to make positioning easier
    const tolerance = 10;

    return pageComponents.some((comp) => {
      if (comp.id === excludeId) return false;
      return (
        x < comp.x + comp.width - tolerance &&
        x + width > comp.x + tolerance &&
        y < comp.y + comp.height - tolerance &&
        y + height > comp.y + tolerance
      );
    });
  };

  const findAvailablePosition = (
    targetX: number,
    targetY: number,
    width: number,
    height: number,
    page: number,
    currentComponents: DroppedComponent[],
    excludeId?: string
  ) => {
    const pageComponents = currentComponents.filter(
      (c) => c.page === page && c.id !== excludeId
    );

    // If no components on page, place at a safe default position
    if (pageComponents.length === 0) {
      return {
        x: Math.max(20, Math.min(targetX, PAGE_WIDTH - width - 20)),
        y: Math.max(100, Math.min(targetY, PAGE_HEIGHT - height - 20)),
      };
    }

    // Try the target position first
    const safeX = Math.max(10, Math.min(targetX, PAGE_WIDTH - width - 10));
    const safeY = Math.max(80, Math.min(targetY, PAGE_HEIGHT - height - 10));

    if (
      !checkCollision(
        safeX,
        safeY,
        width,
        height,
        excludeId || "",
        page,
        pageComponents
      )
    ) {
      return { x: safeX, y: safeY };
    }

    // Try positions around the target area first (spiral search)
    const stepSize = 20;
    for (let radius = stepSize; radius <= 200; radius += stepSize) {
      // Try positions in a square around the target
      const positions = [
        { x: targetX + radius, y: targetY },
        { x: targetX - radius, y: targetY },
        { x: targetX, y: targetY + radius },
        { x: targetX, y: targetY - radius },
        { x: targetX + radius, y: targetY + radius },
        { x: targetX - radius, y: targetY - radius },
        { x: targetX + radius, y: targetY - radius },
        { x: targetX - radius, y: targetY + radius },
      ];

      for (const pos of positions) {
        const x = Math.max(10, Math.min(pos.x, PAGE_WIDTH - width - 10));
        const y = Math.max(80, Math.min(pos.y, PAGE_HEIGHT - height - 10));

        if (
          !checkCollision(
            x,
            y,
            width,
            height,
            excludeId || "",
            page,
            pageComponents
          )
        ) {
          return { x, y };
        }
      }
    }

    // Fallback: grid search
    const gridSize = 25;
    const maxY = PAGE_HEIGHT - height - 20;
    const maxX = PAGE_WIDTH - width - 20;

    for (let y = 80; y <= maxY; y += gridSize) {
      for (let x = 10; x <= maxX; x += gridSize) {
        if (
          !checkCollision(
            x,
            y,
            width,
            height,
            excludeId || "",
            page,
            pageComponents
          )
        ) {
          return { x, y };
        }
      }
    }

    // Last resort: stack components vertically
    const rightmostX =
      pageComponents.length > 0
        ? Math.max(...pageComponents.map((c) => c.x + c.width))
        : 20;
    const availableX = Math.min(rightmostX + 20, PAGE_WIDTH - width - 20);

    return {
      x: availableX > PAGE_WIDTH - width - 20 ? 20 : availableX,
      y: Math.max(100, Math.min(targetY, PAGE_HEIGHT - height - 20)),
    };
  };

  const saveToHistory = (newComponents: DroppedComponent[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newComponents]);
    setHistory(newHistory.slice(-50)); // Keep last 50 states
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents([...history[historyIndex - 1]]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents([...history[historyIndex + 1]]);
    }
  };

  const handleDrop = (
    item: any,
    offset: { x: number; y: number },
    page: number
  ) => {
    console.log("Drop received:", { item, offset, page });

    const width = getDefaultWidth(item.type);
    const height = getDefaultHeight(item.type);

    // Calculate position relative to page, ensuring component stays within bounds
    let targetX = Math.max(
      10,
      Math.min(offset.x - width / 2, PAGE_WIDTH - width - 10)
    );
    let targetY = Math.max(
      80,
      Math.min(offset.y - height / 2, PAGE_HEIGHT - height - 10)
    );

    // Get current components at time of drop (use functional state update)
    setComponents((currentComponents) => {
      const pageComponents = currentComponents.filter((c) => c.page === page);

      // If position is too close to existing components, find a better spot
      let finalPosition = { x: targetX, y: targetY };
      if (
        checkCollision(
          targetX,
          targetY,
          width,
          height,
          "",
          page,
          pageComponents
        )
      ) {
        finalPosition = findAvailablePosition(
          targetX,
          targetY,
          width,
          height,
          page,
          currentComponents
        );
      }

      const newComponent: DroppedComponent = {
        id: `${item.type}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        type: item.type,
        content: getDefaultContent(item.type),
        x: finalPosition.x,
        y: finalPosition.y,
        width,
        height,
        page,
        style: { ...DEFAULT_STYLE },
      };

      console.log("Creating component:", newComponent);

      const newComponents = [...currentComponents, newComponent];

      // Save to history after state update
      setTimeout(() => saveToHistory(newComponents), 0);

      // Set selected component
      setSelectedComponent(newComponent.id);

      return newComponents;
    });
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "text":
        return {
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        };
      case "description":
        return {
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullae quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.",
        };
      case "table":
        return { rows: STATIC_TABLE_DATA };
      case "details":
        return {
          payableTo:
            "Mingo Industries\n12345 Business St.\nToledo OH\n43635 USA",
          billTo: "Client Name\n123 Street\nToledo OH\n43635 USA",
        };
      case "calculation":
        return { label: "Sub Total", value: "$935.00" };
      case "image":
        return { src: null };
      case "chart":
        return { type: "bar", data: [] };
      default:
        return {};
    }
  };

  const getDefaultWidth = (type: string) => {
    switch (type) {
      case "text":
        return 300;
      case "table":
        return 400;
      case "details":
        return 350;
      case "image":
        return 200;
      case "chart":
        return 300;
      default:
        return 200;
    }
  };

  const getDefaultHeight = (type: string) => {
    switch (type) {
      case "text":
        return 100;
      case "table":
        return 200;
      case "details":
        return 150;
      case "image":
        return 150;
      case "chart":
        return 200;
      default:
        return 100;
    }
  };

  const handleEdit = (id: string) => {
    const component = components.find((c) => c.id === id);
    if (component) {
      setEditingComponent(component);
      setEditContent(component.content);
    }
  };

  const handleSaveEdit = () => {
    if (editingComponent) {
      const newComponents = components.map((c) =>
        c.id === editingComponent.id ? { ...c, content: editContent } : c
      );
      setComponents(newComponents);
      saveToHistory(newComponents);
      setEditingComponent(null);
      setEditContent({});
    }
  };

  const handleDelete = (id: string) => {
    const newComponents = components.filter((c) => c.id !== id);
    setComponents(newComponents);
    saveToHistory(newComponents);
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  const handleUpdateComponent = (
    id: string,
    updates: Partial<DroppedComponent>
  ) => {
    const newComponents = components.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );

    setComponents(newComponents);
    // Only save to history for major changes, not for every drag/style update
    if (updates.content || updates.width || updates.height) {
      saveToHistory(newComponents);
    }
  };

  const handleSaveTemplate = async () => {
    const template: TemplateData = {
      title: templateTitle,
      components,
      pages: totalPages,
    };

    try {
      // Try API call first
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        const result = await response.json();
      } else {
        throw new Error("Failed to save template");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      // Fallback to localStorage
      localStorage.setItem(`template-${Date.now()}`, JSON.stringify(template));
    }
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Get the preview content
    const previewContainer = document.querySelector(".preview-pages");
    if (!previewContainer) return;

    const printStyles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          background: white;
        }

        .page {
          width: ${PAGE_WIDTH}px;
          height: ${PAGE_HEIGHT}px;
          margin: 0 auto;
          padding: 0;
          background: white;
          position: relative;
          page-break-after: always;
          overflow: hidden;
          border: 1px solid #ccc;
        }

        .page:last-child {
          page-break-after: avoid;
        }

        @page {
          size: A4;
          margin: 0.5in;
        }

        @media print {
          body { 
            print-color-adjust: exact; 
            -webkit-print-color-adjust: exact;
          }

          .page {
            border: none;
            box-shadow: none;
            margin: 0;
            width: 100%;
            height: 100%;
          }
        }

        /* Preserve exact positioning */
        .absolute {
          position: absolute !important;
        }

        /* Component styling - preserve all Tailwind classes */
        .relative { position: relative; }
        .bg-white { background-color: white; }
        .border { border: 1px solid #e5e7eb; }
        .border-gray-200 { border-color: #e5e7eb; }
        .border-gray-300 { border-color: #d1d5db; }
        .rounded-lg { border-radius: 0.5rem; }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-4 { margin-bottom: 1rem; }
        .p-2 { padding: 0.5rem; }
        .p-4 { padding: 1rem; }
        .top-4 { top: 1rem; }
        .left-4 { left: 1rem; }
        .right-4 { right: 1rem; }
        .bottom-4 { bottom: 1rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .text-center { text-align: center; }
        .text-gray-500 { color: #6b7280; }
        .text-gray-600 { color: #4b5563; }
        .bg-gray-50 { background-color: #f9fafb; }
        .bg-gray-100 { background-color: #f3f4f6; }
        .bg-gray-800 { background-color: #1f2937; }
        .overflow-auto { overflow: auto; }
        .h-full { height: 100%; }
        .w-full { width: 100%; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .flex-col { flex-direction: column; }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .gap-2 { gap: 0.5rem; }
        .gap-4 { gap: 1rem; }
        .min-w-0 { min-width: 0px; }
        .break-words { overflow-wrap: break-word; word-wrap: break-word; }
        .whitespace-pre-wrap { white-space: pre-wrap; }
        .select-none { user-select: none; }

        /* Table styling */
        table {
          border-collapse: collapse;
          width: 100%;
        }

        th, td {
          border: 1px solid #e5e7eb;
          padding: 0.25rem;
          text-align: left;
          font-size: 0.75rem;
        }

        th {
          background-color: #f9fafb;
          font-weight: 600;
        }

        .p-1 { padding: 0.25rem; }

        /* Image styling */
        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        /* Badge styling - preserve exact positioning */
        .badge,
        [class*="badge"] {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          border: 1px solid #e5e7eb;
          padding: 0.125rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: white;
        }

        /* Component content styling */
        .component-content {
          height: 100%;
        }

        /* Hide buttons and resize handles in print */
        button,
        .cursor-grab,
        .cursor-grabbing,
        .cursor-se-resize,
        [class*="pointer-events"],
        .ring-2,
        .ring-blue-200 {
          display: none !important;
        }

        /* Ensure borders are visible but not selection indicators */
        .border-blue-500 {
          border-color: #e5e7eb !important;
        }
      </style>
    `;

    // Clone each page and create print content
    const pages = previewContainer.querySelectorAll('[id^="page-"]');
    let printContent = "";

    pages.forEach((page, index) => {
      const pageClone = page.cloneNode(true) as HTMLElement;

      // Remove scaling from preview
      pageClone.style.transform = "";
      pageClone.style.transformOrigin = "";

      // Remove any preview-only elements and controls
      pageClone
        .querySelectorAll(
          '.no-print, [class*="print:hidden"], button, [class*="cursor-"], .ring-2, .ring-blue-200'
        )
        .forEach((el) => el.remove());

      // Preserve the original page structure and styling
      pageClone.style.width = `${PAGE_WIDTH}px`;
      pageClone.style.height = `${PAGE_HEIGHT}px`;
      pageClone.style.position = "relative";
      pageClone.style.margin = "0 auto";
      pageClone.style.background = "white";
      pageClone.style.border = "1px solid #ccc";
      pageClone.style.pageBreakAfter =
        index === pages.length - 1 ? "avoid" : "always";

      // Ensure all absolute positioned elements maintain their positions
      const absoluteElements = pageClone.querySelectorAll(
        '[class*="absolute"]'
      );
      absoluteElements.forEach((el) => {
        (el as HTMLElement).style.position = "absolute";
      });

      printContent += pageClone.outerHTML;
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${templateTitle} - Print</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${printStyles}
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setEditContent((prev: any) => ({ ...prev, src: result }));
    };
    reader.readAsDataURL(file);
  };

  // Calculate total pages based on component positions
  useEffect(() => {
    const maxPage = Math.max(1, ...components.map((c) => c.page), 1);
    setTotalPages(maxPage);
  }, [components]);

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      setHistory([[]]);
      setHistoryIndex(0);
    }
  }, []);

  if (isPreviewMode) {
    const renderPages = () => {
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

      if (bookViewMode === "single") {
        return pages.map((pageNumber) => (
          <div
            key={pageNumber}
            className="flex-shrink-0"
          // style={{ transform: 'scale(0.8)', transformOrigin: 'center top' }}
          >
            <DocumentPage
              pageNumber={pageNumber}
              components={components}
              onDrop={handleDrop}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdate={handleUpdateComponent}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              isPreviewMode={true}
              documentTitle={templateTitle}
            />
          </div>
        ));
      } else {
        // Double page view - show pages in pairs with proper spacing
        const pageGroups = [];
        for (let i = 0; i < pages.length; i += 2) {
          pageGroups.push(pages.slice(i, i + 2));
        }

        return pageGroups.map((group, groupIndex) => (
          <div className="w-full flex justify-center">
            <div
              key={groupIndex}
              className="flex gap-8 mb-12 justify-center scale-75"
            >
              {group.map((pageNumber) => (
                <div
                  key={pageNumber}
                  className="flex-shrink-0"
                  style={{
                    width: `${PAGE_WIDTH}px`,
                    height: `${PAGE_HEIGHT}px`,
                  }}
                // style={{ transform: 'scale(0.7)', transformOrigin: 'center top' }}
                >
                  <DocumentPage
                    pageNumber={pageNumber}
                    components={components}
                    onDrop={handleDrop}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onUpdate={handleUpdateComponent}
                    selectedComponent={selectedComponent}
                    onSelectComponent={setSelectedComponent}
                    isPreviewMode={true}
                    documentTitle={templateTitle}
                  />
                </div>
              ))}
            </div>
          </div>
        ));
      }
    };

    return (
      <div className="min-h-screen bg-[#E8E8E8] dark:bg-[#081028]">
        <PreviewControls
          onClose={() => setIsPreviewMode(false)}
          onPrint={handlePrint}
          bookViewMode={bookViewMode}
          onBookViewModeChange={setBookViewMode}
        />

        <div className="preview-pages flex flex-col items-center mx-8">
          {renderPages()}
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-[#E8E8E8] dark:bg-[#081028]">
        {/* Style Toolbar */}
        <StyleToolbar
          selectedComponent={selectedComponent}
          components={components}
          onUpdateComponent={handleUpdateComponent}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Components */}
          <div className="w-72 rounded-xl border bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 pt-2 overflow-y-auto h-full flex-shrink-0">
            <Tabs defaultValue="components" className="w-full">
              {/* <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList> */}

              <TabsContent value="components" className="space-y-6">
                <div>
                  <h2 className="text-lg mb-2 font-semibold">
                    Draggable Components
                  </h2>
                  <div className="space-y-3">
                    {COMPONENT_TYPES.map((component) => (
                      <DraggableComponent
                        key={component.id}
                        component={component}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Template Title
                      </label>
                      <Input
                        value={templateTitle}
                        onChange={(e) => setTemplateTitle(e.target.value)}
                        placeholder="Enter template title"
                        className="w-full"
                        o
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleSaveTemplate}
                        variant="outline"
                        className="w-full"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Template
                      </Button>
                      <Button
                        onClick={() => setIsPreviewMode(true)}
                        variant="outline"
                        className="w-full"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Preview & Print
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Editing Tools</h2>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleUndo}
                      disabled={historyIndex <= 0}
                    >
                      <Undo className="w-4 h-4 mr-2" />
                      Undo ({historyIndex})
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleRedo}
                      disabled={historyIndex >= history.length - 1}
                    >
                      <Redo className="w-4 h-4 mr-2" />
                      Redo
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-3">Project Stats</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="text-sm font-medium mb-1">
                      Current Status
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Total Pages: {totalPages}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Components: {components.length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Selected: {selectedComponent ? "Yes" : "None"}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Find & Replace
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Component
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs"
                    >
                      <Clipboard className="w-4 h-4 mr-2" />
                      Paste Component
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Document Area */}
          <div className="flex-1 overflow-y-auto h-full">
            <div className="max-w-5xl mx-auto px-2">
              {/* Document info */}
              <div className="mb-2 text-center">
                {/* <h1 className="text-2xl font-bold mb-2">{templateTitle}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag components from the left panel onto the pages below
                </p> */}

                {/* Add Page Button - More Visible */}
                <div className="flex justify-center items-center gap-4 mt-4">
                  <Button
                    variant="default"
                    onClick={() => {
                      setTotalPages((prev) => prev + 1);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Page
                  </Button>

                  <div className="text-sm text-gray-500">
                    Total Pages: {totalPages} | Components: {components.length}
                  </div>

                  {totalPages > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (totalPages > 1) {
                          const newComponents = components.filter(
                            (c) => c.page !== totalPages
                          );
                          setComponents(newComponents);
                          setTotalPages((prev) => prev - 1);
                        }
                      }}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Last Page
                    </Button>
                  )}
                </div>
              </div>

              {/* Pages */}
              <div className="space-y-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <div key={pageNumber} className="relative">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          Page {pageNumber}
                        </h3>
                        <div className="text-sm text-gray-500">
                          {
                            components.filter((c) => c.page === pageNumber)
                              .length
                          }{" "}
                          components
                        </div>
                      </div>
                      <DocumentPage
                        pageNumber={pageNumber}
                        components={components}
                        onDrop={handleDrop}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onUpdate={handleUpdateComponent}
                        selectedComponent={selectedComponent}
                        onSelectComponent={setSelectedComponent}
                        isPreviewMode={false}
                        documentTitle={templateTitle}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Component Configuration */}
          {/* <div className="w-72 rounded-xl border bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto h-full flex-shrink-0">
            {selectedComponent ? (
              <ComponentConfigPanel
                component={components.find((c) => c.id === selectedComponent)}
                onUpdate={handleUpdateComponent}
                onDelete={handleDelete}
                totalPages={totalPages}
              />
            ) : (
              <div className="text-center text-gray-500">
                <div className="mb-6">
                  <Monitor className="w-16 h-16 mx-auto text-gray-300" />
                </div>
                <h3 className="text-lg font-medium mb-3">
                  Component Properties
                </h3>
                <p className="text-sm mb-6">
                  Click on any component in the document to edit its properties
                  here.
                </p>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-left">
                  <h4 className="font-medium mb-3 text-center">How to Use:</h4>
                  <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                    <li>1. Drag components from left panel</li>
                    <li>2. Drop them on the document pages</li>
                    <li>3. Click to select and edit here</li>
                    <li>4. Use text formatting toolbar above</li>
                    <li>5. Preview when ready</li>
                  </ol>
                </div>
              </div>
            )}
          </div> */}
        </div>

        {/* Edit Modal */}
        {editingComponent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96 max-h-96 overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit {editingComponent.type} Component</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingComponent.type === "text" && (
                  <div>
                    <label className="text-sm font-medium">Text Content</label>
                    <Textarea
                      value={editContent.text || ""}
                      onChange={(e) =>
                        setEditContent((prev: any) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      placeholder="Enter text content..."
                    />
                  </div>
                )}

                {editingComponent.type === "details" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Payable To</label>
                      <Textarea
                        value={editContent.payableTo || ""}
                        onChange={(e) =>
                          setEditContent((prev: any) => ({
                            ...prev,
                            payableTo: e.target.value,
                          }))
                        }
                        placeholder="Enter payable to details..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bill To</label>
                      <Textarea
                        value={editContent.billTo || ""}
                        onChange={(e) =>
                          setEditContent((prev: any) => ({
                            ...prev,
                            billTo: e.target.value,
                          }))
                        }
                        placeholder="Enter bill to details..."
                      />
                    </div>
                  </div>
                )}

                {editingComponent.type === "description" && (
                  <div>
                    <label className="text-sm font-medium">
                      Description Content
                    </label>
                    <Textarea
                      value={editContent.description || ""}
                      onChange={(e) =>
                        setEditContent((prev: any) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Enter description content..."
                      rows={4}
                    />
                  </div>
                )}

                {editingComponent.type === "calculation" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Label</label>
                      <Input
                        value={editContent.label || ""}
                        onChange={(e) =>
                          setEditContent((prev: any) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                        placeholder="Enter label (e.g., Sub Total)..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Value</label>
                      <Input
                        value={editContent.value || ""}
                        onChange={(e) =>
                          setEditContent((prev: any) => ({
                            ...prev,
                            value: e.target.value,
                          }))
                        }
                        placeholder="Enter value (e.g., $935.00)..."
                      />
                    </div>
                  </div>
                )}

                {editingComponent.type === "image" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Image URL</label>
                      <Input
                        value={editContent.src || ""}
                        onChange={(e) =>
                          setEditContent((prev: any) => ({
                            ...prev,
                            src: e.target.value,
                          }))
                        }
                        placeholder="Enter image URL..."
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">
                        Or upload an image
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveEdit} className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingComponent(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
