"use client";
import React,{useState} from 'react';
import {API} from '@/utils/api';
import {useRouter} from 'next/navigation';
import {useAlert} from '@/context/AlertContext';

const NewsletterSignup: React.FC = () => {
    const [email,setEmail] = useState<string>('');
    const AlertCtx = useAlert();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log(email);
        e.preventDefault();
        if(email === ''){
            AlertCtx.showAlert('error','Please fill all the fields');
            return;
        }
        try {
            const response = await API.post('/api/v1/contactus/newsletter',{email},{
              headers: {
                'Content-Type': 'application/json',
              },
            });
            AlertCtx.showAlert('success','Subscribed successfully');
            setEmail('');
            router.push('/');
        } catch (error:any) {
            console.log(error);
            AlertCtx.showAlert('error', error?.response?.data?.message ?  error?.response?.data?.message :'Something went wrong ');
        }
    }

  return (
    <section className="bg-white pt-20">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md sm:text-center">
          <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
            Sign up for our newsletter
          </h2>
          <p className="mx-auto mb-8 max-w-2xl font-light text-gray-500 md:mb-12 sm:text-xl">
            Stay up to date with the blogs and announcements, feel free to sign up with your email.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
              <div className="relative w-full">
                <label htmlFor="email" className="hidden mb-2 text-sm font-medium text-gray-900">
                  Email address
                </label>
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <input
                  className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="py-3 px-5 w-full text-sm font-medium text-center text-black rounded-lg border cursor-pointer bg-pink-400 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
