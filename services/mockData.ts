import { Donor, Donation, DonorType, PaymentMethod } from '../types';

export const generateMockData = () => {
    const donors: Donor[] = [];
    const donations: Donation[] = [];

    // Specific donors mentioned in prompt logic or typical personas
    const specificDonors = [
        { first: 'Kim', last: 'Ross', type: DonorType.INDIVIDUAL, tags: ['Volunteer', 'Staff'] },
        { first: 'Waterfall', last: 'Foundation', type: DonorType.GRANT, tags: ['Major Donor'] },
        { first: 'Federation', last: 'Innovation', type: DonorType.GRANT, tags: ['Grant'] },
        { first: 'Jane', last: 'Doe', type: DonorType.INDIVIDUAL, tags: ['Recurring'] },
    ];

    // Helper to add a donor and their donations
    const addDonor = (d: Partial<Donor>, idx: number) => {
        const id = `donor-${idx}`;
        const isGrant = d.type === DonorType.GRANT;
        
        // Random giving history
        const giftCount = isGrant ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 15) + 1;
        let totalGiving = 0;
        const donorDonations: Donation[] = [];

        for (let i = 0; i < giftCount; i++) {
            const amount = isGrant 
                ? (Math.floor(Math.random() * 10) + 1) * 1000 
                : (Math.floor(Math.random() * 50) + 1) * 10;
            
            totalGiving += amount;
            
            const date = new Date();
            date.setMonth(date.getMonth() - (i * 2)); // Spread out over months
            
            donorDonations.push({
                id: `don-${id}-${i}`,
                donorId: id,
                amount,
                date: date.toISOString().split('T')[0],
                method: isGrant ? PaymentMethod.CHECK : PaymentMethod.SQUARESPACE,
                notes: i === 0 ? 'Recent donation' : 'Historical donation'
            });
        }

        const newDonor: Donor = {
            id,
            firstName: d.firstName || `Donor${idx}`,
            lastName: d.lastName || `Lastname${idx}`,
            email: `${d.firstName || 'donor'}${idx}@example.com`.toLowerCase(),
            type: d.type || DonorType.INDIVIDUAL,
            tags: d.tags || [],
            notes: isGrant ? 'Grant requirement: Quarterly report' : 'Loves the sandwich mission.',
            firstGiftDate: donorDonations[donorDonations.length - 1].date,
            lastGiftDate: donorDonations[0].date,
            totalGiving,
            giftCount,
            address: '123 Sandwich Lane, Atlanta, GA'
        };

        donors.push(newDonor);
        donations.push(...donorDonations);
    };

    // Add specific personas
    specificDonors.forEach((d, i) => addDonor({ firstName: d.first, lastName: d.last, type: d.type, tags: d.tags }, i));

    // Fill the rest to reach ~145 online donors context
    for (let i = specificDonors.length; i < 145; i++) {
        addDonor({ 
            firstName: `Supporter`, 
            lastName: `${i}`,
            type: DonorType.INDIVIDUAL,
            tags: Math.random() > 0.8 ? ['New Donor'] : []
        }, i);
    }

    return { donors, donations };
};

export const { donors: MOCK_DONORS, donations: MOCK_DONATIONS } = generateMockData();