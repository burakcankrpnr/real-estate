import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href: string;
}

const AdminBreadcrumb = ({
  pageName,
  breadcrumbItems,
}: {
  pageName: string;
  breadcrumbItems: BreadcrumbItem[];
}) => {
  return (
    <div className="flex items-center py-2">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="mx-1 h-4 w-4 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {index === breadcrumbItems.length - 1 ? (
                <span className="font-medium text-primary dark:text-primary-light">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default AdminBreadcrumb; 