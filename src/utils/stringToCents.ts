export function stringToCents(valueString: string) {
  // Remover possíveis caracteres indesejados
  const sanitizedValue = valueString.replace(/[^0-9.,]/g, '')
  
  // Substituir vírgula por ponto para garantir que temos um formato numérico válido
  const valueWithDot = sanitizedValue.replace(',', '.')
  
  // Converter para número de ponto flutuante
  const floatValue = parseFloat(valueWithDot)
  
  // Validar se é um número
  if (isNaN(floatValue)) {
    throw new Error('Valor inválido')
  }
  
  // Converter para centavos
  const cents = Math.round(floatValue * 100)
  
  return cents
}
  