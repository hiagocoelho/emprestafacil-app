/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const moneyMask = (value) => {
  const cleanValue = +value.replace(/\D+/g, '');
  const options = { style: 'currency', currency: 'BRL' };
  return new Intl.NumberFormat('pt-br', options).format(cleanValue / 100);
};

export const numberMask = (value) => {
  return value.replace(/\D/g, '');
};

export const dateMask = (value) => {
  return value
    .replace(/\D+/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\/\d{2})(\d)/, '$1/$2')
    .replace(/(\/\d{4})\d+?$/, '$1');
};

export const CPFMask = (value) => {
  return value
    .replace(/\D+/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};
