
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {getDashboardStats} from "@/lib/publisher-get-dashboard-stats";

export async function SectionCards() {

  const {totalCourses, totalCustomers, totalRevenue} = await getDashboardStats()

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card border border-primary">
        <CardHeader>
          <CardDescription>Total courses created</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCourses}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className={"text-muted-foreground"}>This includes public, drafts, and archived courses too.</p>
        </CardFooter>
      </Card>

      <Card className="@container/card border border-primary">
        <CardHeader>
          <CardDescription>Total Signups</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCustomers}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className={"text-muted-foreground pb-2"}>Total signups on all your courses.</p>
        </CardFooter>
      </Card>

      <Card className="@container/card border border-primary">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalRevenue}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className={"text-muted-foreground"}>Your revenue, please access your stripe dashboard for more information.</p>
        </CardFooter>
      </Card>

      <Card className="@container/card border border-primary">
        <CardHeader>
          <CardDescription>All Channels</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            yet to display
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className={"text-muted-foreground"}>All the channels you have created.</p>
        </CardFooter>
      </Card>

    </div>
  )
}
