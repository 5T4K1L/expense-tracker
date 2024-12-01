export const generateRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 15; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const generateUniqueCodes = (count) => {
  const uniqueCodes = new Set();
  while (uniqueCodes.size < count) {
    uniqueCodes.add(generateRandomCode());
  }
  return Array.from(uniqueCodes);
};
