"use client";

import { DragEndEvent, DraggableSyntheticListeners, rectIntersection } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
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
import { FileText, GripVertical } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reorderLessons, reorderChapters } from "@/lib/reorder";
import { NewChapterModal } from "./NewChapterModal";
import { NewLessonModal } from "./NewLessonModal";
import { DeleteLesson } from "./DeleteLesson";
import { DeleteChapter } from "./DeleteChapter";



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

  const [prevCourseData, setPrevCourseData] = useState(courseData);

  if (courseData !== prevCourseData) {

    setPrevCourseData(courseData);
    setInitialItems((prevItems) => {
      const updatedItems = courseData.chapters.map((chapter) => ({

        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          chapterId: lesson.chapterId,
          title: lesson.title,
          order: lesson.position,
        })),

      })) || [];
      return updatedItems;
    })
  }

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);



  //togggle chapter function

  function toggleChapter(chapterId: string) {
    setInitialItems(
      initialItems.map((item) =>
        item.id === chapterId ? { ...item, isOpen: !item.isOpen } : item,
      ),
    );
  }

  //handle drag function


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      // Swap the positions of the active and over items
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";

    const overType = over.data.current?.type as "chapter" | "lesson";

    const courseId = courseData.id;

    if (activeType === "chapter") {

      let targetChapterId = null;

      if (overType === "chapter") {

        targetChapterId = overId;

      } else if (overType === "lesson") {

        targetChapterId = over.data.current?.chapterId ?? null;

      }

      if (!targetChapterId) {

        toast.error("Looks like something went wrong. Please try again.");
        return;
      }

      const oldIndex = initialItems.findIndex((item) => item.id === activeId); //finding the original index of the active item.
      const newIndex = initialItems.findIndex((item) => item.id === targetChapterId); //finding the index of the target chapter.

      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Looks like something went wrong. Please try again.");
        return;
      }

      const reorderedLocalChapters = arrayMove(initialItems, oldIndex, newIndex);

      const updatedChapterForState = reorderedLocalChapters.map((item, index) => ({
        ...item,
        order: index + 1,
      })); //updating the order of the chapters to 1 based indexing.

      const previousItems = [...initialItems]; // local backup of the previous state. To roll back in case of db updation (api call) fails.

      setInitialItems(updatedChapterForState);

      if (courseId) {
        const chapterToUpdate = updatedChapterForState.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));

        const reorderPromise = () => reorderChapters({ chapters: chapterToUpdate, courseId });

        toast.promise(reorderPromise(), {
          loading: "Reordering Chapters...",
          success: (result) => {
            if (result.status === "success") {
              return result.message;
            }
            throw new Error(result.message);

          },
          error: () => {
            setInitialItems(previousItems);
            return "Failed to reorder chapters.";
          }
        })
      }

      return;
    }

    if (activeType === "lesson" && overType === "lesson") {

      const chapterId = active.data.current?.chapterId;

      const overChapterId = over.data.current?.chapterId;

      if (chapterId !== overChapterId || !chapterId) {

        toast.error("Cannot move lesson to a different chapter.");
        return;
      }

      const chapterIndex = initialItems.findIndex((chapter) => chapter.id === chapterId); //finding the correct chapter index in the local state.

      if (chapterIndex == -1) {
        toast.error("Chapter not found.");
        return;
      }

      const chapterToUpdate = initialItems[chapterIndex];

      const oldLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === active.id);

      const newLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === over.id);

      if (oldLessonIndex == -1 || newLessonIndex == -1) {
        toast.error("Lesson not found.");
        return;
      }

      const reorderedLessons = arrayMove(chapterToUpdate.lessons, oldLessonIndex, newLessonIndex);

      const updatedLessonForState = reorderedLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const newItems = [...initialItems];
      newItems[chapterIndex] = { ...chapterToUpdate, lessons: updatedLessonForState };
      const prevItems = [...initialItems];
      setInitialItems(newItems);

      if (courseId) {

        const lessonsToUpdate = updatedLessonForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order
        }))

        const reorderLessonPromise = () => reorderLessons({ chapterId, lessons: lessonsToUpdate, courseId });

        toast.promise(reorderLessonPromise, {
          loading: "Reordering lessons...",
          success: (result) => {
            if (result.status === "success") {
              return result.message;
            }
            throw new Error(result.message);
          },
          error: () => {
            setInitialItems(prevItems);
            return "Failed to reorder lessons."
          }
        })

      }

      return;
    }
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
          <NewChapterModal courseId={courseData.id} />
        </CardHeader>

        <CardContent className="space-y-8">
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

                        <DeleteChapter chapterId={item.id} courseId={courseData.id} />
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
                                      <Link href={`/admin/courses/${courseData.id}/${item.id}/${lesson.id}`}>{lesson.title}</Link>

                                    </div>
                                    <DeleteLesson chapterId={lesson.chapterId} lessonId={lesson.id} courseId={ courseData.id }/>
                                  </div>
                                )}
                              </SortableItem>
                            ))}

                          </SortableContext>

                          <div className="flex justify-center">

                            <NewLessonModal courseId={courseData.id} chapterId={item.id}/>

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
