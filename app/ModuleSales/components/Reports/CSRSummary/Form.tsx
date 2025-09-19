import React, { useState, useEffect } from "react";
import FormFields from "./FormFields";
import { CiSaveUp1, CiEdit, CiTurnL1, CiCircleMinus, CiCirclePlus } from "react-icons/ci";

interface AddUserFormProps {
  onCancel: () => void;
  refreshPosts: () => void;
  userDetails: {
    id: string;
    referenceid: string;
    manager: string;
    tsm: string;
  };
  editUser?: any;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onCancel, refreshPosts, userDetails, editUser }) => {
  const [referenceid, setReferenceid] = useState(userDetails.referenceid || "");
  const [manager, setManager] = useState(userDetails.manager || "");
  const [tsm, setTsm] = useState(userDetails.tsm || "");
  const [companyname, setcompanyname] = useState("");
  const [contactperson, setcontactperson] = useState("");
  const [remarks, setremarks] = useState("");
  const [activitystatus, setactivitystatus] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "">("");
  const [isMaximized, setIsMaximized] = useState(false);


  useEffect(() => {
    if (editUser) {
      setReferenceid(editUser.referenceid || "");
      setManager(editUser.manager || "");
      setTsm(editUser.tsm || "");
      setcompanyname(editUser.companyname || "");
      setcontactperson(editUser.contactperson || "");
      setremarks(editUser.remarks || "");
      setactivitystatus(editUser.activitystatus || "");
    }
  }, [editUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editUser
      ? "/api/ModuleSales/Reports/CSRSummary/EditData"
      : "/api/ModuleSales/UserManagement/CompanyAccounts/CreateUser";

    const method = editUser ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editUser?.id,
          referenceid,
          manager,
          tsm,
          companyname,
          contactperson,
          remarks,
          activitystatus
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      setAlertMessage(editUser ? "The account information has been updated successfully." : "A new account has been created successfully.");
      setAlertType("success");
      refreshPosts();

    } catch (error) {
      setAlertMessage("Failed to save account. Please try again.");
      setAlertType("error");
    }

    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white text-gray-900 rounded-lg p-4 text-xs mt-20 transition-all duration-300 fixed right-0 w-full ${isMaximized ? "max-w-7xl" : "max-w-md"
        }`}
    >

      <div className="flex justify-end mb-4 gap-1">
        <button
          type="button"
          className="px-4 py-2 border rounded text-xs flex gap-1"
          onClick={() => setIsMaximized(!isMaximized)}
        >
          {isMaximized ? <CiCircleMinus size={15} /> : <CiCirclePlus size={15} />}
          {isMaximized ? "Minimize" : "Maximize"}
        </button>
        <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded text-xs flex items-center">
          {editUser ? <CiEdit size={15} /> : <CiSaveUp1 size={15} />}
          {editUser ? "Update" : "Submit"}
        </button>
        <button
          type="button"
          className="px-4 py-2 border rounded text-xs flex items-center gap-1"
          onClick={onCancel}
        >
          <CiTurnL1 size={15} /> Back
        </button>
      </div>

      <h2 className="text-lg font-bold mb-4">
        {editUser ? "Edit Account Information" : "Add New Account"}
      </h2>
      <p className="text-xs text-gray-600 mb-4">
        The process of <strong>creating</strong> or <strong>editing an account</strong> involves updating key information associated with a company. When adding or editing an account, fields like company name, contact details, client type, and status are essential for ensuring accurate and up-to-date records. This ensures smooth management and tracking of company accounts within the system.
      </p>

      {alertMessage && (
        <div
          className={`mb-4 p-2 rounded border text-xs ${alertType === "success"
            ? "bg-green-100 text-green-800 border-green-300"
            : "bg-red-100 text-red-800 border-red-300"
            }`}
        >
          {alertMessage}
        </div>
      )}

      <FormFields
        referenceid={referenceid} setreferenceid={setReferenceid}
        manager={manager} setmanager={setManager}
        tsm={tsm} settsm={setTsm}
        companyname={companyname} setcompanyname={setcompanyname}
        contactperson={contactperson} setcontactperson={setcontactperson}
        remarks={remarks} setremarks={setremarks}
        activitystatus={activitystatus} setactivitystatus={setactivitystatus}
        isMaximized={isMaximized}
      />
    </form>
  );
};

export default AddUserForm;
