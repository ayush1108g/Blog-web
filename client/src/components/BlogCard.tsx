import React from 'react';

import { useRouter } from 'next/navigation';

interface BlogCardProps {
  title: string;
  coverImage: string;
  _id: string;
}


const BlogCard: React.FC<BlogCardProps> = ({_id, title,coverImage }) => {
  const router = useRouter();

  const navigateToBlog = () => {
    router.push(`/blogs/${_id}`);
  }
  console.log('coverImage',coverImage);
  const imgSrc = 'https://picsum.photos/'+ Math.floor(Math.random() * 1000);
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-4">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <a className="block h-full w-full">
          <img
            className="object-cover w-full h-full rounded-t-lg"
            src={coverImage || imgSrc}
            alt={title}
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </a>
      </div>
      <div className="p-5">
        <a>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">{title}</h5>
        </a>
        <p onClick={navigateToBlog}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Read more
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
