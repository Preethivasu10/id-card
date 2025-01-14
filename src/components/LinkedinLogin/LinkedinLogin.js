import React, { useContext, useState } from 'react';
import './loginlindein.css';
import AuthContext from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { child, get, getDatabase, push, ref, set } from 'firebase/database';
import app from '../../Firebase'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 

function LinkedinLogin() {
    const database = getDatabase(app);
    var newuserid = "";
    var olduserid = "";
    const currDate = new Date();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [emailError, setEmailError] = useState('');
    
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // With country select 
    const [number, setNumber] = useState('in');

    // Handle email change
    const handleEmailChange = (e) => {
        const { value } = e.target;

        if (value.trim() === '') {
            setEmailError('Email is required');
        } else if (!validateEmail(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
            authContext.setemail(value); // Update email in AuthContext
        }
    };

    // Handle form submission
    async function handleSubmit(apiKeyIndex) {

        // Form validation
        const validationErrors = {};
        if (!authContext.email.trim()) {
            validationErrors.email = 'Email is required';
        }
        if (!authContext.Linkedin.trim()) {
            validationErrors.linkedin = 'LinkedIn URL is required';
        }
        if (document.getElementById("profession").value=="0") {
            validationErrors.profession = 'profession is required';
        }
        if (!authContext.phone.trim()) {
            validationErrors.phone = 'Phone is required';
        }
        if (document.getElementById("gender").value=="0") {
            validationErrors.gender = 'Gender is required';
        }

        if (Object.keys(validationErrors).length === 0) {

            const apiKeys = [
                "bc7bb835b8msh4998bc7fc7c13afp116fa7jsn54910e3a0fef",
                "0438240e7dmsha7b0caabc8f44c4p1a203ejsn0979cc90e2e8",
                "91c6c5d5b0msh6d699df9be69317p1f91eajsn92a6d509a7ed",
                "d70bfec57fmshe055afb23408e60p17f00ajsn23dd9217c78f",
                "0ed3182fe6mshcc7c7e3fd1867f5p1b1401jsn644f581e75fa",
                "f77a4f929cmsh9d776a7fed9ab91p18444ejsnc97c2ab5f543",
                "75296dc20dmsh63fba10cd8681dcp1f0aeajsn2df4b6ad72c9",
                "96f2128666msh6c2a99315734957p152189jsn585b9f07df21",
                "7c6071ea26msh791fe69a321fc6bp13b74bjsn6099a131e787",
                "f764b34d82msha7af632826efbe3p196f7fjsn1563da1fe8f8",
                "73764e8860msh42abd7da2264e89p167a80jsn1f642dbc2aaa",
                "dd911239b8mshf19f9ba7381beb8p1e8521jsn4203c7a62293",
                "4fdff0ded6msh08ccce4dcf4f9bdp1db67bjsn4a0ce9978e2c",
                "dd911239b8mshf19f9ba7381beb8p1e8521jsn4203c7a62293",
                "6124149a51msh325445a273f5434p1ee3d0jsn76063388da09",
            ];

            const url = "https://linkedin-data-api.p.rapidapi.com/";
            const querystring = new URLSearchParams({ url: authContext.Linkedin });

            const headers = {
                "X-RapidAPI-Key": apiKeys[apiKeyIndex],
                "X-RapidAPI-Host": "linkedin-data-api.p.rapidapi.com",
            };

            try {
                const response = await fetch(`${url}?${querystring}`, { headers });

                if (!response.ok) {
                    if (response.status === 429 && apiKeyIndex < apiKeys.length - 1) {
                        handleSubmit(apiKeyIndex + 1);
                    } else {
                        throw new Error('Failed to fetch profile data');
                    }
                }
                else{
                    toast.success('Fetching data...');
                const data = await response.json();
                const { firstName, lastName, headline, position, profilePicture, educations } = data;
                const firstTitle = position && position.length > 0 ? position[0].title : '';
                const fieldofstudy = educations  && educations.length > 0 ? educations[0].degree+" "+educations[0].fieldOfStudy : '';
                const schoolName = educations  && educations.length > 0 ? educations[0].schoolName : '';
                const endyear = educations  && educations.length > 0 ? educations[0].end.year : '';
                const firstTitlecompany = position && position.length > 0 ? position[0].companyName : '';

                authContext.setName(`${firstName} ${lastName}`);
                authContext.setdesignation(firstTitle);
                authContext.setcompanyname(firstTitlecompany);
                authContext.setdp(profilePicture);
                authContext.setdegree(fieldofstudy);
                authContext.setyop(endyear);
                authContext.setcollegename(schoolName);


                if(document.getElementById('profession').value=="student"){
                    get(child(ref(database), `users/students/`)).then((snapshot) => {
                        if (snapshot.exists()) {
                            snapshot.forEach((user)=>{
                                newuserid = user.key;
                                if(user.val().Email == authContext.email){
                                  olduserid = user.key;
                                }
                            })
                            if(olduserid!=""){
                                set(ref(database, 'users/students/' + olduserid), {
                                    Email: authContext.email,
                                    Name: `${firstName} ${lastName}`,
                                    Degree:fieldofstudy,
                                    Yop:endyear,
                                    College:schoolName,
                                    DP: profilePicture,
                                    Linkedin: authContext.Linkedin,
                                    Phone: authContext.phone,
                                    Gender:authContext.gender,
                                    Date:Date.now()
                                  });
                            }
                            else{
                                newuserid = Number(newuserid)+1;
                                set(ref(database, 'users/students/' + newuserid), {
                                    Email: authContext.email,
                                    Name: `${firstName} ${lastName}`,
                                    Degree:fieldofstudy,
                                    Yop:endyear,
                                    College:schoolName,
                                    DP: profilePicture,
                                    Linkedin: authContext.Linkedin,
                                    Phone: authContext.phone,
                                    Gender:authContext.gender,
                                    Date:Date.now()
                                  });
                            }
                        } else {
                          set(ref(database, 'users/students/' + "1"), {
                            Email: authContext.email,
                                    Name: `${firstName} ${lastName}`,
                                    Degree:fieldofstudy,
                                    Yop:endyear,
                                    College:schoolName,
                                    DP: profilePicture,
                                    Linkedin: authContext.Linkedin,
                                    Phone: authContext.phone,
                                    Gender:authContext.gender,
                                    Date:Date.now()
                          });
                        }
                      }).catch((error) => {
                      });
    
                    
                    setTimeout(function(){
                        navigate('/ProudMemberCard');
                    },5000)
                }
                else
                {
                get(child(ref(database), `users/employee/`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        snapshot.forEach((user)=>{
                            newuserid = user.key;
                            if(user.val().Email == authContext.email){
                              olduserid = user.key;
                            }
                        })
                        if(olduserid!=""){
                            set(ref(database, 'users/employee/' + olduserid), {
                                Email: authContext.email,
                                Name: `${firstName} ${lastName}`,
                                Designation: firstTitle,
                                Company: firstTitlecompany,
                                DP: profilePicture,
                                Linkedin: authContext.Linkedin,
                                Phone: authContext.phone,
                                Gender:authContext.gender,
                                Date:Date.now()
                              });
                        }
                        else{
                            newuserid = Number(newuserid)+1;
                            set(ref(database, 'users/employee/' + newuserid), {
                                Email: authContext.email,
                                Name: `${firstName} ${lastName}`,
                                Designation: firstTitle,
                                Company: firstTitlecompany,
                                DP: profilePicture,
                                Linkedin: authContext.Linkedin,
                                Phone: authContext.phone,
                                Gender:authContext.gender,
                                Date:Date.now()
                              });
                        }
                    } else {
                      set(ref(database, 'users/employee/' + "1"), {
                        Email: authContext.email,
                                Name: `${firstName} ${lastName}`,
                                Designation: firstTitle,
                                Company: firstTitlecompany,
                                DP: profilePicture,
                                Linkedin: authContext.Linkedin,
                                Phone: authContext.phone,
                                Gender:authContext.gender,
                                Date:Date.now()
                      });
                    }
                  }).catch((error) => {
                  });

                
                setTimeout(function(){
                    navigate('/ProudMemberCard');
                },5000)
            }
                }
            } catch (error) {
                toast.error('Failed to fetch data. Please try again later.');
            }
        } else {
            setErrors(validationErrors);
            toast.error('Please check the form for errors!');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className='loginformcontainer1 container-fluid '>
                <div className='row'>
                    <div className='col-lg-6 col-md-4'>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHU1P09_zNi1ldO8i_rwYsqNmL_q03FNS61X7XEx8sMbdAKbFUQcx7RtZicnkP_lTRCLg&usqp=CAU" alt='Logo' className='logo_img col-6 col-md-12 col-lg-4' />
                    </div>

                    <div className='col-lg-5 col-md-10'>
                        <form className='card_design container' onSubmit={(e) =>{
                            e.preventDefault();
                            handleSubmit(0);
                            }} style={{ borderRadius: '10px' }}>
                                <h3 className='h1login'>Get Started with JSP</h3>
                            <div data-mdb-input-init className="form-outline mb-3">
                                <label>LINKEDIN URL:</label>
                                <input
                                    className='url-style1'
                                    type="text"
                                    name="website"
                                    placeholder="LinkedIn URL"
                                    autoComplete="off"
                                    onChange={(e) => authContext.setLinkedin(e.target.value)}
                                />
                                {errors.linkedin && <span className="error">{errors.linkedin}</span>}
                            </div>

                            <div data-mdb-input-init className="form-outline mb-3">
                                    <label>Profession:</label>
                                    <div className="input-group">
                                        <select
                                            className="form-select form-control"
                                            id="profession"
                                            name="profession"
                                            onChange={(e) => authContext.setprofession(e.target.value)}
                                        >
                                            <option value="0">Select Profession</option>
                                            <option value="employee">Employee</option>
                                            <option value="student">Student</option>
                                        </select>
                                    </div>
                                    {errors.profession && <span className="error">{errors.profession}</span>}
                                </div>

                            <div data-mdb-input-init className="form-outline mb-3">
                                <label>Email:</label>
                                <input
                                    className='email-style1'
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    onChange={handleEmailChange}
                                />
                                {errors.email && <span className="error">{errors.email}</span>}
                            </div>

                            <div data-mdb-input-init className="form-outline mb-3 width_style">
                                <label>Phone Number:</label>
                                <PhoneInput
                                    country={number}
                                    placeholder="Enter phone number"
                                    onChange={(value) => { authContext.setphone(value); }}
                                    countryCodeEditable={false}
                                    inputProps={{ className: 'phone-input-input' }}
                                    dropdownClass="phone-input-country-select"
                                />
                                {errors.phone && <span className="error">{errors.phone}</span>}
                            </div>

                            <div data-mdb-input-init className="form-outline mb-3">
                                    <label>Gender:</label>
                                    <div className="input-group">
                                        <select
                                            className="form-select form-control"
                                            id="gender"
                                            name="gender"
                                            onChange={(e) => authContext.setgender  (e.target.value)}
                                            required
                                        >
                                            <option value="0">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Others</option>
                                        </select>
                                    </div>
                                    {errors.gender && <span className="error">{errors.gender}</span>}
                                </div>

                            <div>
                                <button className='submit' type="submit">Get Started</button>
                                <p style={{ marginTop: '20px', marginBottom: '20px' }}>
                                    If you don't have a LinkedIn account, please <Link to='/login'>Click here</Link>.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LinkedinLogin;