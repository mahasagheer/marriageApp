import React from "react";

const summary = [
  { label: "Total Halls", value: 3 },
  { label: "Upcoming Bookings", value: 5 },
  { label: "Revenue", value: "$12,000" },
];

const OwnerDashboard = () => (
  <>
    <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
      {summary.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center border border-gray-100 hover:shadow-lg transition"
        >
          <div className="text-3xl font-bold text-pink-600">{item.value}</div>
          <div className="text-gray-500 mt-2 font-medium">{item.label}</div>
        </div>
      ))}
    </div>
    <div className="mt-8 text-center text-gray-500 text-lg">
      Welcome, hall owner! Here you can manage your halls and bookings.
    </div>
  </>
);

export default OwnerDashboard; 