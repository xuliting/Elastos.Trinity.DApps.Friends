export class Friend {
  constructor(
    public id: string,
    public name: string,
    public gender: string,
    public note: string,
    public nickname: string,
    public country: string,
    public birthDate: string,
    public telephone: string,
    public email: string,
    public description: string,
    public website: string,
    public twitter: string,
    public facebook: string,
    public telegram: string,
    public imageUrl: string,
    public applicationProfileCredentials: any,
    public isPicked: boolean = false,
    public isFav: boolean
  ) {}
}

