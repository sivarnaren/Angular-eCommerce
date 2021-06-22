

    export class RequestProduct {
        idProduct: number;
        language: string;
    }
    export class Contraindication {
        name: string;
        items: string[];
    }

    export class Interaction {
        name: string;
        items: string[];
    }

    export class SideEffect {
        name: string;
        items: string[];
    }

    export class Storage {
        name: string;
        items: any[];
    }

    export class Content {
        PatientEducationSheetID: number;
        GenericProductClinicalID: number;
        CPNum: number[];
        SheetName: string;
        DescriptionHeader: string;
        Description: string;
        DescriptionFooter: string;
        ContraindicationsHeader: string;
        Contraindications: Contraindication[];
        ContraindicationsFooter: string;
        AdministrationHeader: string;
        Administration: string;
        AdministrationFooter: string;
        MissedDoseHeader: string;
        MissedDose: string;
        MissedDoseFooter: string;
        InteractionsHeader: string;
        Interactions: Interaction[];
        InteractionsFooter: string;
        MonitoringHeader: string;
        Monitoring: string;
        MonitoringFooter: string;
        SideEffectsHeader: string;
        SideEffects: SideEffect[];
        SideEffectsFooter: string;
        StorageHeader: string;
        Storage: Storage[];
        StorageFooter: string;
        LastUpdated: string;
    }



