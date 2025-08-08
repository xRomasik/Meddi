import { useState} from "react";
import ImageWithLoader from "./components/ImageWithLoader";
import { useFetch } from "./hooks/useFecth";
import "./App.css";

type FakerApiResponse = {
  data: User[];
};

type User = {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: {
    url: string;
  };
};

function App() {
  const [filter, setFilter] = useState("");
  const { data, isError, isLoading } = useFetch<FakerApiResponse>(
    "https://fakerapi.it/api/v2/custom?_quantity=20&_locale=cs_CZ&uuid=uuid&first_name=firstName&last_name=lastName&email=email&avatar=image"
  );

  if (isLoading) {
    return <div className="loading-container">Loading ...</div>;
  }

  if (isError) {
    return <div className="error-container">Error</div>;
  }

  const { data: users } = data;

  const filteredUsers = users.filter((user) => {
    const lowerCaseFilter = filter.toLowerCase();

    return (
      user.first_name.toLowerCase().includes(lowerCaseFilter) ||
      user.last_name.toLowerCase().includes(lowerCaseFilter) ||
      user.email.toLowerCase().includes(lowerCaseFilter)
    );
  });

  return (
    <div className="App">
      <header>
        <h1>User List</h1>
        <div className="controls">
          <label htmlFor="filter-input" className="sr-only">
            Filter by name or email
          </label>
          <input
            id="filter-input"
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
