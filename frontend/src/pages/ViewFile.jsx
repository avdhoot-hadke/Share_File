import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ViewFile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const res = await api.get(`/files/${id}`);
                setFile(res.data);
            } catch (err) {
                if (err.response?.status === 403) {
                    setError("🚫 Access Denied: You do not have permission.");
                } else {
                    setError("❌ File not found.");
                }
            }
        };
        fetchFile();
    }, [id]);

    if (error) return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
            <button onClick={() => navigate('/dashboard')} className="text-blue-600 underline">
                Go to Dashboard
            </button>
        </div>
    );

    if (!file) return <div className="p-10 text-center">Loading file...</div>;

    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.format);
    const isPdf = file.format === 'pdf';

    return (
        <div className="container mx-auto p-6 h-[calc(100vh-80px)]">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">{file.filename}</h1>
                    <p className="text-sm text-gray-500">Shared by: {file.owner}</p>
                </div>
                <a
                    href={file.secure_url}
                    download
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    ⬇ Download
                </a>
            </div>

            <div className="bg-white border rounded-lg h-full flex items-center justify-center overflow-hidden shadow-sm">
                {isImage ? (
                    <img src={file.secure_url} alt="Preview" className="max-h-full max-w-full object-contain" />
                ) : isPdf ? (
                    <iframe src={file.secure_url} className="w-full h-full" title="PDF Preview"></iframe>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-500 text-xl mb-4">No preview available for this file type.</p>
                        <a href={file.secure_url} className="text-blue-600 underline">Download to view</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewFile;