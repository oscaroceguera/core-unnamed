import { Card } from "@repo/ui/Card";

type User = {
  country: string;
  email: string;
  fullname: string;
  id: string;
};

type DatabaseCardProps = {
  users: User[];
};

export function DatabaseCard(props: DatabaseCardProps) {
  const { users } = props;
  return (
    <Card title="Database consult" color="tertiary">
      {users.map((user) => (
        <ul key={user.id}>
          <li>ID: {user.id}</li>
          <li>Fullname: {user.fullname}</li>
          <li>Email: {user.email}</li>
        </ul>
      ))}
    </Card>
  );
}
