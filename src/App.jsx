import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Clients from "./pages/Clients";

const App = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const user = {
    name: "Aditya Bawankule",
    role: "Frontend Developer",
    initials: "AB",
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "projects":
        return <Projects />;
      case "clients":
        return <Clients />;
      default:
        return <Dashboard />;
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-8">{renderPage()}</main>
      </div>
    </div>
  );
};

export default App;
