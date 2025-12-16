import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ShareModal = ({ fileId, filename, onClose }) => {
    const [email, setEmail] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');

    const handleShare = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/files/share', { fileId, email });
            setGeneratedLink(res.data.link);
            toast.success(`Shared with ${email}`);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to share');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        toast.success('Link copied!');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Share "{filename}"</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
                </div>

                {!generatedLink ? (
                    <form onSubmit={handleShare}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter User Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="friend@example.com"
                            className="w-full border p-2 rounded mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Grant Access
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">
                            User added successfully! Here is the direct link:
                        </div>
                        <div className="flex gap-2 mb-4">
                            <input
                                readOnly
                                value={generatedLink}
                                className="w-full border p-2 rounded bg-gray-50 text-sm"
                            />
                            <button onClick={copyToClipboard} className="bg-gray-200 px-3 rounded hover:bg-gray-300">
                                📋
                            </button>
                        </div>
                        <button onClick={onClose} className="w-full bg-blue-600 text-white py-2 rounded">
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareModal;