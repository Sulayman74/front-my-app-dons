export default interface Donation {
    id?: string
    amount: number
    createdAt: string | Date
    archived: boolean
    user?: any
    destinataire?: any

}