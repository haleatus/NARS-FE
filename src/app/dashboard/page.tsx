import Link from "next/link";
import React from "react";

const DashboardPage = () => {
  return (
    <div>
      Dashboard
      <div>
        <Link href="/dashboard/users" className="text-blue-500">
          Users
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
