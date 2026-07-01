"use client";

import { AdminGetCourseType } from "@/app/data/admin/admin-get-course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSortable } from "@dnd-kit/react/sortable";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { Button } from "@/components/ui/button";

interface Props {
  courseData: AdminGetCourseType;
}

interface SortableProps {
  id: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

function LessonSortable();

function ChapterSortable({ id, index, isOpen, onToggle, title }: SortableProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { isDragging } = useSortable({
    id,
    index,
    element,
    handle: handleRef,
  });

  return (
    <Card ref={setElement} className="item cursor-pointer p-4">
      <Collapsible open={isOpen} onOpenChange={() => onToggle()}>
        <CardHeader>
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Button
                ref={handleRef}
                variant="ghost"
                size="icon"
                className="cursor-grab opacity-60 hover:opacity-100 flex gap-2 items-center"
              >
                <GripVertical className="size-4" />
              </Button>

              <CardTitle>
                <p className="text-md font-semibold capitalize">{title}</p>
              </CardTitle>

              <CollapsibleTrigger>
                <Button variant="ghost" size="icon">
                  {isOpen ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <div className="p-1"></div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function CourseStructure({ courseData }: Props) {
  const items = [1, 2, 3, 4];

  const toggleChapter = ({ chapterId }: { chapterId: string }) => {
    setInitialItems(() =>
      initialItems.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter,
      ),
    );
  };

  const [initialItems, setInitialItems] = useState(
    courseData.chapters?.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [],
  );

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        setInitialItems((items) => move(items, event));
      }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Course Structure </CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="list">
            {initialItems.map((chapter) => (
              <ChapterSortable
                key={chapter.id}
                id={chapter.id}
                index={chapter.order}
                isOpen={chapter.isOpen}
                title={chapter.title}
                onToggle={() => toggleChapter({ chapterId: chapter.id })}
              />
            ))}
          </ul>
        </CardContent>
      </Card>
    </DragDropProvider>
  );
}
