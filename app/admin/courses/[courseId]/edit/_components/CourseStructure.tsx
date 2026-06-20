"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/react/sortable";

interface SortableProps {
  id: number;
  index: number;
}

function Sortable({ id, index }: SortableProps) {
  const { ref } = useSortable({ id, index });

  return (
    <li ref={ref} className="item cursor-pointer p-4">
      Item {id}
    </li>
  );
}

export function CourseStructure() {
  const items = [1, 2, 3, 4];

  return (
    <DndContext collisionDetection={rectIntersection}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Chapter 1</CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="list">
            {items.map((id, index) => (
              <Sortable key={id} id={id} index={index} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </DndContext>
  );
}
