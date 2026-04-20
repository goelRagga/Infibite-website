declare module 'custom-breadcrum' {
  export type BreadcrumbItem = {
    href: string;
    label: string;
  };

  interface BreadcrumProps {
    items: BreadcrumbItem[];
    className?: string;
  }
}
