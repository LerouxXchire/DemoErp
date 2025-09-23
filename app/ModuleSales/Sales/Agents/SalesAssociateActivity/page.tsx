"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import Table from "../../../components/Agents/SalesAssociateActivity/Table";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const [selectedClientType, setSelectedClientType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
    });

    const [usersList, setUsersList] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);

    const loading = loadingUser;
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
                    setLoadingUser(false);
                }
            } else {
                setError("User ID is missing.");
                setLoadingUser(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/getUsers");
                const data = await response.json();
                setUsersList(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const fetchAccount = async () => {
        try {
            const response = await fetch("/api/ModuleSales/Agents/SalesAssociateActivity/FetchActivity");
            const data = await response.json();
            console.log("Fetched data:", data);
            setPosts(data.data);
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    const filteredAccounts = Array.isArray(posts)
        ? posts.filter((post) => {
            const matchesSearchTerm =
                post?.companyname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post?.activitystatus?.toLowerCase().includes(searchTerm.toLowerCase());


            const postDate = post.date_created ? new Date(post.date_created) : null;
            const isWithinDateRange = (
                (!startDate || (postDate && postDate >= new Date(startDate))) &&
                (!endDate || (postDate && postDate <= new Date(endDate)))
            );

            const matchesClientType = selectedClientType
                ? post?.typeclient === selectedClientType
                : true;

            const referenceID = userDetails.ReferenceID;

            const matchesRole = userDetails.Role === "Super Admin" || userDetails.Role === "Special Access"
                ? true
                : userDetails.Role === "Manager"
                    ? post?.manager === referenceID
                    : userDetails.Role === "Territory Sales Manager"
                        ? post?.tsm === referenceID
                        : false;

            return matchesSearchTerm && isWithinDateRange && matchesClientType && matchesRole;
        }).map((post) => {
            const agent = usersList.find((user) => user.ReferenceID === post.referenceid);

            return {
                ...post,
                AgentFirstname: agent ? agent.Firstname : "Unknown",
                AgentLastname: agent ? agent.Lastname : "Unknown"
            };
        }).sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()) // Sorting by date_created
        : [];


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

    const handleEdit = (post: any) => {
        setEditUser(post);
        setShowForm(true);
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                <div className="mb-4 p-4 bg-white shadow-md rounded-lg overflow-x-auto w-full">
                                    <h2 className="text-lg font-bold mb-2">Team Daily Activities</h2>
                                    <p className="text-xs text-gray-600 mb-4">
                                        The <strong>Team Daily Activities</strong> section provides a detailed overview
                                        of daily operations, tracking key metrics related to sales and client interactions.
                                        It includes information such as the <strong>company name, sales order (SO) details, client type,
                                            type of call, activity type, call outcome, remarks, attached files, status,
                                            duration,</strong> and <strong>time consumed</strong>. This report helps monitor team performance,
                                        ensuring efficient follow-ups and effective client engagement.
                                    </p>

                                    {loading ? (
                                        <div className="flex justify-center items-center py-10">
                                            <div className="w-6 h-6 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                                            <span className="ml-2 text-xs text-gray-500">Loading data...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Table
                                                posts={currentPosts}
                                                handleEdit={handleEdit}
                                                ReferenceID={userDetails.ReferenceID}
                                                fetchAccount={fetchAccount}
                                            />
                                        </>
                                    )}

                                    <div className="text-xs mt-2">
                                        Showing {indexOfFirstPost + 1} to{" "}
                                        {Math.min(indexOfLastPost, filteredAccounts.length)} of{" "}
                                        {filteredAccounts.length} entries
                                    </div>
                                </div>

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
                                    className="text-xs z-[99999]"
                                    toastClassName="relative flex p-3 rounded-lg justify-between overflow-hidden cursor-pointer bg-white shadow-lg text-gray-800 text-xs"
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
