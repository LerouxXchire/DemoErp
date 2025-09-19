"use client";

import React from "react";
import jsPDF from "jspdf";

interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: any[];
    summaryType: "yesterday" | "latest";
    loadingSummary: boolean;
}

const statusEmojis: { [key: string]: string } = {
    Cold: "❄️",
    Assisted: "😊",
    "Quote-Done": "💬",
    "SO-Done": "📝",
    Delivered: "📦",
    Done: "✅",
    Paid: "💰",
    Collected: "📥",
    Cancelled: "❌",
    Loss: "💔",
};

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
    isOpen,
    onClose,
    summary,
    summaryType,
    loadingSummary,
}) => {
    if (!isOpen) return null;

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        const title =
            summaryType === "yesterday"
                ? "Yesterday’s Activity Summary"
                : "Last Activity";

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const lineHeight = 7;
        let y = margin;

        doc.text(title, margin, y);
        y += lineHeight * 2;

        const sortedSummary = summary.sort(
            (a: any, b: any) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
        );

        sortedSummary.forEach((task: any, index: number) => {
            const dateObj = new Date(task.date_created);
            const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
            const time = dateObj.toLocaleTimeString();

            const lines: string[] = [];
            lines.push(
                `${index + 1}. At ${time} on ${day}, you performed a ${task.typeactivity
                } activity.`
            );
            if (task.companyname) lines.push(`- Company: ${task.companyname}`);
            if (task.contactperson)
                lines.push(`- Contact Person: ${task.contactperson}`);
            if (task.emailaddress)
                lines.push(`- Email: ${task.emailaddress.toLowerCase()}`);
            lines.push(`- Status: ${task.activitystatus}`);
            if (task.notes) lines.push(`- Notes: ${task.notes}`);

            lines.forEach((line) => {
                const splitText: string[] = doc.splitTextToSize(
                    line,
                    pageWidth - margin * 2
                );
                splitText.forEach((txt: string) => {
                    if (y + lineHeight > pageHeight - margin) {
                        doc.addPage();
                        y = margin;
                    }
                    doc.text(txt, margin, y);
                    y += lineHeight;
                });
            });

            y += lineHeight;
        });

        const fileName =
            summaryType === "yesterday"
                ? "yesterday_activity_summary.pdf"
                : "latest_activity_summary.pdf";

        doc.save(fileName);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[80vh]">
                <h2 className="text-lg font-bold mb-4">
                    {summaryType === "yesterday"
                        ? "📌 Yesterday’s Activity Summary"
                        : "📌 Last Activity"}
                </h2>

                {loadingSummary ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                        <span className="ml-2 text-xs text-gray-500">Loading data...</span>
                    </div>
                ) : summary.length > 0 ? (
                    <div className="text-sm space-y-5">
                        {summary
                            .sort(
                                (a: any, b: any) =>
                                    new Date(b.date_created).getTime() -
                                    new Date(a.date_created).getTime()
                            )
                            .map((task: any, index: number) => {
                                const dateObj = new Date(task.date_created);
                                const day = dateObj.toLocaleDateString("en-US", {
                                    weekday: "long",
                                });
                                const time = dateObj.toLocaleTimeString();
                                const emoji = statusEmojis[task.activitystatus] || "ℹ️";

                                return (
                                    <div key={index} className="p-3 border-b">
                                        <p>
                                            <strong>{index + 1}.</strong> At{" "}
                                            <strong>{time}</strong> on <strong>{day}</strong>, you
                                            performed a{" "}
                                            <span className="bg-yellow-100 px-1 rounded">
                                                {task.typeactivity}
                                            </span>{" "}
                                            activity.
                                        </p>

                                        <ul className="list-disc list-inside ml-4 mt-2">
                                            {task.companyname && (
                                                <li>
                                                    Company: <strong>{task.companyname}</strong>
                                                </li>
                                            )}
                                            {task.contactperson && (
                                                <li>
                                                    Contact Person: <strong>{task.contactperson}</strong>
                                                </li>
                                            )}
                                            {task.emailaddress && (
                                                <li>
                                                    Email:{" "}
                                                    <span className="italic lowercase">
                                                        {task.emailaddress}
                                                    </span>
                                                </li>
                                            )}
                                        </ul>

                                        <p className="mt-1">
                                            and the status is{" "}
                                            <strong>{task.activitystatus}</strong> {emoji}
                                        </p>
                                        {task.notes && (
                                            <p className="mt-1">
                                                Notes: <em>{task.notes}</em>
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <p className="text-gray-600">
                        No activities found for yesterday or recent logs.
                    </p>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={downloadPDF}
                        className="px-4 text-xs py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                    >
                        Download PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 text-xs py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementModal;
