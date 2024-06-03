"use client"
import React, { useEffect, useState } from 'react';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';
import {API} from '@/utils/api';
import {useAlert} from '@/context/AlertContext';

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


const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const AlertCtx = useAlert();
  const postsPerPage = 10;
  const totalPages = Math.ceil(blogs.length / postsPerPage);

  useEffect(() => {
    fetchblogs();
  }, []);

  const fetchblogs = async () => {
    try {
      const response = await API.get('/api/v1/blogs');
      console.log(response);
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs: ', error);
      AlertCtx.showAlert('error', 'Error fetching blogs');
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage).map(blog => (
          <BlogCard key={blog._id} {...blog} />
        ))}
      </div>
{totalPages!==1&&blogs.length>0&& <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
    </div>
  );
};

export default BlogPage;
