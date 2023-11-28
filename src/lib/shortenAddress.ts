export default function shortenAddress(address: string): string {
  const prefixLength = 4; 
  const suffixLength = 4; 

  if (address.length <= prefixLength + suffixLength) {
    return address;
  }

  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);

  return `${prefix}...${suffix}`;
}
