export class User {

    constructor(
        public name: string,
        public email: string,
        public password: string,
        public google?: boolean,
        public img?: string,
        public _id?: string
    ) {}

}
