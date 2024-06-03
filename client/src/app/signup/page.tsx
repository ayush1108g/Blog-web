"use client";
import React,{useState} from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAlert } from '@/context/AlertContext';
import { useLogin } from '@/context/LoginContext';
import {API} from '@/utils/api';

interface userDetails{
    name:string;
    email:string;
    phone:number|null;
    password:string;
    photo?:string;
}

const SignInForm: React.FC = () => {
    const [data,setData] = useState<userDetails>({name:'',email:'',phone:null,password:''});
    const [profile, setProfile] = useState<File | null>(null);
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [fileuploading, setFileuploading] = useState<boolean>(false);
    const AlertCtx = useAlert();
    const LoginCtx = useLogin();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = e.target;
        setData({...data,[name]:value});
    }

    const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(data.email === '' || data.password === '' || data.name === '' || data.phone === 0){
            AlertCtx.showAlert('error','Please fill all the fields');
            return;
        }
        if(data.password.length < 8){
          AlertCtx.showAlert('error','Password should be atleast 8 characters');
          return;
      }
        if(profileUrl){
            data.photo = profileUrl;
        }
        console.log(data);
        try {
            const response =await API.post('/api/v1/auth/signup',data);
            console.log(response);
            AlertCtx.showAlert('success','User registered successfully');
            LoginCtx.login(response.data.data.user, true);
            router.push('/');
        } catch (error) {
            AlertCtx.showAlert('error', error?.response?.data?.message ?  error?.response?.data?.message :'Something went wrong ');
        }
    }


    const uploadHandler = async () => {
      // check if file is uploading
      if (fileuploading) {
          return AlertCtx.showAlert("danger", "Please wait while the file is uploading");
      }

      // check if file is selected
      if (!profile) {
          return AlertCtx.showAlert("danger", "Please select a file");
      }
      console.log('Selected file:', profile);

      const formData = new FormData();
      formData.append("file", profile);

      console.log(formData);
      setFileuploading(true);
      try {
          const res = await API.post(`/api/v1/fileupload`, formData, { headers: { "Content-Type": "multipart/form-data", }, });
          console.log(res);
          const id = res.data.data.id;
          const url = `https://drive.google.com/thumbnail?id=${id}`;
          console.log(url);
          setProfileUrl(url);
          AlertCtx.showAlert('success', 'File uploaded successfully');
      } catch (err) {
          console.log(err);
          if (err.response?.data?.message) {
              AlertCtx.showAlert('error', err.response.data.message);
          }
      } finally {
          setFileuploading(false);
      }
  }

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
             Sign up
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={(e)=>handleSubmit(e)}>
              <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Name</label>
                  <input type="text" name="name" id="name" value={data.name} onChange={handleChange}  className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="xyz" required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
                <input type="email" name="email" id="email"value={data.email} onChange={handleChange} className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phone Number</label>
                <input type="number" name="phone" id="phone" value={data.phone} onChange={handleChange} className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="XXX-XXX-XXXX" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
                <input type="password" name="password" id="password" value={data.password} onChange={handleChange} placeholder="••••••••" className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black-500 dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <div className="p-6">
              <h5 className="text-lg font-semibold mb-4">Profile Photo</h5>
              <div className="grid gap-5 mb-3">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="flex-grow border border-gray-400 rounded px-4 py-2"
                      id="inputGroupFile02"
                      onChange={(e) => setProfile(e.target.files[0])}
                    />
                    <span
                      className="ml-2 px-4 py-2 bg-gray-200 border border-gray-400 rounded cursor-pointer flex items-center justify-center"
                      onClick={uploadHandler}
                    >
                      {!fileuploading && 'Upload'}
                      {fileuploading && (
                        <div className="w-4 h-4 border-2 border-t-2 border-red-500 rounded-full animate-spin"></div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
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
                Already have an account ? <Link href="/login" className="font-medium text-primary-900 hover:underline dark:text-black">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInForm;
