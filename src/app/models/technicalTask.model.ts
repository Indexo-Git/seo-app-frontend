export class TechnicalTask {

    constructor(
        public name: string,
        public website: string,
        public order: number,
        public _id?: string,
        public status?: boolean,
        public date?: Date,
    ) {}

}
