export function formatRupiah (amount : number) : string{
    const formattedSalary = amount ? new Intl.NumberFormat('id-ID').format(amount) : 0

    return `Rp. ${formattedSalary}`
}