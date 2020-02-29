export class Friend {
  constructor(
    public id: string,
    public name: string,
    public gender: string,
    public note: string,
    public email: string,
    public imageUrl: string,
    public applicationProfileCredentials: any[],
    public isPicked: boolean = false
  ) {}
}

