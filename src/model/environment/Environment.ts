export class SlackChannel {
    public id: number | null;

    constructor(id: number|null = null) {
        this.id = id;
    }
}

export class SlackUser {
    public username: string;
    public id: number;

    constructor(username: string = '', id: number = -1) {
        this.username = username;
        this.id = id;
    }
}

export class EnvironmentAvailability {
    public taken: boolean;
    public takenAt: Date | null;
    public takenBy: SlackUser;

    constructor(taken: boolean = false, takenAt: Date|null = null, takenBy: SlackUser = new SlackUser()) {
        this.taken = taken;
        this.takenAt = takenAt;
        this.takenBy = takenBy;
    }

    public isTakenByUser(username: string): boolean {
        return this.takenBy.username === username
    }
}

export class Environment {
  public name: string;
  public availability: EnvironmentAvailability;

  constructor(name: string, availability: EnvironmentAvailability = new EnvironmentAvailability()) {
    this.name = name;
    this.availability = availability;
  }

  public isTakenByUser(username: string): boolean {
      return this.availability.isTakenByUser(username.toString());
  }

  public isTaken(): boolean {
        return this.availability.taken;
  }
}

