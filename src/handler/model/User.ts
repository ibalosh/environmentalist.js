export class User {
    public username: string;
    public id: number;

    constructor(username: string = '', id: number = -1) {
        this.username = username;
        this.id = id;
    }
}

