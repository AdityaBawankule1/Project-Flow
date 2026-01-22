import {
  Briefcase,
  Plus,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const ProjectsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">All Projects</h2>
        <Button icon={<Plus className="w-4 h-4" />}>New Project</Button>
      </div>
      <Card>
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects Page</h3>
          <p className="text-gray-600">Detailed projects view would go here</p>
        </div>
      </Card>
    </div>
  );
};

export default ProjectsPage;