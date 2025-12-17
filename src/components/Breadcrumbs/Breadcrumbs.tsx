import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Icon from "@phosphor-icons/react";

interface Crumb {
  path: string;
  label: string;
  icon?: JSX.Element;
}

interface BreadcrumbsProps {
  headerConfig: Record<string, { title: string; icon?: JSX.Element }>;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ headerConfig }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.replace(/^\/app\//, "").split("/").filter(Boolean);

  // Rotas que devem ter o breadcrumb virtual "Análise de amostra"
  const virtualParentsRoutes = [
    "my-samples/compare-participants-selected",
    "my-samples/seconds-source-compare",
    "my-samples/evaluate-autobiography",
  ];

  const virtualParentCrumb: Crumb = {
    path: "",
    label: "Análise de amostra",
    icon: <Icon.MagnifyingGlass size={20} />,
  };

  let crumbs: Crumb[] = pathnames.map((segment, index) => {
    const path = "/app/" + pathnames.slice(0, index + 1).join("/");
    const config = headerConfig[pathnames.slice(0, index + 1).join("/")] || { title: segment };
    return { path, label: config.title, icon: config.icon };
  });

  const currentPath = location.pathname.replace(/^\/app\//, "");


  if (virtualParentsRoutes.includes(currentPath)) {

    const lastCrumb = crumbs.pop();
    crumbs.push(virtualParentCrumb);
    if (lastCrumb) crumbs.push(lastCrumb);
  }

  return (
    <nav className="flex items-center space-x-2 text-[12px] mt-1 desktop-flex">
      <Link
        to="/app/home"
        className={`flex items-center gap-1 hover:underline ${location.pathname === "/app/home" ? "text-primary font-bold" : "text-gray-500"
          }`}
      >
        <Icon.SquaresFour
          size={20}
          weight="duotone"
          className={location.pathname === "/app/home" ? "text-primary" : "text-gray-400"}
        />
        Dashboard
      </Link>

      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        const isVirtual = crumb === virtualParentCrumb;
        const active = location.pathname === crumb.path;

        return (
          <span key={idx} className="flex items-center gap-1">
            <span className="text-gray-400">/</span>

            {isLast ? (
              <span className="flex items-center gap-1 text-primary font-bold truncate">

                {crumb.label === "home" ? '' : crumb.label}
              </span>
            ) : isVirtual ? (
              <span
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 hover:underline cursor-pointer text-gray-500"
              >
                {crumb.icon && React.cloneElement(crumb.icon, { className: "w-4 h-4 text-gray-400" })}
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className={`flex items-center gap-1 hover:underline ${active ? "text-primary font-bold" : "text-gray-500"
                  }`}
              >
                {crumb.icon &&
                  React.cloneElement(crumb.icon, {
                    className: active ? "text-primary w-4 h-4" : "text-gray-400 w-4 h-4",
                  })}
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};
