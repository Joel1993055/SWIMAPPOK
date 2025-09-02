"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DraggableWidgetProps {
  id: string;
  children: React.ReactNode;
  isDragging?: boolean;
}

function DraggableWidget({ id, children, isDragging }: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-50' : ''}`}
    >
      <Card className="h-full">
        <CardContent className="p-0 h-full">
          {/* Drag Handle */}
          <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
            {...attributes}
            {...listeners}
          >
            <div className="bg-background/80 backdrop-blur-sm rounded-md p-1 border">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

interface WidgetGridProps {
  activeWidgets: string[];
  onReorder: (newOrder: string[]) => void;
  renderWidget: (widgetId: string) => React.ReactNode;
}

export function DraggableWidgetGrid({ activeWidgets, onReorder, renderWidget }: WidgetGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = activeWidgets.indexOf(active.id as string);
      const newIndex = activeWidgets.indexOf(over.id as string);
      
      const newOrder = arrayMove(activeWidgets, oldIndex, newIndex);
      onReorder(newOrder);
    }

    setActiveId(null);
  };

  // Función para determinar el layout del grid basado en los widgets activos
  const getGridLayout = () => {
    const kpiIndex = activeWidgets.indexOf("kpi-cards");
    const visitorsIndex = activeWidgets.indexOf("visitors-chart");
    const calendarIndex = activeWidgets.indexOf("dashboard-calendar");
    const swimmingIndex = activeWidgets.indexOf("swimming-charts");

    // Si tenemos KPIs, siempre van primero
    if (kpiIndex !== -1) {
      const otherWidgets = activeWidgets.filter(id => id !== "kpi-cards");
      
      return (
        <div className="space-y-4">
          {/* KPIs siempre en la primera fila */}
          <div className="grid grid-cols-1">
            <DraggableWidget id="kpi-cards" isDragging={activeId === "kpi-cards"}>
              {renderWidget("kpi-cards")}
            </DraggableWidget>
          </div>

          {/* Resto de widgets en grid flexible */}
          {otherWidgets.length > 0 && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {otherWidgets.map((widgetId) => (
                <DraggableWidget 
                  key={widgetId} 
                  id={widgetId}
                  isDragging={activeId === widgetId}
                >
                  {renderWidget(widgetId)}
                </DraggableWidget>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Si no hay KPIs, usar grid flexible
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {activeWidgets.map((widgetId) => (
          <DraggableWidget 
            key={widgetId} 
            id={widgetId}
            isDragging={activeId === widgetId}
          >
            {renderWidget(widgetId)}
          </DraggableWidget>
        ))}
      </div>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={activeWidgets} strategy={rectSortingStrategy}>
        {getGridLayout()}
      </SortableContext>
      
      <DragOverlay>
        {activeId ? (
          <div className="opacity-50">
            <DraggableWidget id={activeId} isDragging={true}>
              {renderWidget(activeId)}
            </DraggableWidget>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
