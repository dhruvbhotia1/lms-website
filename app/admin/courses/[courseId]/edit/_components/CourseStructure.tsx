"use client";

import { AdminGetCourseType } from "@/app/data/admin/admin-get-course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible } from "@/components/ui/collapsible";
import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical } from "lucide-react";
import { useState } from "react";

interface Props {
  courseData: AdminGetCourseType;
}

interface SortableProps {
  id: string;
  index: number;
  isOpen: boolean;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

export function CourseStructure({ courseData }: Props) {
  const items = [1, 2, 3, 4];

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

  function Sortable({ id, index, isOpen }: SortableProps) {
    const { ref } = useSortable({ id, index });

    const toggleChapter = ({ chapterId }: { chapterId: string }) => {
      setInitialItems(() =>
        initialItems.map((chapter) =>
          chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter,
        ),
      );
    };

    return (
      <Card ref={ref} className="item cursor-pointer p-4">
        <CardHeader>
          <CardTitle>{}</CardTitle>
        </CardHeader>
        <Collapsible open={isOpen} onOpenChange={() => toggleChapter({ chapterId: id })}>
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <button className="cursor-grab opacity-60 hover:opacity-100">
                <GripVertical className="size-4" />
              </button>
            </div>
          </div>
        </Collapsible>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Edit Course Structure</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="list">
          {initialItems.map((chapter) => (
            <Sortable
              key={chapter.id}
              id={chapter.id}
              index={chapter.order}
              isOpen={chapter.isOpen}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
