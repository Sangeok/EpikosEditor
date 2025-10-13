import { ProjectPersistenceService } from "@/shared/lib/projectPersistence";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import { Circle, CircleOff, Trash, X } from "lucide-react";
import { SavedProject } from "@/shared/lib/indexedDB";

interface SelectModeButtonsProps {
  selectedProjects: string[];
  setSelectedProjects: (projects: string[]) => void;
  setShowSelectMode: (show: boolean) => void;
  refetch: () => void;
  projects: SavedProject[];
}

export default function SelectModeButtons({
  selectedProjects,
  setSelectedProjects,
  setShowSelectMode,
  refetch,
  projects,
}: SelectModeButtonsProps) {
  const isAllSelected = selectedProjects.length === projects.length;

  const handleSelectAll = () => {
    setSelectedProjects(projects.map((project) => project.id));
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedProjects.length} selected project(s)?`
    );
    if (confirmDelete) {
      try {
        await Promise.all(
          selectedProjects.map((projectId) =>
            ProjectPersistenceService.deleteProject(projectId)
          )
        );
        setSelectedProjects([]);
        refetch(); // Refresh the projects list
      } catch (error) {
        console.error("Failed to delete projects:", error);
        alert("Failed to delete some projects. Please try again.");
      }
    }
  };

  const handleCancelSelect = () => {
    setShowSelectMode(false);
    setSelectedProjects([]);
  };

  return (
    <div className="flex gap-2">
      {projects.length !== 0 && isAllSelected && (
        <Button
          variant="light"
          className="flex items-center gap-2"
          onClick={() => {
            setSelectedProjects([]);
          }}
        >
          <CircleOff size={16} /> Deselect All
        </Button>
      )}
      {!isAllSelected && (
        <Button
          variant="light"
          className="flex items-center gap-2"
          onClick={handleSelectAll}
        >
          <Circle size={16} /> Select All
        </Button>
      )}
      <Button
        onClick={handleDelete}
        variant="light"
        className="flex items-center gap-2"
        disabled={selectedProjects.length === 0}
      >
        <Trash size={16} /> Delete ({selectedProjects.length})
      </Button>
      <Button
        onClick={handleCancelSelect}
        variant="light"
        className="flex items-center gap-2"
      >
        <X size={16} /> Cancel Select
      </Button>
    </div>
  );
}
