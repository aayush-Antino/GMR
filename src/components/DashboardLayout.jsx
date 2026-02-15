
import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ title, description, children }) => {
    return (
        <div className="flex min-h-screen bg-lightBg font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
                        <p className="text-gray-500">{description}</p>
                        <div className="h-1 w-24 bg-primary mt-4 rounded-full"></div>
                    </header>

                    {/* Main Content Injection */}
                    {children}

                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
