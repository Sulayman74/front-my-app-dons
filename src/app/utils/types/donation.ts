export default interface Donation {
    id: string
    amount: number
    description?: string
    createdAt: string | Date
    updatedAt?: string | Date
    archived?: boolean
    user: any
    destinataire: any

}