export interface SignInResponse {
    id?: string;
    email: string;
    password: string;
    role: string; // Assurez-vous que le type correspond à ce que votre backend renvoie
    action: string; // Assurez-vous que le type correspond à ce que votre backend renvoie
    isAuthenticated:boolean
    token:string
  }
  