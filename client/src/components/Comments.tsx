"use client";
import React, { useState, useEffect, useRef } from 'react';
import { API } from '@/utils/api';
import { useLogin } from '@/context/LoginContext';
import { useAlert } from '@/context/AlertContext';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import Pagination from '@/components/Pagination';  // Adjust this path to where your Pagination component is

interface Comment {
    userId: {
        name: string;
        photo: string;
        _id: string;
        email: string;
    }
    date: string;
    comment: string;
    blogId: string;
    _id: string;
    like: [string];
    dislike: [string];
}

interface Props {
    blogId: string;
    comments: Comment[];
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const DiscussionSection: React.FC<Props> = ({ blogId, comments, setComments }) => {
    const [showDropdown, setShowDropdown] = useState<string>("");
    const dropdownRef = useRef(null);
    const [ipComment, setIpComment] = useState<string>("");
    const LoginCtx = useLogin();
    const AlertCtx = useAlert();

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const commentsPerPage = 8;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (LoginCtx.isLoggedIn === false) {
            return AlertCtx.showAlert('error', 'Please login to comment');
        }
        try {
            const response = await API.post('/api/v1/comments/' + blogId, { comment: ipComment, blogId, userId: LoginCtx.user._id });
            const newComment = response.data.comment;
            setComments(prevComments => [newComment, ...prevComments]);
            setIpComment("");
            setCurrentPage(1); // Reset to the first page when a new comment is added
        } catch (error) {
            console.log(error);
            AlertCtx.showAlert('error', error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong');
        }
    }

    const deleteHandler = async () => {
        try {
            await API.delete('/api/v1/comments/update/' + showDropdown);
            setComments(prevComments => prevComments.filter(comment => comment._id !== showDropdown));
            setShowDropdown("");
        } catch (error) {
            console.log(error);
            AlertCtx.showAlert('error', error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong');
        }
    }

    const likeDislikeHandler = async (commentId: string, action: string) => {
        if(!LoginCtx.isLoggedIn) return AlertCtx.showAlert('error', 'Please login to like/dislike');
        try {
            const resp = await API.patch(`/api/v1/comments/update/${commentId}`, { type: action, userId: LoginCtx.user?._id });
            const updatedComment = resp.data.comment;
            setComments(prevComments => prevComments.map(comment => comment._id === commentId ? updatedComment : comment));
        } catch (error) {
            console.log(error);
            AlertCtx.showAlert('error', error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong');
        }
    }

    // Pagination logic
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(comments.length / commentsPerPage);

    return (
        <section className="bg-white py-8 lg:py-16 antialiased">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Discussion ({comments.length})</h2>
                </div>
                <form className="mb-6" onSubmit={submitHandler}>
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
                        <label htmlFor="comment" className="sr-only">Your comment</label>
                        <textarea id="comment" rows={6} value={ipComment} onChange={(e) => setIpComment(e.target.value)}
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
                            placeholder="Write a comment..." required></textarea>
                    </div>
                    <button type="submit"
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-pink-500 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800">
                        Post comment
                    </button>
                </form>
                {currentComments.map((comment, index) => (
                    <article key={index} className={`p-6 ml-6 lg text-base bg-white border-t border-gray-200 rounded-lg`}>
                        <footer className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold"><img
                                    className="mr-2 w-6 h-6 rounded-full"
                                    src={comment.userId.photo}
                                    alt={comment.userId.name} />{comment.userId.name}</p>
                                <p className="text-sm text-gray-600"><time dateTime={comment.date} title={comment.date}>{new Date(comment.date).toLocaleDateString() + ' ' + new Date(comment.date).toLocaleTimeString()}</time></p>
                            </div>
                            {LoginCtx.isLoggedIn && showDropdown !== comment._id && <button id={`dropdownComment${index + 1}Button`} onClick={() => setShowDropdown(comment._id)}
                                className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
                                type="button">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                </svg>
                                <span className="sr-only">Comment settings</span>
                            </button>}
                            {showDropdown === comment._id && <div ref={dropdownRef} className="z-10 w-36 bg-grey-200 rounded divide-y divide-gray-100 shadow">
                                <ul className="py-1 text-sm text-gray-700"
                                    aria-labelledby={`dropdownComment${index + 1}Button`}>
                                    {comment.userId._id === LoginCtx.user?._id && <>
                                        <li onClick={deleteHandler}>
                                            <p className="block py-2 px-4 hover:bg-gray-100">Remove</p>
                                        </li></>}
                                    <li>
                                        <a href="#"
                                            className="block py-2 px-4 hover:bg-gray-100">Report</a>
                                    </li>
                                </ul>
                            </div>}
                        </footer>
                        <p className="text-gray-500">{comment.comment}</p>
                        <div className="flex items-center space-x-4 mt-2">
                            <button onClick={() => likeDislikeHandler(comment._id, "like")} className="flex items-center text-gray-600 hover:text-blue-600">
                                <FaThumbsUp className="mr-1" color={comment.like.includes(LoginCtx?.user?._id) ? 'blue' : ''} /> {comment.like.length}
                            </button>
                            <button onClick={() => likeDislikeHandler(comment._id, "dislike")} className="flex items-center text-gray-600 hover:text-red-600">
                                <FaThumbsDown className="mr-1" color={comment.dislike.includes(LoginCtx?.user?._id) ? 'blue' : ''} /> {comment.dislike.length}
                            </button>
                        </div>
                    </article>
                ))}
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
            </div>
        </section>
    );
};

export default DiscussionSection;
