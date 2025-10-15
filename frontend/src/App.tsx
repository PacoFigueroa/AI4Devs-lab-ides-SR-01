import React, { useState } from "react";
import CandidateForm from "./components/CandidateForm";
import CandidateList from "./components/CandidateList";
import "./App.css";

type View = "list" | "form";

function App() {
  const [currentView, setCurrentView] = useState<View>("list");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleShowForm = () => {
    setCurrentView("form");
  };

  const handleShowList = () => {
    setCurrentView("list");
  };

  const handleFormSuccess = () => {
    // Refresh the list and go back to it
    setRefreshTrigger((prev) => prev + 1);
    setCurrentView("list");
  };

  return (
    <div className="App">
      {currentView === "list" ? (
        <CandidateList
          onAddNew={handleShowForm}
          refreshTrigger={refreshTrigger}
        />
      ) : (
        <CandidateForm
          onSuccess={handleFormSuccess}
          onCancel={handleShowList}
        />
      )}
    </div>
  );
}

export default App;
