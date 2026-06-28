import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, Printer } from "lucide-react";

export function SectionActions({
  onExport,
  onPrint,
}: {
  onExport?: () => void;
  onPrint?: () => void;
} = {}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MoreHorizontal size={14} />
          <span className="hidden sm:inline">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        <DropdownMenuItem onClick={onExport ?? (() => window.print())}>
          <Download size={14} className="mr-2" /> Export
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPrint ?? (() => window.print())}>
          <Printer size={14} className="mr-2" /> Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
