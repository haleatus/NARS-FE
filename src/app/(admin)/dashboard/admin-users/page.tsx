import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AdminUsers() {
  const adminUsers = [
    {
      id: 1,
      name: "Admin One",
      email: "admin1@example.com",
      role: "Super Admin",
    },
    { id: 2, name: "Admin Two", email: "admin2@example.com", role: "Admin" },
    {
      id: 3,
      name: "Admin Three",
      email: "admin3@example.com",
      role: "Moderator",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin User Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminUsers.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.role}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit Permissions
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
