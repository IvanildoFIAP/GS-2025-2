export const removeNonNumeric = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const maskCPF = (value: string): string => {
  const numbers = removeNonNumeric(value);

  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  }
};

export const maskPhone = (value: string): string => {
  const numbers = removeNonNumeric(value);

  if (numbers.length === 0) {
    return '';
  } else if (numbers.length <= 2) {
    return `(${numbers}`;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

export const maskDate = (value: string): string => {
  const numbers = removeNonNumeric(value);

  if (numbers.length === 0) {
    return '';
  } else if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
  } else {
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4, 8)}`;
  }
};

export const convertDateToISO = (date: string): string => {
  const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) {
    throw new Error('Data inválida');
  }
  const [, dd, mm, yyyy] = match;
  return `${yyyy}-${mm}-${dd}T00:00:00`;
};

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = removeNonNumeric(cpf);
  if (cleanCPF.length !== 11) {
    return false;
  }
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) {
    return false;
  }
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) {
    return false;
  }
  return true;
};

