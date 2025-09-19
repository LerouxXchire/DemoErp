"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddPostForm from "../../../components/Routes/Form/TT_Form";
import UsersCard from "../../../components/Routes/Table/TT_Table";
import SearchFilters from "../../../components/Routes/Filters/TT_Filters";
import FuturisticSpinner from "../../../components/Routes/Spinner/FS_Spinner";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiTrash, CiCircleRemove } from "react-icons/ci";

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Manager: "", TSM: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
    });
    const [error, setError] = useState<string | null>(null);

    const [postsLoading, setPostsLoading] = useState<boolean>(true);
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const params = new URLSearchParams(window.location.search);
            const userId = params.get("id");

            if (userId) {
                try {
                    const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
                    if (!response.ok) throw new Error("Failed to fetch user data");
                    const data = await response.json();
                    setUserDetails({
                        UserId: data._id,
                        ReferenceID: data.ReferenceID || "",
                        Manager: data.Manager || "",
                        TSM: data.TSM || "",
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Role: data.Role || "",
                        Department: data.Department || "",
                        Company: data.Company || "",
                    });
                } catch (err: unknown) {
                    console.error("Error fetching user data:", err);
                    setError("Failed to load user data. Please try again later.");
                } finally {
                    setShowSpinner(false);
                }
            } else {
                setError("User ID is missing.");
                setShowSpinner(false);
            }
        };

        fetchUserData();
    }, []);

    const fetchAccount = async () => {
        setPostsLoading(true);
        try {
            const response = await fetch("/api/ModuleSales/HelpCenter/Tutorials/FetchData");
            const data = await response.json();
            setPosts(data.data);
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        } finally {
            setPostsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    if (postsLoading || showSpinner) {
        return (
            <SessionChecker>
                <ParentLayout>
                    <FuturisticSpinner setShowSpinner={setShowSpinner} />
                </ParentLayout>
            </SessionChecker>
        );
    }

    const filteredAccounts = Array.isArray(posts)
        ? posts
            .filter((post) => {
                const hasTitle = !!post?.title;
                const matchesSearchTerm =
                    hasTitle && post.title.toLowerCase().includes(searchTerm.toLowerCase());

                const postDate = post.date_created ? new Date(post.date_created) : null;
                const isWithinDateRange =
                    (!startDate || (postDate && postDate >= new Date(startDate))) &&
                    (!endDate || (postDate && postDate <= new Date(endDate)));

                return (
                    hasTitle &&
                    matchesSearchTerm &&
                    isWithinDateRange
                );
            })
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
        : [];

    const currentPosts = filteredAccounts.slice();

    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/ModuleSales/Task/DailyActivity/DeleteActivity`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post.id !== postToDelete));
                toast.success("Post deleted successfully.");
            } else {
                toast.error("Failed to delete post.");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post.");
        } finally {
            setShowDeleteModal(false);
            setPostToDelete(null);
        }
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                {showForm ? (
                                    <AddPostForm
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditUser(null);
                                        }}
                                        refreshPosts={fetchAccount}
                                        userDetails={{
                                            id: editUser ? editUser.id : userDetails.UserId,
                                            referenceid: editUser ? editUser.referenceid : userDetails.ReferenceID,
                                        }}
                                        editUser={editUser}
                                    />
                                ) : (
                                    <>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Tutorials</h2>
                                            <p className="text-xs text-gray-600 mb-4">
                                                The <strong>Tutorials</strong> section provides a step-by-step guide for managing and tracking various tasks within the TaskFlow system.
                                            </p>
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                            />
                                            <UsersCard
                                                posts={currentPosts}
                                            />
                                        </div>
                                    </>
                                )}

                                {showDeleteModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                        <div className="bg-white p-4 rounded shadow-lg">
                                            <h2 className="text-xs font-bold mb-4">Confirm Deletion</h2>
                                            <p className="text-xs">Are you sure you want to delete this post?</p>
                                            <div className="mt-4 flex justify-end">
                                                <button className="bg-red-500 text-white text-xs px-4 py-2 rounded mr-2 flex items-center gap-1" onClick={handleDelete}><CiTrash size={20} />Delete</button>
                                                <button className="bg-gray-300 text-xs px-4 py-2 rounded flex items-center gap-1" onClick={() => setShowDeleteModal(false)}><CiCircleRemove size={20} /> Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <ToastContainer
                                    position="bottom-right"
                                    autoClose={2000}
                                    hideProgressBar={false}
                                    newestOnTop
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="colored"
                                    className="text-sm z-[99999]"
                                    toastClassName={() =>
                                        "relative flex p-3 rounded-lg justify-between overflow-hidden cursor-pointer bg-white shadow-lg text-gray-800 text-sm"
                                    }
                                    progressClassName="bg-gradient-to-r from-green-400 to-blue-500"
                                />
                            </div>
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ListofUser;
