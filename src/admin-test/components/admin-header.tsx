import { useLocation } from 'react-router';

import { ADMIN_ROUTE_LABELS } from '../constants/admin-route-labels';

export const AdminHeader = () => {
  const location = useLocation();

  const getRouteLabel = (pathname: string) => {
    const matched = Object.keys(ADMIN_ROUTE_LABELS)
      .filter((route) => pathname.startsWith(route))
      .sort((a, b) => b.length - a.length)[0];

    return ADMIN_ROUTE_LABELS[matched] ?? { main: '' };
  };

  const { main } = getRouteLabel(location.pathname);

  return (
    <header className="flex h-[4.5rem] w-full items-center bg-white px-6">
      <h2 className="text-lg font-semibold">{main}</h2>
    </header>
  );
};
