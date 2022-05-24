export function convertPriceToVND(price) {
  const priceIcon = '₫'
  const clusterSize = 3
  price = price.toString()
  let insertDotIndex = price.length - clusterSize
  while (insertDotIndex > 0) {
    price = price.substr(0, insertDotIndex) + '.' + price.substr(insertDotIndex, price.length)
    insertDotIndex -= clusterSize
  }
  return price + priceIcon
}
