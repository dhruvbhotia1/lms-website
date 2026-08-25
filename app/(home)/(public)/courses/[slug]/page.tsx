import { Badge } from "@/components/ui/badge";
import { userGetCourse } from "@/lib/user-get-course";
import {BookIcon, BoxesIcon, ChartBarIcon, CheckIcon, ChevronDown, TimerIcon} from "lucide-react";
import Image from "next/image"
import {Separator} from "@/components/ui/separator";
import {RenderDescription} from "@/components/rich-text-editor/RenderDescription";
import {Collapsible, CollapsibleTrigger, CollapsibleContent} from "@/components/ui/collapsible";
import {Card, CardContent} from "@/components/ui/card";
import {TbPlayerPlayFilled} from "react-icons/tb";
import {Button, buttonVariants} from "@/components/ui/button";
import {enrollInCourse} from "@/lib/courses/enroll-in-course";
import {checkIfCourseBought} from "@/lib/auth/user-is-enrolled";
import Link from "next/link";
import {EnrollmentButton} from "@/app/(home)/(public)/courses/[slug]/_components/EnrollmentButton";


type Params = Promise<{ slug: string }>;

export default async function UserCoursePage({ params }: { params: Params }) {

  const { slug } = await params;

  const course = await userGetCourse(slug);

  const isEnrolled = await checkIfCourseBought({courseId: course.id});

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">

      <div className="order-1 lg:col-span-2">

        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">

          <Image src={`${process.env.NEXT_PUBLIC_S3_BUCKET_DEVELOPMENT_URL}/${course.thumbnail}`} alt="" fill className="object-cover" priority />

          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent">
          </div>

        </div>

        <div className="mt-8 space-y-6">

          <div className="space-y-4">

            <h1 className={"text-primary font-semibold text-2xl"}>{course.title}</h1>
            <div>
              <RenderDescription json={JSON.parse(course.smallDescription)}/>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">

            <Badge className="flex items-center gap-1 p-3">
              <ChartBarIcon className="size-4!"/>
              <span className="font-semibold">{ course.level}</span>
            </Badge>

            <Badge className="flex items-center gap-1 p-3">
              <BoxesIcon className="size-4!"/>
              <span className="font-semibold">{course.category}</span>
            </Badge>

            <Badge className="flex items-center gap-1 p-3">
              <TimerIcon className="size-4!"/>
              <span className="font-semibold">{course.duration} hours</span>
            </Badge>
          </div>

          <Separator className={"my-8"}/>

          <div className={"space-y-6"}>

            <h2 className={"text-3xl font-semibold tracking-tight"}>Course Description</h2>

            <div>
              <RenderDescription json={JSON.parse(course.description)} />
            </div>
          </div>

          <div className={"mt-12 space-y-6"}>

            <div className={"flex items-center justify-between"}>

              <h2 className={"text-3xl font-semibold tracking-tight"}>Course Content</h2>

              <div>
                {course.chapters.length} chapters |{" "}
                {course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0) || 0} Lessons
              </div>

            </div>

            <div className={"space-y-4"}>

              {course.chapters.map((chapter,index) => (

                  <Collapsible key={chapter.id} defaultOpen={index === 0 }>

                    <Card className={"p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md"}>

                      <CollapsibleTrigger>

                        <div>
                          <CardContent className={"p-6 hover:bg-muted/50 transition-colors"}>

                            <div className={"flex items-center justify-between"}>
                              <div className={"flex items-center gap-4"}>
                                <p className={"flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold"}>{index + 1}</p>
                                <div className={"flex items-center gap-2"}>
                                  <h3 className={"text-xl font-semibold text-left"}>{chapter.title}</h3>
                                </div>
                              </div>

                              <div className={"flex items-center gap-3"}>

                                <Badge className="flex items-center gap-1 p-3">
                                  {chapter.lessons.length} lesson{chapter.lessons.length !== 1 ? "s" : ""}
                                </Badge>

                                <ChevronDown className={"size-5 text-muted-foreground"}/>
                              </div>
                            </div>

                          </CardContent>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className={"border-t bg-muted/20 rounded-b-lg"}>

                          <div className={"p-6 pt-4 space-y-3 bg-muted/20 rounded-lg"}>

                            {chapter.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className={"flex items-center justify-between"}>

                                  <p className={"p-3"}>{lesson.title}</p>
                                  <div className={"flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/50"}>
                                    <TbPlayerPlayFilled className={"size-4 text-muted-foreground group-hover:text-primary transition-colors"}/>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={"order-2 lg:col-span1"}>

        <div className={"sticky top-20"}>

          <Card className={"py-0"}>

            <CardContent className={"p-6"}>

              <div className={"flex items-center justify-between mb-6"}>
                <span className={"text-lg font-medium"}>Price </span>

                <span className={"text-2xl font-bold text-primary"}>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: "USD",
                }).format(course.price)}</span>
              </div>

              <div className={"gap-3 rounded-lg bg-muted p-4 mb-4"}>
                <h4 className={"font-medium mb-4"}>What you will get: </h4>
                <div className={"flex flex-col gap-3 space-y-3"}>

                  <div className={"flex items-center gap-2"}>
                    <div className={"flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"}>
                      <TimerIcon className="size-5!"/>
                    </div>

                    <div >
                      <p className={"text-sm font-medium"}>Course Duration</p>
                      <p className={"text-sm text-muted-foreground "}>{course.duration} hours</p>
                    </div>
                  </div>

                  <div className={"flex items-center gap-2"}>
                    <div className={"flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"}>
                      <ChartBarIcon className="size-5!"/>
                    </div>

                    <div >
                      <p className={"text-sm font-medium"}>Course Level</p>
                      <p className={"text-sm text-muted-foreground "}>{course.level}</p>
                    </div>
                  </div>

                  <div className={"flex items-center gap-2"}>
                    <div className={"flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"}>
                      <BoxesIcon className="size-5!"/>
                    </div>

                    <div >
                      <p className={"text-sm font-medium"}>Course Category</p>
                      <p className={"text-sm text-muted-foreground "}>{course.category}</p>
                    </div>
                  </div>

                  <div className={"flex items-center gap-2"}>
                    <div className={"flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"}>
                      <BookIcon className="size-5!"/>
                    </div>

                    <div >
                      <p className={"text-sm font-medium"}>Course Contents</p>
                      <p className={"text-sm text-muted-foreground"}>
                        {course.chapters.length} chapters |{" "}
                        {course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0) || 0} Lessons
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={"mb-6 space-y-3"}>
                <h4>This course includes!</h4>

                <ul className={"space-y-2"}>

                  <li className={"flex items-center gap-2 text-sm"}>
                    <div className={"rounded-full bg-green-500/10 text-green-500"}>
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Full lifetime access</span>
                  </li>

                  <li className={"flex items-center gap-2 text-sm"}>
                    <div className={"rounded-full bg-green-500/10 text-green-500"}>
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Access on mobile and desktop</span>
                  </li>

                  <li className={"flex items-center gap-2 text-sm"}>
                    <div className={"rounded-full bg-green-500/10 text-green-500"}>
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Certification of completion</span>
                  </li>

                </ul>

              </div>

              <form action={async () => {
                "use server"
                await enrollInCourse({courseId: course.id})
              }}>

                {
                  isEnrolled ? (
                      <Link href={"/dashboard"} className={buttonVariants({variant: 'default', className: "w-full font-semibold"})}>

                        Watch Now

                      </Link>
                  ) : (
                      <EnrollmentButton courseId={course.id}/>
                  )
                }

              </form>
              <p className={"mt-3 text-center text-xs text-muted-foreground"}>30-day money-back guaranteed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
