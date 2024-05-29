import React from 'react'
import { Link } from 'react-router-dom'
import { Label, TextInput, Button, Spinner, Alert } from 'flowbite-react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //{ ...formData }: This syntax spreads the existing formData object.
  //[e.target.id]: e.target.value: This is the new key-value pair that we want to add or update in the formData object. It uses bracket notation to dynamically set the key based on the id property (e.target.id), and the value is taken from (e.target.value). This allows us to update the state of a specific form field identified by its id with the value entered by the user.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value});
  };

  //use async whenever dealing with databases.
  //here we are submitting the user data to the database.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        //post: This indicates that the client is sending data to the server.
        method: 'POST',

        //it specifies that the content being sent in the request body is JSON data.
        headers: { 'Content-Type': 'application/json' },


        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  

  return (
    <div className='min-h-screen'>
      <div className='flex p-16 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5 border-t-4 shadow-2xl shadow-slate-700 border-red-600 bg-white mt-20'>
        {/* left */}
        <div className='flex-1'>

          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <img src='./src/pages/logoblog.png'></img>
          </Link>

          <p className='text-lg font-bold ml-5'>Good to See You!</p>
          <p className='text-sm mt-1 italic ml-5'>
          Enter your credentials to continue exploring the latest posts and updates tailored for you.
          </p>

        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

            <div>
              <Label value='Enter username' />
              <TextInput
                type='text'
                placeholder='username'
                id='username'
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value='Enter email' />
              <TextInput
                type='email'
                placeholder='abc@gmail.com'
                id='email'
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value='Enter password' />
              <TextInput
                type='password'
                placeholder='password'
                id='password'
                onChange={handleChange}
              />
            </div>

            <Button
              className='bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <div>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </Button>

          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default Signup