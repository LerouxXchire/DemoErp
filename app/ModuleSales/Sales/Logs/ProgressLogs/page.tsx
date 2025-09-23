"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

import SearchFilters from "../../../components/Routes/Filters/LG_Filters";
import OutboundTable from "../../../components/Routes/Table/PL_Table";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OutboundCallPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientType, setSelectedClientType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://ecoshiftcorp.com.ph/progress_api.php`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data || []);
        setTotalRecords(data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPosts([]);
        setTotalRecords(0);
      }
    };

    fetchData();
  }, []);

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(userName) => (
            <div className="container mx-auto p-4">
              <h2 className="text-lg font-bold mb-2">Progress Logs</h2>
              <p className="text-xs mb-2">
                This section displays details about outbound calls made to clients. It includes a search and filter functionality to refine call records based on client type, date range, and other criteria.
              </p>

              <div className="mb-4 text-xs">
                Total Entries: {totalRecords}
              </div>

              <div className="mb-4 p-4 bg-white shadow-md rounded-md text-gray-900">
                <SearchFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedClientType={selectedClientType}
                  setSelectedClientType={setSelectedClientType}
                  postsPerPage={postsPerPage}
                  setPostsPerPage={setPostsPerPage}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                />
                <OutboundTable posts={posts} />
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
          )}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default OutboundCallPage;
