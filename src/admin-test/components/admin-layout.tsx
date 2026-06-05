import { Outlet } from 'react-router';

import { AdminAside } from './admin-aside';
import { AdminHeader } from './admin-header';

export const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AdminAside />

      <div className="flex min-h-0 flex-1 flex-col">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="mx-auto h-full w-full max-w-[120rem] px-[3.625rem] py-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
