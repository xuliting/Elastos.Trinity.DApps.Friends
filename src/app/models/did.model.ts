export class DID {
  constructor(
    public clazz: number,
    public id: {
      storeId: string,
      didString: string
    },
    public created: any,
    public updated: string,
    public verifiableCredential: {
      id: string,
      name: string,
      email: string,
      imageUrl: string,
      ApplicationProfileCredential: any[]
    },
    public publicKey: any,
    public authentication: any,
    public authorization: any,
    public expires: any,
    public storeId: string,
  ) {}
}
