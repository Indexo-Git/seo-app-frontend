export class Page {

    constructor(
        public name: string,
        public website: string,
        public order: number,
        public keywords?: string,
        public created?: boolean,
        public online?: boolean,
        public optimized?: boolean,
        public mother?: string,
        public priority?: string,
        public month?: number,
        public year?: number,
        public status?: boolean,
        public _id?: string,
        public date?: Date,
        public programed?: string,
        public dateOnline?: Date,
        public dateOptimized?: Date
    ) {}

}
