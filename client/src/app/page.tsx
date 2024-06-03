"use client";
import React, { useState,useEffect } from 'react';
import ContactUs from "@/components/ContactUs";
import BlogCard from '@/components/BlogCard';
import {API} from '@/utils/api';
interface Blog {
  _id: string;
  title: string;
  data: string;
  date: string;
  userId: {
    name: string;
    email: string;
    photo: string;
    _id: string;
  };
  coverImage: string;
}
export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]); 

  useEffect(() => {
    fetchblogs();
  }, []);

  const fetchblogs = async () => {
    try {
      const response = await API.get('/api/v1/blogs');
      console.log(response);
      setBlogs(response.data.blogs);
    } catch (error:any) {
      console.error('Error fetching blogs: ', error);
    }
  };
  return (
      <div>
        <section className="bg-center bg-no-repeat bg-cover">
          <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-800 md:text-5xl lg:text-6xl">At our blog, we delve into the realms where ideas meet innovation</h1>
              <p className="mb-8 text-lg font-normal text-gray-700 lg:text-xl sm:px-16 lg:px-48">Investing in the boundless potential of tomorrow's technologies to shape a brighter future and foster sustainable economic growth.</p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0"> 
              </div>
          </div>
        </section>

        <section className="bg-center bg-no-repeat bg-cover">
        <div className='font-bold text-center text-4xl'>Recent Blogs</div>
            <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog,index) => {
              if(index<4)
                return  <BlogCard key={blog._id} {...blog} />
            })}
          </div>
        </div>
        </section>

        <ContactUs />
      </div>  
  );
}
