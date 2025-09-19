import React, { useCallback, useMemo } from "react";
import { RiEditCircleLine } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";

export interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  typeclient: string;
  activitystatus: string;
  activityremarks: string;
  ticketreferencenumber: string;
  date_created: string;
  date_updated: string | null;
  activitynumber: string;
  source?: string;
}

interface TableViewProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (id: string) => void;
  refreshPosts: () => void;
}

const statusColors: Record<string, string> = {
  "On Progress": "bg-yellow-200 text-black",
  Assisted: "bg-blue-400 text-white",
  Paid: "bg-green-500 text-white",
  Delivered: "bg-cyan-400 text-white",
  Collected: "bg-indigo-500 text-white",
  "Quote-Done": "bg-slate-500 text-white",
  "SO-Done": "bg-purple-500 text-white",
  Cancelled: "bg-red-500 text-white",
  Loss: "bg-red-800 text-white",
  "Client Visit": "bg-orange-500 text-white",
  "Site Visit": "bg-yellow-500 text-black",
  "On Field": "bg-teal-500 text-white",
  "Assisting other Agents Client": "bg-blue-300 text-white",
  "Coordination of SO to Warehouse": "bg-green-300 text-white",
  "Coordination of SO to Orders": "bg-green-400 text-white",
  "Updating Reports": "bg-indigo-300 text-white",
  "Email and Viber Checking": "bg-purple-300 text-white",
  "1st Break": "bg-yellow-300 text-black",
  "Client Meeting": "bg-orange-300 text-white",
  "Coffee Break": "bg-amber-300 text-black",
  "Group Meeting": "bg-cyan-300 text-black",
  "Last Break": "bg-yellow-400 text-black",
  "Lunch Break": "bg-red-300 text-black",
  "TSM Coaching": "bg-pink-300 text-white",
};

const fieldOnlyStatus = [
  "Client Visit", "Site Visit", "On Field",
  "Assisting other Agents Client",
  "Coordination of SO to Warehouse",
  "Coordination of SO to Orders",
  "Updating Reports", "Email and Viber Checking",
  "1st Break", "Client Meeting", "Coffee Break",
  "Group Meeting", "Last Break", "Lunch Break", "TSM Coaching"
];

const formatDate = (timestamp: number): string => {
  if (!timestamp) return "Invalid date";

  const date = new Date(timestamp);

  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TableView: React.FC<TableViewProps> = ({ posts, handleEdit, handleDelete }) => {
  const onEdit = useCallback((post: Post) => handleEdit(post), [handleEdit]);

  const onDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
      e.stopPropagation();
      handleDelete(id);
    },
    [handleDelete]
  );

  const renderedRows = useMemo(() => {
    if (posts.length === 0) {
      return (
        <tr>
          <td colSpan={9} className="text-center py-4 text-xs">
            No records available
          </td>
        </tr>
      );
    }

    return posts.map((post) => {
      const isFieldStatus = fieldOnlyStatus.includes(post.activitystatus);
      const isCsrInquiry = post.typeclient?.toLowerCase() === "csr client";

      return (
        <tr
          key={post.id}
          className={`whitespace-nowrap ${isFieldStatus ? "bg-gray-50" : "hover:bg-gray-100 cursor-pointer"
            } ${isCsrInquiry ? "shadow-lg hover:bg-red-500 hover:text-white" : ""}`}
          onClick={() => !isFieldStatus && onEdit(post)}
          tabIndex={0}
          onKeyDown={(e) => !isFieldStatus && e.key === "Enter" && onEdit(post)}
        >
          <td
            className="px-6 py-4 text-xs sticky left-0 bg-white border-r border-gray-200 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {!isFieldStatus && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(post);
                  }}
                  className="flex items-center gap-1 bg-blue-500 text-white text-[10px] px-2 py-1 rounded hover:bg-blue-700 transition-colors shadow-md"
                >
                  <RiEditCircleLine size={12} /> Update
                </button>
                <button
                  onClick={(e) => onDelete(e, post.id)}
                  className="flex items-center gap-1 bg-red-500 text-white text-[10px] px-2 py-1 rounded hover:bg-red-700 transition-colors shadow-md"
                >
                  <MdDeleteForever size={12} /> Delete
                </button>
              </div>
            )}
          </td>

          <td className="px-6 py-4">
            <span
              className={`px-2 py-1 text-[8px] rounded-full shadow-md font-semibold ${statusColors[post.activitystatus] || "bg-gray-300 text-black"
                }`}
            >
              {post.activitystatus}
            </span>
          </td>

          {isFieldStatus ? (
            <>
              <td className="px-6 py-4 text-[10px]">{formatDate(new Date(post.date_created).getTime())}</td>
              <td className="px-6 py-4 text-[10px]" colSpan={6}>
                {post.activityremarks || "—"}
              </td>
            </>
          ) : (
            <>
              <td className="px-6 py-4 text-[10px]">{formatDate(new Date(post.date_created).getTime())}</td>
              <td className="px-6 py-4 text-[10px] uppercase">{post.companyname}</td>
              <td className="px-6 py-4 text-[10px] capitalize">{post.contactperson}</td>
              <td className="px-6 py-4 text-[10px]">{post.contactnumber}</td>
              <td className="px-6 py-4 text-[10px]">
                {isCsrInquiry ? (
                  <span className="bg-red-500 text-white rounded-full px-2 py-1 text-[8px] font-bold capitalize">
                    CSR Client
                  </span>
                ) : (
                  post.typeclient
                )}
              </td>
              <td className="px-6 py-4 text-[10px]">{post.ticketreferencenumber}</td>
            </>
          )}
        </tr>
      );
    });
  }, [posts, onEdit, onDelete]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-6 py-4 font-semibold text-gray-700 sticky left-0 border-r border-gray-200 z-20">
              Actions
            </th>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Date Created</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Company / Remarks</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Ticket Reference</th>
          </tr>
        </thead>
        <tbody>{renderedRows}</tbody>
      </table>
    </div>
  );
};

export default TableView;
