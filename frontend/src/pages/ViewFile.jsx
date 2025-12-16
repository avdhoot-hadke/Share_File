import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ViewFile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const res = await api.get(`/files/${id}`);
                setFile(res.data);
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 410) {
                        setError({
                            icon: "⏳",
                            title: "Link Expired",
                            msg: "Your access to this file has expired. Please ask the owner to share it again."
                        });
                    } else if (err.response.status === 403) {
                        setError({
                            icon: "🚫",
                            title: "Access Denied",
                            msg: "You do not have permission to view this file."
                        });
                    } else if (err.response.status === 404) {
                        setError({
                            icon: "❌",
                            title: "File Not Found",
                            msg: "This file does not exist or has been deleted."
                        });
                    } else {
                        setError({
                            icon: "⚠️",
                            title: "Error",
                            msg: "Something went wrong."
                        });
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFile();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-xl text-blue-600 animate-pulse">Loading File...</div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6">
            <div className="text-6xl mb-4">{error.icon}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{error.title}</h2>
            <p className="text-gray-600 mb-6 max-w-md">{error.msg}</p>
            <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
                Return to Dashboard
            </button>
        </div>
    );

    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.format);
    const isPdf = file.format === 'pdf';

    return (
        <div className="container mx-auto p-6 h-[calc(100vh-80px)]">
            <div className="flex justify-between items-center mb-4 bg-white p-4 rounded shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{file.filename}</h1>
                    <p className="text-sm text-gray-500">Shared by: {file.owner}</p>
                </div>
                <a
                    href={file.secure_url}
                    download
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 shadow flex items-center gap-2"
                >
                    <span>⬇</span> Download
                </a>
            </div>

            <div className="bg-gray-100 border rounded-lg h-full flex items-center justify-center overflow-hidden shadow-inner relative">
                {isImage ? (
                    <img src={file.secure_url} alt="Preview" className="max-h-full max-w-full object-contain" />
                ) : isPdf ? (
                    <iframe src={file.secure_url} className="w-full h-full" title="PDF Preview"></iframe>
                ) : (
                    <div className="text-center p-10">
                        <div className="text-6xl mb-4">📄</div>
                        <p className="text-gray-600 text-xl mb-4">No preview available for <b>.{file.format}</b> files.</p>
                        <a
                            href={file.secure_url}
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            Click here to download directly
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewFile;