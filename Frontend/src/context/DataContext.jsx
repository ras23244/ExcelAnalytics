import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [uploads, setUploads] = useState(null); // null means "not loaded"
  const [charts, setCharts] = useState(null);

  // Call these after update/delete to force refetch
  const clearUploads = () => setUploads(null);
  const clearCharts = () => setCharts(null);

  return (
    <DataContext.Provider value={{
      uploads, setUploads, clearUploads,
      charts, setCharts, clearCharts
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  return useContext(DataContext);
}