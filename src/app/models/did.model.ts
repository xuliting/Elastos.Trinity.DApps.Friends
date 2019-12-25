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
    public publicKey: null,
    public authentication: null,
    public authorization: null,
    public expires: null,
    public storeId: string,
  ) {}
}
