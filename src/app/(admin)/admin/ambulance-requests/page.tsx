import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AmbulanceRequests() {
  const requests = [
    {
      id: 1,
      requester: "John Doe",
      location: "123 Main St",
      status: "Pending",
    },
    {
      id: 2,
      requester: "Jane Smith",
      location: "456 Elm St",
      status: "In Progress",
    },
    {
      id: 3,
      requester: "Bob Johnson",
      location: "789 Oak St",
      status: "Completed",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ambulance Requests</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requester</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.requester}</TableCell>
              <TableCell>{request.location}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
