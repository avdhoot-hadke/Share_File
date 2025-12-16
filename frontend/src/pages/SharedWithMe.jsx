import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const SharedWithMe = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchSharedFiles = async () => {
            try {
                const res = await api.get('/files/list/shared-with-me');
                setFiles(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSharedFiles();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Shared With Me</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.length === 0 ? (
                    <p className="text-gray-500">No files shared with you yet.</p>
                ) : (
                    files.map((file) => (
                        <div key={file._id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-4xl">📄</div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {file.format}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg mb-1 truncate" title={file.filename}>
                                {file.filename}
                            </h3>

                            <p className="text-sm text-gray-500 mb-4">
                                Owner: {file.owner?.email || 'Unknown'}
                            </p>

                            <Link
                                to={`/file/view/${file._id}`}
                                className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                View File
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SharedWithMe;