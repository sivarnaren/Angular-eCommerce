export class OnboardingRequestModel {
    currentStep: number;
    genderId?: number;
    month?: string;
    day?: string;
    year?: string;
    physicianFirstName?: string;
    physicianLastName?: string;
    physicianPhoneNumber?: string;
    physicianFax?: string;
    emergencyContactFirstName?: string;
    emergencyContactPhoneNumber?: string;
    emergencyContactRelationship?: string;
    myAllergies?: string;
    myConditions?: string;
    myMedicationSupplements?: string;
    pharmacyId?: number;
}
