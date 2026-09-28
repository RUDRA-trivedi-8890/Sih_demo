"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PROJECTS as INITIAL_PROJECTS, Project, RiskBand } from "./mockData";
import { runFullPrediction, generateMonthlyRecords } from "./predict";

export type Role = "contractor" | "officer" | "admin";

export interface User {
  username: string;
  role: Role;
  name: string;
}

export const DEMO_USERS: Record<string, { pass: string; user: User }> = {
  contractor: {
    pass: "1234",
    user: { username: "contractor", role: "contractor", name: "Contractor Rep" },
  },
  officer: {
    pass: "1234",
    user: { username: "officer", role: "officer", name: "Nodal Officer" },
  },
  admin: {
    pass: "1234",
    user: { username: "admin", role: "admin", name: "System Administrator" },
  },
};

export interface NewProjectInput {
  name: string;
  ministry: string;
  sector: string;
  state: string;
  sanctionedCostCr: number;
  spentCr: number;
  physicalProgressPct: number;
  milestonesCompleted?: number;
  milestonesTotal?: number;
  originalDeadline: string;
  revisedDeadline: string;
  landAcquisitionLag?: boolean;
}

interface ProjectContextType {
  projects: Project[];
  user: User | null;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  login: (username: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  addProject: (input: NewProjectInput) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  getProjectById: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY_PROJECTS = "sih_projects_store_v1";
const STORAGE_KEY_USER = "sih_user_store_v1";

// Enrich initial static projects through our prediction engine
function enrichProjects(rawList: Project[]): Project[] {
  return rawList.map((p) => {
    const pred = runFullPrediction({
      sanctionedCostCr: p.sanctionedCostCr,
      spentCr: p.spentCr,
      physicalProgressPct: p.physicalProgressPct,
      sector: p.sector,
      state: p.state,
    });

    const financialPct = Math.min(Math.round((p.spentCr / Math.max(p.sanctionedCostCr, 1)) * 100), 100);

    return {
      ...p,
      predictedCostOverrunPct: pred.predictedCostOverrunPct,
      predictedDelayMonths: pred.predictedDelayMonths,
      riskScore: pred.riskScore,
      riskBand: pred.riskBand,
      shapDrivers: pred.shapDrivers,
      financialProgressPct: financialPct,
      monthlyRecords: p.monthlyRecords?.length ? p.monthlyRecords : generateMonthlyRecords(p.physicalProgressPct, financialPct, pred.predictedCostOverrunPct),
    };
  });
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => enrichProjects(INITIAL_PROJECTS));
  const [user, setUser] = useState<User | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>("SIH-PRJ-001");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
        }
      }
    } catch (e) {
      console.error("Error loading state from localStorage", e);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error("Error saving projects", e);
    }
  }, [projects, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error("Error saving user", e);
    }
  }, [user, isInitialized]);

  const login = (username: string, pass: string) => {
    const found = DEMO_USERS[username.toLowerCase()];
    if (found && found.pass === pass) {
      setUser(found.user);
      return { success: true };
    }
    return { success: false, message: "Invalid credentials. Try contractor/1234, officer/1234, or admin/1234." };
  };

  const logout = () => {
    setUser(null);
  };

  const addProject = (input: NewProjectInput): Project => {
    const nextNum = projects.length + 1;
    const id = `SIH-PRJ-${String(nextNum).padStart(3, "0")}`;

    const pred = runFullPrediction({
      sanctionedCostCr: input.sanctionedCostCr,
      spentCr: input.spentCr,
      physicalProgressPct: input.physicalProgressPct,
      sector: input.sector,
      state: input.state,
      milestonesCompleted: input.milestonesCompleted,
      milestonesTotal: input.milestonesTotal,
      landAcquisitionLag: input.landAcquisitionLag,
    });

    const financialPct = Math.min(Math.round((input.spentCr / Math.max(input.sanctionedCostCr, 1)) * 100), 100);

    const newProject: Project = {
      id,
      name: input.name,
      ministry: input.ministry,
      sector: input.sector,
      state: input.state,
      sanctionedCostCr: input.sanctionedCostCr,
      spentCr: input.spentCr,
      physicalProgressPct: input.physicalProgressPct,
      financialProgressPct: financialPct,
      originalDeadline: input.originalDeadline || "31 Dec 2026",
      revisedDeadline: input.revisedDeadline || "30 Jun 2027",
      predictedCostOverrunPct: pred.predictedCostOverrunPct,
      predictedDelayMonths: pred.predictedDelayMonths,
      riskScore: pred.riskScore,
      riskBand: pred.riskBand,
      shapDrivers: pred.shapDrivers,
      monthlyRecords: generateMonthlyRecords(input.physicalProgressPct, financialPct, pred.predictedCostOverrunPct),
    };

    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(id);
    return newProject;
  };

  const updateProject = (id: string, patch: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...patch };
        const pred = runFullPrediction({
          sanctionedCostCr: updated.sanctionedCostCr,
          spentCr: updated.spentCr,
          physicalProgressPct: updated.physicalProgressPct,
          sector: updated.sector,
          state: updated.state,
        });
        const financialPct = Math.min(
          Math.round((updated.spentCr / Math.max(updated.sanctionedCostCr, 1)) * 100),
          100
        );

        return {
          ...updated,
          predictedCostOverrunPct: pred.predictedCostOverrunPct,
          predictedDelayMonths: pred.predictedDelayMonths,
          riskScore: pred.riskScore,
          riskBand: pred.riskBand,
          shapDrivers: pred.shapDrivers,
          financialProgressPct: financialPct,
          monthlyRecords: generateMonthlyRecords(updated.physicalProgressPct, financialPct, pred.predictedCostOverrunPct),
        };
      })
    );
  };

  const getProjectById = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        user,
        selectedProjectId,
        setSelectedProjectId,
        login,
        logout,
        addProject,
        updateProject,
        getProjectById,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return ctx;
}
