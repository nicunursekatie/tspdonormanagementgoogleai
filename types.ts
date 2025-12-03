export enum DonorType {
    INDIVIDUAL = 'Individual',
    ORGANIZATION = 'Organization',
    GRANT = 'Grant',
}

export enum PaymentMethod {
    SQUARESPACE = 'Squarespace',
    CHECK = 'Check',
    PAYPAL = 'PayPal',
    BENEVITY = 'Benevity',
    CASH = 'Cash',
}

export interface Donation {
    id: string;
    donorId: string;
    amount: number;
    date: string;
    method: PaymentMethod;
    notes?: string;
    campaign?: string; // e.g., "Holiday 2023"
}

export interface Donor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    type: DonorType;
    address?: string;
    tags: string[]; // e.g., "Recurring", "Major Donor", "Volunteer"
    notes: string;
    firstGiftDate: string;
    lastGiftDate: string;
    totalGiving: number;
    giftCount: number;
}

export interface ViewState {
    view: 'dashboard' | 'donors' | 'entry' | 'settings';
    selectedDonorId?: string;
}

// AI Service Types
export interface AISuggestion {
    title: string;
    content: string;
    type: 'email' | 'strategy' | 'summary';
}