import { users } from "@repo/mock-data";
import { Card } from "@repo/ui/Card";

export function MockDataCard() {
  return (
    <Card title="Mock data (users)" color="secondary">
      {users.map((user) => (
        <ul key={user.id} className="border p-1 my-2 rounded bg-olive-900">
          <li>
            <span className="text-purple-400">Name:</span> <span className="text-blue-500">{user.firstName} {user.lastName}</span>
          </li>
          <li><span className="text-purple-400">Email:</span> <span className="text-blue-500">{user.email}</span></li>
          <li><span className="text-purple-400">Role:</span> <span className="text-blue-500">{user.role}</span></li>
        </ul>
      ))}
    </Card>
  );
}
