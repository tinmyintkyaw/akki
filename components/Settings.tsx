import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

const SettingsComponent: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <ScrollArea className="h-full w-full">
      <div className="h-full w-full py-6">
        <div className="mb-5 flex pr-1">
          <div className="max-w-lg flex-grow pr-4 text-start">
            <h2 className="font-medium">Color Theme</h2>
            <p className="text-xs text-muted-foreground">
              Choose a color theme
            </p>
          </div>

          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* <div className="mb-5 flex pr-1">
          <div className="max-w-lg flex-grow pr-4 text-start">
            <h2 className="font-medium">Editor Width</h2>
            <p className="text-xs text-muted-foreground">
              Choose a editor width
            </p>
          </div>

          <Select defaultValue="default">
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="full">Full Width</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>
    </ScrollArea>
  );
};

export default SettingsComponent;
