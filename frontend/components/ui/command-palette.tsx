"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  placeholder?: string;
}

function CommandPalette({
  open,
  onOpenChange,
  children,
  placeholder = "Type a command or search...",
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl sm:max-w-[520px]">
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <CommandPrimitive
          className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-cream"
          loop
        >
          <div className="flex items-center border-b border-[var(--border)] px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <CommandPrimitive.Input
              placeholder={placeholder}
              className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="ml-2 rounded-md p-1 text-muted-foreground hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <CommandPrimitive.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <CommandPrimitive.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </CommandPrimitive.Empty>
            {children}
          </CommandPrimitive.List>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  );
}

const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden py-1",
      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = "CommandGroup";

const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    shortcut?: string;
  }
>(({ className, shortcut, children, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-lg px-2 py-2 text-sm outline-none",
      "data-[selected=true]:bg-[var(--muted)] data-[selected=true]:text-ink",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    {shortcut && (
      <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        {shortcut}
      </kbd>
    )}
  </CommandPrimitive.Item>
));
CommandItem.displayName = "CommandItem";

const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-[var(--border)]", className)}
    {...props}
  />
));
CommandSeparator.displayName = "CommandSeparator";

export { CommandPalette, CommandGroup, CommandItem, CommandSeparator };
