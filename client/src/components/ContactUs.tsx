"use client";
import React,{useState} from 'react';
import {API} from '@/utils/api';
import {useRouter} from 'next/navigation';
import {useAlert} from '@/context/AlertContext';

interface Data {
    email: string;
    subject: string;
    message: string;
}
const page = () => {
    const AlertCtx = useAlert();
    const router = useRouter();
    const [data,setData] = useState<Data>({
        email: '',
        subject: '',
        message: ''
    });

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data);
        if(data.email === '' || data.subject === '' || data.message === ''){
            AlertCtx.showAlert('error','Please fill all the fields');
            return;
        }
        try {
            API.post('/api/v1/contactus',data);
            AlertCtx.showAlert('success','Message sent successfully');
            setData({email:'',subject:'',message:''});
            router.push('/');

        } catch (error:any) {
            AlertCtx.showAlert('error', error?.response?.data?.message ?  error?.response?.data?.message :'Something went wrong ');
        }
    };

  return (
    <section className="bg-white  border-2 border-grey-100 m-8">
    <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 sm:text-xl">Facing technical issues? Want to share feedback? We're here to help. Reach out to us with your queries and let us assist you.</p>
        <form onSubmit={submitHandler} className="space-y-8">
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input name="email" type="email" value={data.email} onChange={changeHandler} id="email" className="shadow-sm  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@gmail.com" required/>
            </div>
            <div>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900">Subject</label>
                <input name="subject" type="text"  value={data.subject} onChange={changeHandler} id="subject" className="block p-3 w-full text-sm text-gray-900  rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Let us know how we can help you" required/>
            </div>
            <div className="sm:col-span-2">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Your message</label>
                <textarea name="message" id="message"  value={data.message} onChange={changeHandler} className="block p-2.5 w-full text-sm text-gray-900  rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..."></textarea>
            </div>
            <button type="submit" className="py-3 px-5 text-sm font-medium text-center text-black rounded-lg bg-pink-400 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300  dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send message</button>
        </form>
    </div>
  </section>  
  )
}

export default page;