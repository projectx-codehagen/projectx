"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

const breadcrumbNameMap: { [key: string]: string } = {
  "/dashboard": "Dashbord",
  "/company": "Bedrifter",
  "/people": "Personer",
  "/opportunities": "Opportunities",
  "/tasks": "Oppgaver",
  "/prospects": "Prospects",
  "/notes": "Notater",
  "/kanban": "Kanban",
  "/settings": "Innstillinger",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Hjem</BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          let breadcrumbName = breadcrumbNameMap[href] || segment;

          // If it's an ID (like in your company example), use a generic name
          if (segment.length === 36 && segment.includes("-")) {
            breadcrumbName = "Detaljer";
          }

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{breadcrumbName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{breadcrumbName}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
