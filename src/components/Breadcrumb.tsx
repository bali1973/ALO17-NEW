import Link from 'next/link';

export interface BreadcrumbSegment {
  name: string;
  href?: string;
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ segments }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1 text-sm text-gray-600">
        <li>
          <Link href="/" className="block transition hover:text-gray-700"> Ana Sayfa </Link>
        </li>
        {segments && segments.map((segment, index) => (
          <li key={index} className="flex items-center gap-1">
            <div className="rtl:rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {segment.href ? (
              <Link href={segment.href} className="block transition hover:text-gray-700"> {segment.name} </Link>
            ) : (
              <span className="block transition text-gray-700"> {segment.name} </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 