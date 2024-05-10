import React from 'react';

const RegistrationForm = () => {
    // Handle form submission logic here (e.g., using a state management library like Redux or React Context)

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
                <h3 className="text-2xl font-semibold mb-6">Register</h3>
                <hr className="border-t border-gray-200 mb-6" />
                <form className="space-y-4" onSubmit={(event) => handleSubmit(event)}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                placeholder="First name"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="col-span-1">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                placeholder="Last name"
                                required
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center mb-4">
                        <label htmlFor="dob" className="mr-2 text-sm font-medium text-gray-700">
                            Date Of Birth
                        </label>
                        <input
                            type="date"
                            id="dob"
                            required
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="aadharNo" className="block text-sm font-medium text-gray-700">
                            Aadhar Number
                        </label>
                        <input
                            type="text"
                            id="aadharNo"
                            placeholder="Aadhar number"
                            required
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                            <input
                                id="cb"
                                type="checkbox"
                                required
                                className="h-5 w-5 rounded border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <label htmlFor="cb" className="ml-2 block text-sm font-medium text-gray-700">
                                I've read the terms
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center">
                                        <input
                                            id="cb"
                                            type="checkbox"
                                            required
                                            className="h-5 w-5 rounded border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <label htmlFor="cb" className="ml-2 block text-sm font-medium text-gray-700">
                                            I've read the terms and conditions
                                        </label>
                                    </div>
                                    <div className="space-x-2">
                                        <a href="/" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Back
                                        </a>
                                        <button type="submit" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                                            Register
                                        </button>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
