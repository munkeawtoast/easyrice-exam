import { Link } from 'react-router-dom';

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="w-full py-2 items-center px-6 text-xl bg-gray-200 backdrop-blur flex">
      <Link className="contents" to="/history">
        <div className="mr-6 p-2  text-2xl">EASYRICE TEST</div>
      </Link>
      <Link className="contents" to="/standard">
        <div className="p-2 mr-4">Create Inspection</div>
      </Link>
      <Link className="contents" to="/history">
        <div className="p-2 mr-4">History</div>
      </Link>
    </nav>
  );
};

export default Navbar;
