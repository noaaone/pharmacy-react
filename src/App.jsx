import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Components/screens/home/HomePage';
import Authorization from './Components/screens/authorization/Authorization'
import Registration from './Components/screens/registration/Registration'
import UserMain from './Components/screens/userMain/UserMain'
import ItemView from './Components/screens/itemView/ItemView'
import ManufacturerProfile from './Components/screens/manufacturerProf/ManufacturerProfile';
import AuthProvider from './providers/AuthProvider';
import UserProfile from './Components/screens/userProfile/UserProfile'
import AdminMain from './Components/screens/adminMain/adminMain';
import Basket from './Components/screens/basket/Basket';

const App =() =>{
  return <AuthProvider>
   <BrowserRouter>
  <Routes>
    <Route element = {<HomePage/>}  exact path = '/'/>
    <Route element = {<Authorization/>} path='/authorization'/>
    <Route element = {<Registration/>} path='/registration'/>
    <Route element = {<UserMain/>} path = '/userMain'/>
    <Route element = {<ItemView/>} path = '/itemView'/>
    <Route element = {<ManufacturerProfile/>} path = '/manufacturerProfile'/>
    <Route element = {<UserProfile/>} path = '/userProfile'/>
    <Route element = {<AdminMain/>} path='/adminMain'/>
    <Route element = {<Basket/>} path='/basket'/>
    <Route path ='*' element = {<div>Not found</div>}/>
  </Routes>

  </BrowserRouter>
  </AuthProvider>
}

export default App;