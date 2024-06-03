"use client";
import React,{useEffect,useState} from 'react';
import {API} from '@/utils/api';
import {useAlert} from '@/context/AlertContext';
import {usePathname,useRouter} from 'next/navigation';
import Image from 'next/image';
import MySunEditor from '@/components/Editor';
import "suneditor/dist/css/suneditor.min.css";


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
const BlogEditPage: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const id = pathname.split('/')[2];
    const [blog, setBlog] = useState<Blog | null>(null);
    const [title, setTitle] = useState<string>('');
    const [data, setData] = useState<any>();
    const [profile, setProfile] = useState<File | null>(null);
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [fileuploading, setFileuploading] = useState<boolean>(false);
    const AlertCtx = useAlert();
    const [loading, setLoading] = useState<boolean>(true);

console.log(id);
    useEffect(() => {
        fetchBlog();
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
          setBlog(selectedBlog);
          setData(selectedBlog.data);
        setTitle(selectedBlog.title);
        setProfileUrl(selectedBlog.coverImage);
        } catch (err:any) {
            console.error(err);
        } finally {
          setLoading(false);
        }
      };
      if (loading) {
        return <div>Loading...</div>;
      }

    const changeHandler = (content:any) => {
        setData(content);
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
            return url;
        } catch (err:any) {
            console.log(err);
            if (err.response?.data?.message) {
                AlertCtx.showAlert('error', err.response.data.message);
            }
            return null;
        } finally {
            setFileuploading(false);
        }
    }

    const publishBlogHandler = async () => {
        console.log('Title:', title);
        console.log('Data:', data);
    
        if (!title || !data) {
          AlertCtx.showAlert('error', 'Please fill all the fields');
          return;
        }
        const textContent = data.replace(/<[^>]*>?/gm, '').trim();
        if (!textContent) {
          AlertCtx.showAlert('error', 'Content cannot be empty');
          return;
        }
    
        try {
          let coverImageUrl:string|null|void = profileUrl;
    
          if (!coverImageUrl && profile) {
            coverImageUrl = await uploadHandler();
          }
    
          const response:any = await API.patch('/api/v1/blogs/blog/'+id, {
            id: id,
            title,
            data,
            coverImage: coverImageUrl,
          },{
            headers: {
              'Content-Type': 'application/json',
            },
          
          });
    
          console.log(response);
          AlertCtx.showAlert('success', 'Blog published successfully');
          console.log(response.data.blog._id);
          router.push('/blogs/' + response.data.blog._id);
        } catch (error:any) {
          console.log(error);
          AlertCtx.showAlert('error', error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong');
        }
      }

      return (
        <div className='p-5 flex flex-col'>
            <h1 className='pb-5 font-bold'>Create your Blog</h1>
            <div className="relative mb-6">
                <input 
                    type="text" 
                    id="large-input" 
                    placeholder=" " 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500 peer  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {title.length === 0 && (
                    <label 
                        htmlFor="large-input" 
                        className="absolute text-sm font-medium text-gray-500 transition-all duration-200 transform -translate-y-1/2 scale-100 top-1/2 left-4 origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 dark:text-grey dark:peer-focus:text-blue-500"
                    >
                        Title
                    </label>
                )}
                <span className="absolute text-sm text-gray-500 bottom-2 right-2">{title.length}/100</span>
            </div>

            <div className="p-6">
              <h5 className="text-lg font-semibold mb-4">Cover Image</h5>
              <div className="grid gap-5 mb-3">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="flex-grow border border-gray-400 rounded px-4 py-2"
                      id="inputGroupFile02"
                      onChange={(e) => setProfile(e.target.files ? e.target.files[0] : null)}
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

            {profileUrl && (
                <div className="flex items-center justify-center">
                    <Image src={profileUrl} alt="Profile" width={200} height={200} />
                </div>
            )}
            <h1 className='pb-5'>Write your blog</h1>
            <MySunEditor initialContent={data}  onChange={(content:any)=>changeHandler(content)} />

            <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={publishBlogHandler}>Publish Blog</button>
        {/* </div> */}
        </div>
    )
}

export default BlogEditPage
