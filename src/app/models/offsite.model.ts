export class Offsite {

    constructor(
        public type: string,
        public month: number,
        public year: number,
        public website: string,
        public programed: string,
        public url?: string,
        public target?: string,
        public anchor?: string,
        public price?: number,
        public priority?: any,
        public order?: number,
        public status?: boolean,
        public _id?: string,
        public date?: Date
    ) {}

}
