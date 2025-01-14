import React, { useEffect, useState } from 'react'
import { child, get, getDatabase, push, ref, set } from 'firebase/database';
import app from '../../../Firebase';

function Students() {

  const database = getDatabase(app);
    let [users, setusers] = useState([]);

    useEffect(()=>{
      fetch();
    })

    function fetch(){
        get(child(ref(database), `users/students`)).then((snapshot) => {
            if (snapshot.exists()) {
                let userlist = [];
                for(let key in snapshot.val())
                {
                    userlist.push({...snapshot.val()[key], id:key}) 
                }
                setusers(userlist)
            }
          }).catch((error) => {
            console.error(error);
          });
    }

  return (
    <div className='student container'>
        <div className='containerHeader'>
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
                <th>Degree</th>
                <th>College Name</th>
                <th>Year of Passing</th>
                <th>Linkedin</th>
                </thead>
              <tbody>
              {users.map((user) => {
                return <tr key={user.id}>
                <td><img style={{height:"40px",borderRadius:"50px"}} className='photo' src={user.DP}></img></td>
                <td><p>{user.Name}</p></td>
                <td><p>{user.Gender}</p></td>
                <td><p>{user.Email}</p></td>
                <td><p>{user.Phone}</p></td>
                <td><p>{user.Degree}</p></td>
                <td><p>{user.College}</p></td>
                <td><p>{user.Yop}</p></td>
                <td><p>{user.Linkedin}</p></td>
                </tr>
                })} 
              </tbody>  
            </table>
    </div>
  )
}

export default Students