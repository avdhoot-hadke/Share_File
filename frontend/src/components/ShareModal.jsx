import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ShareModal = ({ fileId, filename, onClose }) => {
    const [email, setEmail] = useState('');
    const [expiresIn, setExpiresIn] = useState(''); // Stores hours (e.g., "1", "24")
    const [generatedLink, setGeneratedLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleShare = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/files/share', {
                fileId,
                email,
                expiresIn
            });

            setGeneratedLink(res.data.link);
            toast.success(`Shared with ${email}`);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to share');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        toast.success('Link copied!');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl transform transition-all">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Share "{filename}"</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-black font-bold">✕</button>
                </div>

                {!generatedLink ? (
                    <form onSubmit={handleShare}>
                        {/* Email Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                User Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="friend@example.com"
                                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Expiration Dropdown */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Access Expiration (Optional)
                            </label>
                            <select
                                className="w-full border border-gray-300 p-2 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={expiresIn}
                                onChange={(e) => setExpiresIn(e.target.value)}
                            >
                                <option value="">Never expire (Permanent)</option>
                                <option value="1">1 Hour</option>
                                <option value="6">6 Hours</option>
                                <option value="24">24 Hours (1 Day)</option>
                                <option value="168">7 Days</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Sharing...' : 'Grant Access'}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Success View */
                    <div className="animate-fade-in">
                        <div className="bg-green-50 text-green-800 p-3 rounded mb-4 text-sm border border-green-200">
                            <p className="font-bold">✓ Access Granted!</p>
                            <p>{expiresIn ? `Link expires in ${expiresIn} hours.` : 'Access is permanent.'}</p>
                        </div>

                        <div className="flex gap-2 mb-4">
                            <input
                                readOnly
                                value={generatedLink}
                                className="w-full border p-2 rounded bg-gray-50 text-sm text-gray-600"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="bg-gray-200 px-3 rounded hover:bg-gray-300"
                                title="Copy Link"
                            >
                                📋
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareModal;