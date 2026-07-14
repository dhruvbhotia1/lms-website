"use client";

import { DraggableSyntheticListeners, rectIntersection } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AdminGetCourseType } from "@/app/data/admin/admin-get-course";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DeleteIcon, FileText, GripVertical, Trash2 } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  courseData: AdminGetCourseType;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data?: {
    type: "lesson" | "chapter";
    chapterId?: string;
  };
}

function SortableItem({ id, children, className, data }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id,
      data,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn("touch-none", className, isDragging ? "z-10" : "")}
    >
      {children(listeners)}
    </div>
  );
}

export function CourseStructure({ courseData }: Props) {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Swap the positions of the active and over items
    }
  }

  const [initialItems, setInitialItems] = useState(
    courseData.chapters?.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        chapterId: lesson.chapterId,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [],
  );

  function toggleChapter(chapterId: string) {
    setInitialItems(
      initialItems.map((item) =>
        item.id === chapterId ? { ...item, isOpen: !item.isOpen } : item,
      ),
    );
  }

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>

        <CardContent>
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={initialItems.map((item) => item.id)}
          >
            {initialItems.map((item) => (
              <SortableItem id={item.id} data={{ type: "chapter" }} key={item.id}>
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button
                            size={"icon"}
                            variant="ghost"
                            className="cursor-grab opacity-60 hover:opactiy-100"
                            {...listeners}
                          >
                            <GripVertical className="h-4 w-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="flex items-center"

                            >
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>

                          <p className="cursor-pointer hover:text-primary pl-2">
                            {item.title}
                          </p>
                        </div>

                        <Button size="icon" variant="outline">
                          <Trash2 className="size-4"/>
                        </Button>
                      </div>

                      <CollapsibleContent>
                        <div className="p-1">

                          <SortableContext items={item.lessons.map((lesson) => lesson.id)} strategy={verticalListSortingStrategy}>

                            {item.lessons.map((lesson) => (
                              <SortableItem key={lesson.id} id={lesson.id} data={{ type: "lesson", chapterId: item.id }}>

                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-3">
                                      <Button variant="ghost" size="icon" {...lessonListeners} className="cursor-grab">
                                        <GripVertical className="size-4 "/>

                                      </Button>

                                      <FileText className="size-4" />
                                      <Link href={ `/admin/course/${courseData.id}/${item.id}/${lesson.id}`}>{lesson.title}</Link>

                                    </div>

                                    <Button variant="outline" size="icon">

                                      <Trash2 className="size-4"/>

                                    </Button>

                                  </div>
                                )}


                              </SortableItem>
                            ))}

                          </SortableContext>

                          <div className="p-2">

                            <Button variant="outline" className="w-1/2 mx-auto block">Create New Lesson</Button>

                          </div>

                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
