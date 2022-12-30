import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route}
  from 'react-router-dom';
import Home from './Pages';
import NavigationBar from "./Components/Navbar";
import Studios from "./Pages/Studios";
import Subscriptions from "./Pages/Subscriptions";
import Submit from "./Pages/Submit";
import Login from "./Pages/Login";
import Logout from "./Pages/Logout";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import DeleteSub from "./Pages/DeleteSub";
import Payment from "./Pages/Payment";
import StudioPage from "./Pages/StudioPage";
import Classes from "./Pages/Classes";
import MySchedule from "./Pages/MyClassSchedule";
import ClassesPage from "./Pages/ClassesPage";
import ClassHistory from "./Pages/ClassHistory";
import NotFound from "./Pages/NotFound";

function App() {
  return (
      <Router>
        <NavigationBar />
        <Routes>
            <Route path='/'>
              <Route index element={<Home/>}/>
              <Route path='*' element={<NotFound />}/>
              <Route path='/studios' element={<Studios/>}/>
              <Route path='/studios/:studio_name' element={<StudioPage/>}/>
              <Route path ='/subscriptions' element={<Subscriptions/>}/>
              <Route path ='/subscriptions/cancel' element={<DeleteSub/>}/>
              <Route path ='/submit' element={<Submit/>}/>
              <Route path ='/login' element={<Login/>}/>
              <Route path ='/logout' element={<Logout/>}/>
              <Route path ='/register' element={<Register/>}/>
              <Route path ='/profile' element={<Profile/>}/>
              <Route path ='/profile/payment/' element={<Payment/>}/>
              <Route path ='/classes' element={<Classes/>}/>
              <Route path ='/classes/:studio_name/:class_name' element={<ClassesPage/>}/>
              <Route path ='/myschedule' element={<MySchedule/>}/>
              <Route path ='/classhistory' element={<ClassHistory/>}/>
            </Route>
        </Routes>
      </Router>
  );
}

export default App;