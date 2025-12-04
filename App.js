import { useState } from 'react';
import { html } from 'htm/react';
import { LayoutDashboard, Users, PlusCircle, Settings, Menu, Sandwich } from 'lucide-react';
import Dashboard from './components/Dashboard.js';
import DonorList from './components/DonorList.js';
import DonorProfile from './components/DonorProfile.js';
import DataEntry from './components/DataEntry.js';
import { MOCK_DONORS, MOCK_DONATIONS } from './services/mockData.js';

function App() {
    const [viewState, setViewState] = useState({ view: 'dashboard' });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Mock Data (In a real app, this would be fetched via React Query or useEffect)
    const donors = MOCK_DONORS;
    const donations = MOCK_DONATIONS;

    // View Routing Logic
    const handleDonorSelect = (id) => {
        setViewState({ view: 'donors', selectedDonorId: id });
        setIsMobileMenuOpen(false);
    };

    const handleNav = (view) => {
        setViewState({ view });
        setIsMobileMenuOpen(false);
    };

    const renderContent = () => {
        switch (viewState.view) {
            case 'dashboard':
                return html`<${Dashboard} donors=${donors} donations=${donations} />`;
            case 'donors':
                if (viewState.selectedDonorId) {
                    const donor = donors.find(d => d.id === viewState.selectedDonorId);
                    const donorDonations = donations.filter(d => d.donorId === viewState.selectedDonorId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    if (donor) {
                        return html`
                            <${DonorProfile}
                                donor=${donor}
                                donations=${donorDonations}
                                onBack=${() => setViewState({ view: 'donors' })}
                            />
                        `;
                    }
                }
                return html`<${DonorList} donors=${donors} onSelectDonor=${handleDonorSelect} />`;
            case 'entry':
                return html`<${DataEntry} />`;
            case 'settings':
                return html`<div className="p-8 text-center text-gray-500">Settings and API Configuration placeholder</div>`;
            default:
                return html`<${Dashboard} donors=${donors} donations=${donations} />`;
        }
    };

    return html`
        <div className="flex h-screen bg-gray-50">
            <!-- Mobile Menu Overlay -->
            ${isMobileMenuOpen && html`
                <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick=${() => setIsMobileMenuOpen(false)} />
            `}

            <!-- Sidebar Navigation -->
            <aside className=${`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <${Sandwich} className="text-tsp-600 mr-2" size=${28} />
                        <span className="font-bold text-xl text-gray-800 tracking-tight">TSP Admin</span>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1">
                        <${NavItem}
                            icon=${html`<${LayoutDashboard} size=${20} />`}
                            label="Dashboard"
                            isActive=${viewState.view === 'dashboard'}
                            onClick=${() => handleNav('dashboard')}
                        />
                        <${NavItem}
                            icon=${html`<${Users} size=${20} />`}
                            label="Donors"
                            isActive=${viewState.view === 'donors'}
                            onClick=${() => handleNav('donors')}
                        />
                        <${NavItem}
                            icon=${html`<${PlusCircle} size=${20} />`}
                            label="Add Donation"
                            isActive=${viewState.view === 'entry'}
                            onClick=${() => handleNav('entry')}
                        />
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <${NavItem}
                            icon=${html`<${Settings} size=${20} />`}
                            label="Settings"
                            isActive=${viewState.view === 'settings'}
                            onClick=${() => handleNav('settings')}
                        />
                        <div className="mt-4 px-4 py-3 bg-tsp-50 rounded-lg">
                            <p className="text-xs text-tsp-800 font-semibold">System Status</p>
                            <p className="text-xs text-tsp-600 mt-1">API: Connected</p>
                            <p className="text-xs text-tsp-600">Sync: 10 mins ago</p>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Main Content Area -->
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <!-- Mobile Header -->
                <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                    <button onClick=${() => setIsMobileMenuOpen(true)} className="text-gray-500">
                        <${Menu} size=${24} />
                    </button>
                    <span className="font-bold text-lg text-gray-800">TSP Admin</span>
                    <div className="w-6" />
                </header>

                <!-- Scrollable Content -->
                <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
                    ${renderContent()}
                </div>
            </main>
        </div>
    `;
}

const NavItem = ({ icon, label, isActive, onClick }) => html`
    <button
        onClick=${onClick}
        className=${`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-tsp-50 text-tsp-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
        <span className=${`${isActive ? 'text-tsp-600' : 'text-gray-400'} mr-3`}>${icon}</span>
        ${label}
    </button>
`;

export default App;
