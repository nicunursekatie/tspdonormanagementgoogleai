import React, { useState } from 'react';
import { Donor, Donation } from '../types';
import { generateDonorCommunication } from '../services/geminiService';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, DollarSign, Edit, Sparkles, Copy, Check } from 'lucide-react';
import { SANDWICHES_PER_THOUSAND } from '../constants';

interface DonorProfileProps {
  donor: Donor;
  donations: Donation[];
  onBack: () => void;
}

const DonorProfile: React.FC<DonorProfileProps> = ({ donor, donations, onBack }) => {
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftContext, setDraftContext] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [copied, setCopied] = useState(false);

  const impactSandwiches = Math.floor((donor.totalGiving / 1000) * SANDWICHES_PER_THOUSAND);

  const handleDraftEmail = async () => {
    setIsDrafting(true);
    const historySummary = `Gave ${donor.giftCount} times since ${donor.firstGiftDate}. Last gift: ${donor.lastGiftDate}`;
    const draft = await generateDonorCommunication(
        `${donor.firstName} ${donor.lastName}`,
        donations[0]?.amount || 0,
        donor.totalGiving,
        historySummary,
        draftContext || "Draft a general update and thank you note."
    );
    setGeneratedDraft(draft);
    setIsDrafting(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Left Column: Info & Stats */}
      <div className="lg:w-1/3 space-y-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-2 transition-colors">
          <ArrowLeft size={18} /> Back to Directory
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
             <div className="w-16 h-16 bg-tsp-100 rounded-full flex items-center justify-center text-tsp-600 font-bold text-2xl">
                {donor.firstName[0]}{donor.lastName[0]}
             </div>
             <button className="text-gray-400 hover:text-tsp-600"><Edit size={18}/></button>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900">{donor.firstName} {donor.lastName}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{donor.type}</span>
            {donor.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md">{tag}</span>
            ))}
          </div>

          <div className="mt-6 space-y-3">
             <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={16} className="text-gray-400" />
                <a href={`mailto:${donor.email}`} className="hover:text-tsp-600">{donor.email}</a>
             </div>
             {donor.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span>{donor.phone}</span>
                </div>
             )}
             <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin size={16} className="text-gray-400" />
                <span>{donor.address}</span>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Impact Summary</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Lifetime Giving</p>
                    <p className="text-lg font-bold text-gray-900">${donor.totalGiving.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-600 mb-1">Sandwich Equiv.</p>
                    <p className="text-lg font-bold text-orange-700">{impactSandwiches.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Gift Count</p>
                    <p className="text-lg font-bold text-gray-900">{donor.giftCount}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Latest Gift</p>
                    <p className="text-lg font-bold text-gray-900">{new Date(donor.lastGiftDate).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Right Column: Activity & Tools */}
      <div className="flex-1 space-y-6">
        
        {/* AI Drafter */}
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm border border-indigo-100 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-indigo-500" size={20} />
                <h2 className="text-lg font-semibold text-indigo-900">AI Communications Assistant</h2>
            </div>
            
            {!generatedDraft ? (
                <div className="space-y-4">
                    <textarea 
                        className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm min-h-[100px]"
                        placeholder="What kind of message do you need? (e.g., 'Thank them for the $500 donation check received yesterday and mention the impact on the school lunch program')"
                        value={draftContext}
                        onChange={(e) => setDraftContext(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <button 
                            onClick={handleDraftEmail}
                            disabled={isDrafting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {isDrafting ? 'Drafting...' : 'Generate Draft'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                        {generatedDraft}
                    </div>
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={() => setGeneratedDraft('')}
                            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                        >
                            Discard & Try Again
                        </button>
                        <button 
                            onClick={copyToClipboard}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                        >
                            {copied ? <><Check size={16}/> Copied</> : <><Copy size={16}/> Copy to Clipboard</>}
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* History Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Donation History</h2>
            <div className="space-y-4">
                {donations.map((donation) => (
                    <div key={donation.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="p-2 bg-green-100 text-green-600 rounded-full">
                            <DollarSign size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-gray-900">${donation.amount.toLocaleString()}</h4>
                                <span className="text-sm text-gray-500">{new Date(donation.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Via {donation.method}</p>
                            {donation.notes && <p className="text-xs text-gray-400 mt-1 italic">"{donation.notes}"</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;