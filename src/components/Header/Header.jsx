import { Link } from 'react-router-dom';
import './Header.css';
import headerLogo from '../../img/headerlogo.svg';

export default function Header(props) {
  return (
    <header>
      <img className="logo" src={headerLogo} alt="logo" />
      <nav>
        <ul className="nav_links">
          <li>
            <Link to={`/cars/${props.userID}`}><a href="index.html">Car List</a></Link>
          </li>
        </ul>
      </nav>
      <Link to={`/`} className='contact-button'><button className='contact-b'>Log Out</button></Link>
      
    </header>
  );
}


// import { Link } from 'react-router-dom';
// import './Header.css';
// import headerLogo from '../../img/headerlogo.svg';

// export default function Header() {
//   return (
//     <header>
//       <Link to="/">
//         <img className="logo" src={headerLogo} alt="logo" />
//       </Link>
//       <nav>
//         <ul className="nav-links">
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//         </ul>
//       </nav>
//       <Link to="/contact" className="contact-btn">
//         <button className="logout-btn">Log Out</button>
//       </Link>
//     </header>
//   );
// }
