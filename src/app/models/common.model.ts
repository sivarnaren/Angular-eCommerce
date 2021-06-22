export class APIResponse<T> {
    constructor(
        public  HasError: boolean = false,
        public  Result: T  = null ,
        public  Message: string = ''
    ) {
    }
}
