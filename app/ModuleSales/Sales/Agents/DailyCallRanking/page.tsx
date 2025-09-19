"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import SearchFilters from "../../../components/National/DailyCallRanking/Filters";
import UsersTable from "../../../components/Agents/DailyCallRanking/Table";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ListofUser: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClientType, setSelectedClientType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [usersList, setUsersList] = useState<any[]>([]);

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
                    setLoading(false);
                }
            } else {
                setError("User ID is missing.");
                setLoading(false);
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
            const response = await fetch("/api/ModuleSales/National/FetchDailyCallRanking");
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

    const today = new Date().toISOString().split("T")[0];

    const filteredAccounts = Array.isArray(posts)
        ? posts.filter((post) => {
            const matchesSearchTerm = post?.companyname?.toLowerCase().includes(searchTerm.toLowerCase());

            const postDate = post.date_created ? new Date(post.date_created).toISOString().split("T")[0] : null;
            const isWithinDateRange =
                postDate &&
                (!startDate || postDate >= startDate) &&
                (!endDate || postDate <= endDate);

            const matchesClientType = selectedClientType ? post?.typeclient === selectedClientType : true;

            const referenceID = userDetails.ReferenceID;

            const matchesRole = userDetails.Role === "Super Admin"
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
                AgentLastname: agent ? agent.Lastname : "Unknown",
            };
        })
        : [];

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                    <h2 className="text-lg font-bold mb-2">Team Daily Ranking</h2>
                                    <p className="text-xs text-gray-600 mb-4">
                                        The **Team Daily Ranking** tracks the performance of our <strong>Territory Sales Associates (TSA)</strong> within our team on a daily basis.
                                        Rankings are based on the number of <strong>outbound calls, inbound calls,</strong> and <strong>successful call outcomes</strong>.
                                        This leaderboard helps identify top-performing TSAs within the team, recognizing those who achieve the highest call volumes
                                        and the most successful client engagements.
                                    </p>
                                    <SearchFilters
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        startDate={startDate}
                                        setStartDate={setStartDate}
                                        endDate={endDate}
                                        setEndDate={setEndDate}
                                    />
                                    <UsersTable
                                        posts={filteredAccounts}
                                    />
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
