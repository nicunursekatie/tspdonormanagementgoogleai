import { useState, useMemo } from 'react';
import { html } from 'htm/react';
import { DonorType } from '../types.js';
import { Search, Filter, ChevronRight, User, Building } from 'lucide-react';

const DonorList = ({ donors, onSelectDonor }) => {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredDonors = useMemo(() => {
        return donors.filter(d => {
            const matchesSearch =
                d.firstName.toLowerCase().includes(search.toLowerCase()) ||
                d.lastName.toLowerCase().includes(search.toLowerCase()) ||
                d.email.toLowerCase().includes(search.toLowerCase());

            const matchesType = filterType === 'all' || d.type === filterType;

            return matchesSearch && matchesType;
        });
    }, [donors, search, filterType]);

    return html`
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full max-h-[calc(100vh-120px)]">
            <!-- Toolbar -->
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Donor Directory</h2>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <${Search} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size=${16} />
                        <input
                            type="text"
                            placeholder="Search donors..."
                            value=${search}
                            onChange=${(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tsp-500 focus:bg-white transition-all"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value=${filterType}
                            onChange=${(e) => setFilterType(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tsp-500 cursor-pointer"
                        >
                            <option value="all">All Types</option>
                            <option value=${DonorType.INDIVIDUAL}>Individuals</option>
                            <option value=${DonorType.ORGANIZATION}>Organizations</option>
                            <option value=${DonorType.GRANT}>Grants</option>
                        </select>
                        <${Filter} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size=${14} />
                    </div>
                </div>
            </div>

            <!-- List -->
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lifetime Giving</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Last Gift</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        ${filteredDonors.map(donor => html`
                            <tr
                                key=${donor.id}
                                onClick=${() => onSelectDonor(donor.id)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors group"
                            >
                                <td className="py-4 px-6">
                                    <div className="flex items-center">
                                        <div className=${`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${donor.type === DonorType.INDIVIDUAL ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                            ${donor.type === DonorType.INDIVIDUAL ? html`<${User} size=${16} />` : html`<${Building} size=${16} />`}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">${donor.firstName} ${donor.lastName}</p>
                                            <p className="text-xs text-gray-500">${donor.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 hidden sm:table-cell">
                                    <span className=${`px-2 py-1 text-xs rounded-full border ${
                                        donor.type === DonorType.GRANT
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-gray-100 text-gray-600 border-gray-200'
                                    }`}>
                                        ${donor.type}
                                    </span>
                                </td>
                                <td className="py-4 px-6 font-medium text-gray-900">
                                    $${donor.totalGiving.toLocaleString()}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-500 hidden md:table-cell">
                                    ${new Date(donor.lastGiftDate).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <${ChevronRight} className="text-gray-300 group-hover:text-tsp-500 transition-colors inline-block" size=${20} />
                                </td>
                            </tr>
                        `)}
                        ${filteredDonors.length === 0 && html`
                            <tr>
                                <td colSpan="5" className="py-12 text-center text-gray-400">
                                    No donors found matching your search.
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

export default DonorList;
