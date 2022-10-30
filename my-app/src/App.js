import './App.css';
import CreateAsset from './components/creatAsset/createAsset';
import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import NavBar from './components/NavBar/Navbar';
import MarketPlace from './components/MarketPlace/market';
import DashBoard from './components/DashBoard/dashBoard';
import Errorpage from './components/ErrorPage/errorpage';

const App = () => {
  return (
    <div className='body'>
      <Router>
        {/* <Link to='/signUp'><Button className='btn'>SignUp</Button></Link> */}
        <Routes>
          <Route path='/market/:userAddress' element={<MarketPlace />}/>
          <Route path='/' element={<NavBar />} />
          <Route path='/createAsset' element={<CreateAsset />} />
          <Route path='/dashBoard/:userAddress'  element={<DashBoard />} />
          <Route path='/dashBoard/' element={<Errorpage />} />
        </Routes>
      </Router>
    </div>
  )
}

// {/* <Router>
//   <Button><Link to="/SignUp"><span style={{ color: "white" }}>SignUp</span></Link></Button>
//   <Routes>
//     {/* <Route path='/' element={<HomePage />} /> */}
//     <Route path='/SignUp' element={<SigUp />} />
//   </Routes>
// </Router> */}



export default App;
