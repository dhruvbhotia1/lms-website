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

export type CourseSchemaType = z.infer<typeof courseSchema>;
