"use client";

import { useState } from "react";
import { ProjectProvider, useProjects } from "./lib/store";
import TopBar from "./components/TopBar";
import Sidebar, { PageKey } from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import ProjectDetail from "./components/ProjectDetail";
import AboutPlatform, { AboutTab } from "./components/AboutPlatform";
import Login from "./components/Login";
import AddProjectModal from "./components/AddProjectModal";

function AppContent() {
  const { user, selectedProjectId, setSelectedProjectId } = useProjects();
  const [page, setPage] = useState<PageKey>("landing");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Task 1: If no user logged in, render Login page
  if (!user) {
    return (
      <>
        <TopBar />
        <Login />
      </>
    );
  }

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setPage("project");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (k: PageKey) => {
    setPage(k);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddProjectSuccess = (newProjectId: string) => {
    handleSelectProject(newProjectId);
  };

  return (
    <>
      <TopBar />
      <div className="max-w-[1600px] mx-auto px-6 py-6 flex gap-6">
        <Sidebar
          current={page}
          onNavigate={handleNavigate}
          onOpenAddProject={() => setIsAddModalOpen(true)}
        />
        <main className="flex-1 min-w-0">
          {page === "landing" && <LandingPage onNavigate={handleNavigate} />}
          {page === "dashboard" && (
            <Dashboard onSelectProject={handleSelectProject} />
          )}
          {page === "project" && selectedProjectId && (
            <ProjectDetail
              projectId={selectedProjectId}
              onBack={() => handleNavigate("dashboard")}
            />
          )}
          {(page === "about" ||
            page === "pipeline" ||
            page === "data" ||
            page === "mcp" ||
            page === "impact" ||
            page === "challenges" ||
            page === "references") && (
            <AboutPlatform
              initialTab={
                (page === "pipeline" ||
                page === "data" ||
                page === "mcp" ||
                page === "impact" ||
                page === "challenges" ||
                page === "references"
                  ? page
                  : "all") as AboutTab
              }
            />
          )}
        </main>
      </div>

      {/* Task 3 & 11: Global Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddProjectSuccess}
      />
    </>
  );
}

export default function Home() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}