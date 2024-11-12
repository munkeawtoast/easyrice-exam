import { Outlet } from 'react-router-dom';
import Navbar from './navbar';

export function NavbarWrapper() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
