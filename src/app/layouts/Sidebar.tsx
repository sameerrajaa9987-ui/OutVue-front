import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight, TrendingUp, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/hooks";
import { MENU, type MenuItem } from "./menu";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();
  const role = useAppSelector((s) => s.auth.user?.role);
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (isActive(item.to)) return true;
    return item.children?.some(isItemActive) ?? false;
  };

  const filteredMenu = MENU.filter(
    (item) => !item.roles || (role && item.roles.includes(role)),
  );

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200",
        collapsed ? "w-[60px]" : "w-[240px]",
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary/20">
              <TrendingUp className="h-4 w-4 text-sidebar-primary" />
            </div>
            <div className="leading-none">
              <div className="text-sm font-bold tracking-tight">OUTVUE</div>
              <div className="text-[10px] text-sidebar-foreground/60">
                Growth Intelligence
              </div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {filteredMenu.map((section) => {
          const hasChildren = Boolean(section.children?.length);

          if (!hasChildren && section.to) {
            return (
              <NavLink key={section.label} to={section.to} end>
                {() => (
                  <div
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                      isActive(section.to)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                    title={collapsed ? section.label : undefined}
                  >
                    {section.icon && <section.icon className="h-4 w-4 shrink-0" />}
                    {!collapsed && <span>{section.label}</span>}
                  </div>
                )}
              </NavLink>
            );
          }

          if (hasChildren) {
            const sectionActive = isItemActive(section);
            const isOpen =
              openSections[section.label] ?? sectionActive;

            if (collapsed) {
              return (
                <div key={section.label} className="py-0.5" title={section.label}>
                  {section.icon && (
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-lg py-2 transition-colors",
                        sectionActive
                          ? "text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/60",
                      )}
                    >
                      <section.icon className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={section.label}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                    sectionActive
                      ? "text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      [section.label]: !isOpen,
                    }))
                  }
                >
                  {section.icon && <section.icon className="h-4 w-4 shrink-0" />}
                  <span className="flex-1 text-left">{section.label}</span>
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      isOpen && "rotate-90",
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2.5">
                    {section.children!
                      .filter((c) => c.to)
                      .map((child) => (
                        <NavLink key={child.label} to={child.to!} end>
                          {() => (
                            <div
                              className={cn(
                                "rounded-md px-2.5 py-1.5 text-[12.5px] transition-colors",
                                isActive(child.to)
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "text-sidebar-foreground/65 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/40",
                              )}
                            >
                              {child.label}
                            </div>
                          )}
                        </NavLink>
                      ))}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </nav>
    </aside>
  );
}
