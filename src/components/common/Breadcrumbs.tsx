import { Link } from 'react-router-dom';
import { MdChevronRight, MdHome } from 'react-icons/md';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors">
        <MdHome className="text-lg" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <MdChevronRight className="text-gray-400 dark:text-gray-500" />
          {item.path ? (
            <Link to={item.path} className="text-gray-500 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
