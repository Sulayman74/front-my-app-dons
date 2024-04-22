export interface SignUpResponse {
    createdAt?: string | Date;
    donation?: any; // Vous devrez peut-être définir un type pour cette propriété si elle est utilisée
    firstname: string;
    id?: string;
    lastname: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: string; // Assurez-vous que le type correspond à ce que votre backend renvoie
    action: string; // Assurez-vous que le type correspond à ce que votre backend renvoie
  }
  