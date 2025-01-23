import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Ambulance() {
  const ambulances = [
    {
      id: 1,
      number: "AMB-001",
      status: "Available",
      location: "City Hospital",
    },
    { id: 2, number: "AMB-002", status: "On Duty", location: "Downtown" },
    {
      id: 3,
      number: "AMB-003",
      status: "Maintenance",
      location: "Service Center",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ambulance Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ambulance Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ambulances.map((ambulance) => (
            <TableRow key={ambulance.id}>
              <TableCell>{ambulance.number}</TableCell>
              <TableCell>{ambulance.status}</TableCell>
              <TableCell>{ambulance.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
