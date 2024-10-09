import { User } from './user.model';

export class Website {

    constructor(
        public domain: string,
        public favorite: boolean,
        public sold: boolean,
        public type: any,
        public category: any,
        public technology: any,
        public creator?: User,
        public analytics?: string,
        public comment?: string,
        public _id?: string,
        public date?: Date,
        public connection?: string,
        public info?: string,
        public checkIndex?: boolean
    ) {}

}
