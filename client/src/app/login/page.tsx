"use client"
import React, { useEffect,useState } from 'react';
import Link from "next/link";
import { useAlert } from '@/context/AlertContext';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/context/LoginContext';
import {API} from '@/utils/api';

interface LoginDetails{
    email:string;
    password:string;
}

const SignInForm: React.FC = () => {
  const [data,setData] = useState<LoginDetails>({email:'',password:''});
  const AlertCtx = useAlert();
  const LoginCtx = useLogin();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name,value} = e.target;
      setData({...data,[name]:value});
  }
  
  const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(data.email === '' || data.password === ''){
          AlertCtx.showAlert('error','Please fill all the fields');
          return;
      }
      if(data.password.length < 8){
          AlertCtx.showAlert('error','Password should be atleast 8 characters');
          return;
      }
      try {
          const response =await API.post('/api/v1/auth/login',data);
          console.log(response);
          AlertCtx.showAlert('success','User logged in successfully');
          LoginCtx.login(response.data.data.user, true);
          router.push('/');
      } catch (error) {
        AlertCtx.showAlert('error', error?.response?.data?.message ?  error?.response?.data?.message :'Something went wrong ');
      }
  }

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
              Log in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Your email</label>
                <input type="email" name="email" id="email" value={data.email} onChange={handleChange} className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" value={data.password} onChange={handleChange} className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black-500 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-500">Remember me</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
              </div>
              <button type="submit" className="w-full text-black bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
              <p className="text-sm font-light text-gray-500 dark:text-pink">
                Don’t have an account yet? <Link href="/signup" className="font-medium text-primary-900 hover:underline dark:text-black">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInForm;
