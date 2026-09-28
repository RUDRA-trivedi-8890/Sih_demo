"use client";
import { useState } from "react";
import TopBar from "./components/TopBar";
import Sidebar, { PageKey } from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import ProjectDetail from "./components/ProjectDetail";
import Pipeline from "./components/Pipeline";
import DataLayers from "./components/DataLayers";
import MCPPage from "./components/MCPPage";
import Impact from "./components/Impact";
import Challenges from "./components/Challenges";
import References from "./components/References";

export default function Home() {
  const [page, setPage] = useState<PageKey>("landing");
  const [projectId, setProjectId] = useState<string | null>(null);

  const handleSelectProject = (id: string) => {
    setProjectId(id);
    setPage("project");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (k: PageKey) => {
    setPage(k);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <TopBar />
      <div className="max-w-[1600px] mx-auto px-6 py-6 flex gap-6">
        <Sidebar current={page} onNavigate={handleNavigate} />
        <main className="flex-1 min-w-0">
          {page === "landing" && <LandingPage onNavigate={handleNavigate} />}
          {page === "dashboard" && (
            <Dashboard onSelectProject={handleSelectProject} />
          )}
          {page === "project" && projectId && (
            <ProjectDetail
              projectId={projectId}
              onBack={() => handleNavigate("dashboard")}
            />
          )}
          {page === "pipeline" && <Pipeline />}
          {page === "data" && <DataLayers />}
          {page === "mcp" && <MCPPage />}
          {page === "impact" && <Impact />}
          {page === "challenges" && <Challenges />}
          {page === "references" && <References />}
        </main>
      </div>
    </>
  );
}