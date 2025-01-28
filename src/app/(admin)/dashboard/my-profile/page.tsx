import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MyProfile() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <form className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="Admin User" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="admin@example.com" />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input id="role" defaultValue="Super Admin" disabled />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  );
}
