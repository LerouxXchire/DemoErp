import React, { useState } from "react";

interface OutboundFieldsProps {
    callback: string;
    setcallback: (val: string) => void;
    callstatus: string;
    setcallstatus: (val: string) => void;
    typecall: string;
    settypecall: (val: string) => void;
}

const OutboundFields: React.FC<OutboundFieldsProps> = ({
    callback,
    setcallback,
    callstatus,
    setcallstatus,
    typecall,
    settypecall,
}) => {

    const [showInput, setShowInput] = useState(false);

    const handleCallbackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = e.target.value;

        if (selectedOption === "Select Callback") {
            setcallback("");
            setShowInput(false);
            return;
        }

        if (selectedOption === "Pick a DateTime") {
            setcallback("");
            setShowInput(true);
            return;
        }

        setShowInput(false);

        const today = new Date();
        let futureDate = new Date(today);

        switch (selectedOption) {
            case "Callback Tomorrow":
                futureDate.setDate(today.getDate() + 1);
                break;
            case "Callback After 3 Days":
                futureDate.setDate(today.getDate() + 3);
                break;
            case "Callback After a Week":
                futureDate.setDate(today.getDate() + 7);
                break;
            case "Callback After a Month":
                futureDate.setMonth(today.getMonth() + 1);
                break;
            case "Callback After a Year":
                futureDate.setFullYear(today.getFullYear() + 1);
                break;
            default:
                setcallback("");
                return;
        }

        futureDate.setHours(8, 0, 0, 0);
        const formattedDate = futureDate.toISOString().slice(0, 16);
        setcallback(formattedDate);
    };

    return (
        <>
            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Callbacks</label>
                <select
                    className="w-full px-3 py-2 border-b text-xs bg-white"
                    onChange={handleCallbackChange}
                >
                    <option>Select Callback</option>
                    <option>Callback Tomorrow</option>
                    <option>Callback After 3 Days</option>
                    <option>Callback After a Week</option>
                    <option>Pick a DateTime</option>
                </select>
                {showInput && (
                    <input
                        type="datetime-local"
                        value={callback}
                        onChange={(e) => setcallback(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs mt-2"
                    />
                )}
            </div>

            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Call Status <span className="text-red-500">*</span></label>
                <select
                    value={callstatus}
                    onChange={(e) => setcallstatus(e.target.value)}
                    className="w-full px-3 py-2 border-b text-xs capitalize bg-white"
                >
                    <option value="">Select Status</option>
                    <option value="Successful">Successful</option>
                    <option value="Unsuccessful">Unsuccessful</option>
                </select>
            </div>

            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Type of Call <span className="text-red-500">*</span></label>
                <select
                    value={typecall}
                    onChange={(e) => settypecall(e.target.value)}
                    className="w-full px-3 py-2 border-b text-xs capitalize bg-white"
                >
                    <option value="">Select Type</option>
                    {callstatus === "Successful" ? (
                        <>
                            <option value="No Requirements">No Requirements</option>
                            <option value="Waiting for Future Projects">Waiting for Future Projects</option>
                            <option value="With RFQ">With RFQ</option>
                        </>
                    ) : callstatus === "Unsuccessful" ? (
                        <>
                            <option value="Ringing Only">Ringing Only</option>
                            <option value="Cannot Be Reached">Cannot Be Reached</option>
                            <option value="Not Connected with the Company">Not Connected with the Company</option>
                        </>
                    ) : (
                        <>
                            <option value="Ringing Only">Ringing Only</option>
                            <option value="No Requirements">No Requirements</option>
                            <option value="Cannot Be Reached">Cannot Be Reached</option>
                            <option value="Not Connected with the Company">Not Connected with the Company</option>
                            <option value="Waiting for Future Projects">Waiting for Future Projects</option>
                        </>
                    )}
                </select>
            </div>
        </>
    );
};

export default OutboundFields;
