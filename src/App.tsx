import  { useState, useEffect } from 'react';
import './App.css';
import {BrowserRouter as Router ,Routes, Route} from 'react-router-dom';
import Bot from './Bot';
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_URL} from './Components/config';

function App() {
  const [responseData, setResponseData] = useState(null);
  const [hasData, setData] = useState(false);
 
   const fetchData =() => {
    const host = window.location.origin+'/';
    console.log(encodeURIComponent(host));
    let user = Cookies.get("userDetail");
    if(user){
      let detail = JSON.parse(user);
      axios.get(API_URL+'/update-host?id='+detail.id+'&host='+encodeURIComponent(host))
      .then((response:any) => {
        const result = response.data;
        console.log(result)
        if (Object.keys(result).length === 0) {
          setData(false)
        } else {
          setData(true)
          setResponseData(result);
        }
      })
      .catch((error) => {
        console.error(error);
        setData(false);
      });
    }
    axios.get(API_URL+'/siteConfig?host='+encodeURIComponent(host))
      .then((response:any) => {
        const result = response.data;
        console.log(Object.keys(result))
        if (Object.keys(result).length === 0) {
          setData(false)
        } else {
          setData(true)
          setResponseData(result);
        }
      })
      .catch((error) => {
        console.error(error);
        setData(false);
      });
 }

 
 useEffect(() => {
   fetchData();
 }, []);
  return (
    <>
         {hasData ? 
          <Router>
            <Routes>
              <Route  path="/*"  element={<Bot siteConfig={responseData}/>}/>
              {/* <Route  path="/admin" element={<Admin/>}/> */}
              <Route path="*" element={<div> Not Found or You do not have permission.</div>}/>
            </Routes>
          </Router>
        :''
        }
      </>  
  );
 

  
 
  
}

export default App;
