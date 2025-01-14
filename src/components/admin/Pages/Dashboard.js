import React, { useEffect, useState } from 'react'
import { child, get, getDatabase, orderByChild, orderByValue, push, ref, set } from 'firebase/database';
import app from '../../../Firebase';

function Dashboard() {

  const database = getDatabase(app);
  let [users, setusers] = useState([]);
  let orderuser = users.sort((a, b) => b.Date - a.Date )

  function fetch(){
    let userlist = [];
    get(child(ref(database), `users/`)).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          for(let key in childSnapshot.val())
                {
                    userlist.push({...childSnapshot.val()[key], id:childKey}) 
                }
        });
        setusers(userlist)
      }).catch((error) => {
        console.error(error);
      });
}

  return (
    <div className='student container'>
        <div className='containerHeader' style={{justifyContent:"space-between"}}>
          <h5>User Loggedin Today: {new Date().getDate()+"-"+new Date().getMonth()+"-"+new Date().getFullYear()}</h5>
          <button className='button' onClick={(e)=>{
              e.preventDefault();
              fetch();
          }}>Refresh</button>
        </div>
        <table >
                <thead>
                <th>Photo</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>Date</th>
                <th>Type</th>
                </thead>
              <tbody>
              {orderuser.map((user) => {
                if(new Date(user.Date).getDate()==new Date().getDate() && new Date(user.Date).getMonth()==new Date().getMonth() && new Date(user.Date).getFullYear()==new Date().getFullYear()){
                return <tr key={user.id}>
                <td><img style={{height:"40px",borderRadius:"50px",width:"40px", objectFit:"cover"}} className='photo' src={user.DP}></img></td>
                <td><p>{user.Name}</p></td>
                <td><p>{user.Gender}</p></td>
                <td><p style={{maxWidth:"max-content"}}>{user.Email}</p></td>
                <td><p>{user.Phone}</p></td>
                <td><p>{new Date(user.Date).toLocaleString()}</p></td>
                <td><p>{user.id=="students" ? "Student" : "Employee"}</p></td>
                </tr>}
                })} 
              </tbody>  
            </table>
    </div>
  )
}

export default Dashboard