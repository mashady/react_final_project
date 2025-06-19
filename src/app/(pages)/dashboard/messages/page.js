import React from "react";

const Page = () => {
  const messages = [
    {
      id: 1,
      sender: "John Doe",
      message: "Hey, how are you doing?",
      timestamp: "2023-05-15 10:30",
      status: "unread",
    },
    {
      id: 2,
      sender: "Jane Smith",
      message: "Meeting at 2pm tomorrow",
      timestamp: "2023-05-14 16:45",
      status: "read",
    },
    {
      id: 3,
      sender: "Mike Johnson",
      message: "Please review the document",
      timestamp: "2023-05-14 09:15",
      status: "read",
    },
  ];

  return (
    <div className="p-4">
      <h1
        className="text-[26px] mb-4"
        style={{
          fontWeight: 500,
        }}
      >
        Messages
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left text-[15px] font-medium">
                Sender
              </th>
              <th className="py-2 px-4 border-b text-left text-[15px] font-medium">
                Message
              </th>
              <th className="py-2 px-4 border-b text-left text-[15px] font-medium">
                Time
              </th>
              <th className="py-2 px-4 border-b text-left text-[15px] font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr
                key={msg.id}
                className={msg.status === "unread" ? "bg-blue-50" : ""}
              >
                <td className="py-2 px-4 border-b text-[14px]">{msg.sender}</td>
                <td className="py-2 px-4 border-b text-[14px]">
                  <div className="truncate max-w-xs">{msg.message}</div>
                </td>
                <td className="py-2 px-4 border-b text-[14px]">
                  {msg.timestamp}
                </td>
                <td className="py-2 px-4 border-b text-[14px]">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      msg.status === "unread"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {msg.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
