import React, { useEffect, useState, useCallback } from "react";
import TableXchire from "../../Routes/Table/DC_Table";

interface TableProps {
  posts: any[];
  handleEdit: (post: any) => void;
  referenceid?: string;
  Role: string;
  fetchAccount: () => Promise<void>;
}

const Table: React.FC<TableProps> = ({ posts, handleEdit, Role }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkChangeMode, setBulkChangeMode] = useState(false);
  const [bulkEditStatusMode, setBulkEditStatusMode] = useState(false);
  const [bulkRemoveMode, setBulkRemoveMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(userId) ? newSelection.delete(userId) : newSelection.add(userId);
      return newSelection;
    });
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const formattedDateStr = date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `${formattedDateStr} ${hours}:${minutesStr} ${ampm}`;
  };

  return (
    <div className="mb-4 overflow-x-auto">
      <TableXchire
        updatedUser={updatedUser}
        handleSelectUser={handleSelectUser}
        selectedUsers={selectedUsers}
        bulkEditMode={bulkEditMode}
        bulkChangeMode={bulkChangeMode}
        bulkEditStatusMode={bulkEditStatusMode}
        bulkRemoveMode={bulkRemoveMode}
        Role={Role}
        handleEdit={handleEdit}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Table;
