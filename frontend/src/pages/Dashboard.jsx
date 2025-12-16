import { useEffect, useState } from 'react';
import api from '../api/axios';
import ShareModal from '../components/ShareModal';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // For Modal

    // 1. Fetch Files
    const fetchFiles = async () => {
        try {
            const res = await api.get('/files/list/my-files');
            setFiles(res.data);
        } catch (err) {
            toast.error('Failed to load files');
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    // 2. Handle Upload
    const handleFileUpload = async (e) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles.length) return;

        const formData = new FormData();
        // Loop through FileList and append to FormData
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }

        setUploading(true);
        const loadingToast = toast.loading('Uploading files...');

        try {
            await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Upload complete!', { id: loadingToast });
            fetchFiles(); // Refresh list
        } catch (err) {
            toast.error('Upload failed', { id: loadingToast });
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header & Upload Section */}
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">My Files</h1>
                <div>
                    <label className={`cursor-pointer bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition ${uploading ? 'opacity-50' : ''}`}>
                        {uploading ? 'Uploading...' : '☁️ Upload Files'}
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {/* File List Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4 font-semibold text-gray-600">Name</th>
                            <th className="p-4 font-semibold text-gray-600">Type</th>
                            <th className="p-4 font-semibold text-gray-600">Size</th>
                            <th className="p-4 font-semibold text-gray-600">Uploaded</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">No files uploaded yet.</td>
                            </tr>
                        ) : (
                            files.map((file) => (
                                <tr key={file._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 text-blue-600 font-medium">
                                        <a href={file.secure_url} target="_blank" rel="noreferrer" className="hover:underline">
                                            {file.filename}
                                        </a>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 uppercase">{file.format || 'FILE'}</td>
                                    <td className="p-4 text-sm text-gray-500">{(file.sizeInBytes / 1024).toFixed(1)} KB</td>
                                    <td className="p-4 text-sm text-gray-500">{new Date(file.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => setSelectedFile(file)}
                                            className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200"
                                        >
                                            Share
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Render Modal if file selected */}
            {selectedFile && (
                <ShareModal
                    fileId={selectedFile._id}
                    filename={selectedFile.filename}
                    onClose={() => setSelectedFile(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;