"use client";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname,useRouter } from 'next/navigation';
import Comments from '@/components/Comments';
import { useLogin } from '@/context/LoginContext';
import { useAlert } from '@/context/AlertContext';
import {API } from '@/utils/api';
import Image from 'next/image';
import "suneditor/dist/css/suneditor.min.css";

function extractDateTimeFromTimestamp(timestamp) {
  // Convert timestamp to milliseconds (if not already in milliseconds)
  if (timestamp.toString().length < 13) {
      timestamp *= 1000;
  }

  // Create a new Date object
  const date = new Date(timestamp);

  // Extract date components
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so we add 1
  const day = date.getDate().toString().padStart(2, '0');

  // Extract time components
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // Return an object containing date and time components
  return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}:${seconds}`
  };
}
interface Blog {
  id: number;
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

const Page = () => {
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.split('/').pop();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [markersCount, setMarkersCount] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const blockRef = useRef<HTMLDivElement>(null);
  const LoginCtx = useLogin();
  const AlertCtx = useAlert();

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);


  const fetchBlog = async () => {
    try {
      const blogs = await API.get('/api/v1/blogs/blog/'+id);
      if (!blogs) {
        throw new Error('No blogs found with this id');
      }
      console.log(blogs);
      
      const selectedBlog = blogs.data.blog;

      if (!selectedBlog) {
        throw new Error(`Blog with ID ${id} not found.`);
      }
      // selectedBlog.data = replaceImagesWithDivs(selectedBlog.data);
      setBlog(selectedBlog);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchComments = async () => {
      try{
          const comments = await API.get('/api/v1/comments/'+id);
          if (!comments) {
              throw new Error('No comments found for this blog');
          }
          console.log(comments);
          const comm = comments.data.comments;
          comm.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setComments(comments.data.comments);
      }catch(err){
         console.log(err);
      }
  }

  useEffect(() => {
    if (blockRef.current) {
      const blockHeight = blockRef.current.offsetHeight;
      setMarkersCount(Math.ceil(blockHeight /( window.innerHeight*1.5))); 
    }
  }, [blog]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleEditClick = () => {
    router.push(`/blogs/${id}/edit`);
  };

 


  return (
    <div className="relative bg-grey-200 pt-20">
      <div className="absolute top-100 left-0 w-full z-0 pointer-events-none">
        {[...Array(markersCount)].map((_, index) => (
          <p key={index} className="text-gray-200 text-6xl font-bold absolute transform -rotate-45" style={{ top: `${ index * 150+50}vh`, left:'35%',  }}>
            Blogging Site
          </p>
        ))}
      </div>

        {blog?.userId._id === LoginCtx?.user?._id &&  
         <button onClick={handleEditClick} className="absolute top-0 right-0 mt-4 mr-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Edit
        </button>}
      {/* Page content */}
      <div className="relative z-10 bg-grey-200  border-2 border-grey-100 m-2 p-5" ref={blockRef}>
        <h1 className="text-center font-bold text-3xl capitalize">
          {blog ? blog.title : 'Blog not found'}
        </h1>
        <p className="absolute top-12 right-10 mt-4 mr-4  text-black py-2 px-4 rounded hover:bg-pink-200"        >
          {blog ?'~ '+ blog.userId.name : ''}
        <p className="absolute top-18 mr-4 text-black py-2 px-4 rounded hover:bg-pink-200"        >
          {blog ? extractDateTimeFromTimestamp(blog.date).date : ''}
        </p>
        </p>
        {blog?.coverImage && (
          <div className="flex justify-center mb-6">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                src={blog.coverImage}
                alt="Cover Image"
                width={500}
                height={300}
                className="object-cover"
              />
            </div>
          </div>
        )}
     
       <div className="sun-editor-editable">
        <div style={{ maxWidth: '100%', padding: '30px', alignItems: 'center' }}>
          <div dangerouslySetInnerHTML={{ __html: blog? blog.data : '' }} />
        </div>
        </div>
      </div>

      {/* Comments section */}
      <Comments blogId={id} comments={comments} setComments={setComments}/>
    </div>
  );
};

export default Page;
