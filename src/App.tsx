/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import JournalEntry from "./components/JournalEntry";
import AnalysisWorkspace from "./components/AnalysisWorkspace";
import Goals from "./components/Goals";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/entry/:id" 
            element={
              <ProtectedRoute>
                <JournalEntry />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analyze" 
            element={
              <ProtectedRoute>
                <AnalysisWorkspace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analyze/:id" 
            element={
              <ProtectedRoute>
                <AnalysisWorkspace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/goals" 
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
