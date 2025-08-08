import { useState, useEffect, useMemo } from "react";
import "./App.css";
import ImageWithLoader from "./components/ImageWithLoader";

interface User {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: {
    url: string;
  };
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState("");

  const fetchUsers = async () => {
    try {
      const userResponse = await fetch(
        "https://fakerapi.it/api/v2/custom?_quantity=20&_locale=cs_CZ&uuid=uuid&first_name=firstName&last_name=lastName&email=email&avatar=image"
      );
      const userResponseJson = await userResponse.json();
      setUsers(userResponseJson.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const lowerCaseFilter = filter.toLowerCase();

        return (
          user.first_name.toLowerCase().includes(lowerCaseFilter) ||
          user.last_name.toLowerCase().includes(lowerCaseFilter) ||
          user.email.toLowerCase().includes(lowerCaseFilter)
        );
      }),
    [users]
  );

  return (
    <div className="App">
      <header>
        <h1>User List</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Filter by name or email"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </header>
      <main>
        <section>

        {filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map((user) => (
              <li key={user.uuid}>
                <ImageWithLoader
                  src={`${user.avatar.url}?random=${user.uuid}`}
                  alt={`${user.first_name} ${user.last_name}`}
                  />
                <div>
                  <p>
                    {user.first_name} {user.last_name}
                  </p>
                  <p>{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
        </section>
      </main>
    </div>
  );
}

export default App;
