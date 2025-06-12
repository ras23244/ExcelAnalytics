import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import UploadExcel from "./components/UploadExcel";
import ChartGenerator from "./components/ChartGenerator";
import AnalysisHistory from "./components/AnalysisHistory";
import AdminPanel from "./components/AdminPanel";
import Signout from "./components/Signout";
import Signup from "./components/Signup";
import Login from "./components/Login";
import "./App.css";
import UserContext from "./context/userContext";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import AdminProtectWrapper from "./pages/AdminProtectWrapper";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <UserContext>
      <DataProvider>
        <Router>
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route
                  path="/"
                  element={
                    <UserProtectWrapper>
                      <Dashboard />
                    </UserProtectWrapper>
                  }
                />
                <Route
                  path="/upload"
                  element={
                    <UserProtectWrapper>
                      <UploadExcel />
                    </UserProtectWrapper>
                  }
                />

                <Route
                  path="/chart-generator"
                  element={
                    <UserProtectWrapper>
                      <ChartGenerator />
                    </UserProtectWrapper>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <UserProtectWrapper>
                      <AnalysisHistory />
                    </UserProtectWrapper>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminProtectWrapper>
                      <AdminPanel />
                    </AdminProtectWrapper>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route
                  path="/signout"
                  element={
                    <UserProtectWrapper>
                      <Signout />
                    </UserProtectWrapper>
                  }
                />
              </Routes>
            </div>
          </div>
        </Router>
      </DataProvider>
    </UserContext>
  );
}

export default App;
