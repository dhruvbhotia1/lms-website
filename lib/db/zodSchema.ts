import { z } from "zod";
import { CourseCategory, CourseLevel, CourseStatus } from "@/generated/prisma/enums";

export const courseLevel = Object.values(CourseLevel);

export const courseStatus = Object.values(CourseStatus);

export const courseCategories = Object.values(CourseCategory);

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title should be at least 3 characters long." })
    .max(100, { message: "Title should not be longer than 100 characters" }),
  description: z
    .string()
    .min(3, { message: "Description should be at least 3 characters long." }),
  fileKey: z.string().min(1, { message: "File Key should be at least 3 characters long." }),
  price: z.number().min(1, { message: "Price should be larger than 1 USD." }),
  duration: z
    .number()
    .min(1, { message: "Duration should be at least 1 hour." })
    .max(500, { message: "Duration must not exceed 500 hours." }),
  level: z.enum(CourseLevel, { message: "Level is required." }),
  category: z.enum(CourseCategory, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(10, {
      message: "Small description should be at least 100 characters long.",
    })
    .max(250, {
      message: "Small description must not exceed 500 character length.",
    }),
  status: z.enum(CourseStatus),
  slug: z.string().min(1),
  thumbnail: z.string().min(1),
});


export const chapterSchema = z.object({
  name: z.string().min(3, { message: "Chapter name should be at least 3 characters long." }),
  courseId: z.string().uuid({ message: "invalid course id" }),

})

export const lessonSchema = z.object({
  title: z.string().min(3, { message: "Lesson name should be at least 3 characters long." }),
  chapterId: z.string().uuid({ message: "invalid chapter id" }),
  courseId: z.string().uuid({ message: "invalid course id" }),
  description: z.string().optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
})

export const changeEmailSchema = z.object({
  oldEmail: z.string().min(3),
  newEmail: z.string().min(3),
})

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),

})

export const changeNameSchema = z.object({
  oldName: z.string().min(6),
  newName: z.string().min(6),
})

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
export type ChangeEmailSchemaType = z.infer<typeof changeEmailSchema>;
export type ChangeNameSchemaType = z.infer<typeof changeNameSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;


