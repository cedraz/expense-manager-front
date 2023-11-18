export function centsToString(cents: number) {
  const formattedValue = (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
  
  return formattedValue
}
  