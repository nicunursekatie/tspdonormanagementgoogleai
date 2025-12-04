import { useState } from 'react';
import { html } from 'htm/react';
import { Upload, Plus, CheckCircle, FileText } from 'lucide-react';

const DataEntry = () => {
    const [activeTab, setActiveTab] = useState('manual');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMsg('Donation recorded successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    return html`
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Add Donations</h1>
                <p className="text-gray-500 mt-2">Enter new donations manually or import from payment processors.</p>
            </div>

            <!-- Tabs -->
            <div className="flex p-1 bg-gray-200 rounded-lg">
                <button
                    onClick=${() => setActiveTab('manual')}
                    className=${`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'manual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Manual Entry
                </button>
                <button
                    onClick=${() => setActiveTab('import')}
                    className=${`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'import' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Import CSV
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                ${activeTab === 'manual' ? html`
                    <form onSubmit=${handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Donor Email</label>
                                <input required type="email" placeholder="donor@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tsp-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                                <input required type="number" placeholder="0.00" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tsp-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input required type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tsp-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tsp-500 focus:outline-none">
                                    <option>Check</option>
                                    <option>Cash</option>
                                    <option>Direct Deposit</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                            <textarea rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tsp-500 focus:outline-none" placeholder="Check number, campaign info, etc."></textarea>
                        </div>

                        <button type="submit" className="w-full bg-tsp-600 hover:bg-tsp-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <${Plus} size=${20} /> Record Donation
                        </button>
                    </form>
                ` : html`
                    <div className="text-center space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <${Upload} size=${32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Upload Squarespace or PayPal CSV</h3>
                            <p className="text-sm text-gray-500 mt-2">Drag and drop or click to browse</p>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left flex items-start gap-3">
                             <${FileText} className="text-yellow-600 flex-shrink-0 mt-0.5" size=${18} />
                             <div className="text-sm text-yellow-800">
                                <p className="font-semibold">Format Guide</p>
                                <p>Ensure your CSV has columns for: Date, Amount, Donor Email, and First/Last Name.</p>
                             </div>
                        </div>
                    </div>
                `}
            </div>

            ${successMsg && html`
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
                    <${CheckCircle} className="text-green-400" />
                    ${successMsg}
                </div>
            `}
        </div>
    `;
};

export default DataEntry;
