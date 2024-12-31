import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ambulance, Clock, AlertCircle, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/50">
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8" />
          Admin Dashboard
        </h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Ambulances
              </CardTitle>
              <Ambulance className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">12</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">3</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Response Time
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">8.5 min</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Emergency Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">#1234</TableCell>
                  <TableCell>123 Main St</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      In Progress
                    </span>
                  </TableCell>
                  <TableCell>5 mins ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#1233</TableCell>
                  <TableCell>456 Oak Ave</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Completed
                    </span>
                  </TableCell>
                  <TableCell>15 mins ago</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
