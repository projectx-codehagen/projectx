import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type EmptyPlaceholderProps = React.HTMLAttributes<HTMLDivElement>;

export function EmptyPlaceholder({
  className,
  children,
  ...props
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

interface EmptyPlaceholderIconProps
  extends Partial<React.SVGProps<SVGSVGElement>> {
  icon: LucideIcon;
}

EmptyPlaceholder.Icon = function EmptyPlaceHolderIcon({
  icon: Icon,
  className,
  ...props
}: EmptyPlaceholderIconProps) {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
      <Icon className={cn("h-10 w-10", className)} {...props} />
    </div>
  );
};

type EmptyPlacholderTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: EmptyPlacholderTitleProps) {
  return (
    <h2 className={cn("mt-6 text-xl font-semibold", className)} {...props} />
  );
};

type EmptyPlaceholderDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: EmptyPlaceholderDescriptionProps) {
  return (
    <p
      className={cn(
        "mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
