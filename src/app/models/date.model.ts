export class DateModel {
    days: Array<string>;
    months: MonthModel[];
    years: Array<string>;
}

export class MonthModel {
    id: number;
    name: string;
}
