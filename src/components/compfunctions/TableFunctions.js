const INFINITY_SYMBOL = '∞';

/**
 * Converts a number to a percentage string.
 *
 * @param {number} input - The number to convert to a percentage.
 * @param {number} [decimalPlaces=-1] - The number of decimal places to include in the result. 
 *                                       If -1, the function will determine the number of decimal places based on the input value.
 * @returns {string} - The formatted percentage string.
 * @throws {Error} - Throws an error if the input is not a valid number.
 */
export const convertToPercent = (input, decimalPlaces = -1) => {
  if (typeof input !== 'number' || isNaN(input)) {
    throw new Error('Input must be a valid number');
  }

  if (Math.abs(input) < 1e-5) {
    return '-';
  }

  if (!Number.isFinite(input)) {
    return input < 0 ? `(${INFINITY_SYMBOL})` : INFINITY_SYMBOL;
  }

  const absInput = Math.abs(input);
  let percentValue;

  if (decimalPlaces === -1) {
    if (absInput < .10) {
      percentValue = (input * 100).toFixed(1);
    } else {
      percentValue = (input * 100).toFixed(0);
    }
  } else {
    percentValue = (input * 100).toFixed(decimalPlaces);
  }

  if (input < 0) {
    return `(${Math.abs(percentValue)})%`;
  }

  return `${percentValue}%`;
}

/**
 * Converts a number to a dollar string.
 *
 * @param {number} input - The number to convert to a dollar value.
 * @param {number} [decimalPlaces=-1] - The number of decimal places to include in the result. 
 *                                       If -1, the function will determine the number of decimal places based on the input value.
 * @returns {string} - The formatted dollar string.
 * @throws {Error} - Throws an error if the input is not a valid number.
 */
export const convertToDollar = (input, decimalPlaces = -1) => {
  if (typeof input !== 'number' || isNaN(input)) {
    throw new Error('Input must be a valid number');
  }

  if (Math.abs(input) < 1e-5) {
    return '-';
  }

  if (!Number.isFinite(input)) {
    return input < 0 ? `$(${INFINITY_SYMBOL})` : `$${INFINITY_SYMBOL}`;
  }

  let dollarValue;

  if (decimalPlaces === -1) {
    if (input < 1000) {
      dollarValue = input.toFixed(1);
    } else {
      dollarValue = input.toFixed(0);
    }
  } else {
    dollarValue = input.toFixed(decimalPlaces);
  }

  const formattedValue = `${parseFloat(dollarValue).toLocaleString()}`;

  if (input < 0) {
    return `$(${formattedValue})`;
  }

  return `$${formattedValue}`;
}

/**
 * Converts a number to a general string representation.
 *
 * @param {number} input - The number to convert to a general value.
 * @param {number} [decimalPlaces=-1] - The number of decimal places to include in the result. 
 *                                       If -1, the function will determine the number of decimal places based on the input value.
 * @returns {string} - The formatted general string.
 * @throws {Error} - Throws an error if the input is not a valid number.
 */
export const convertToGeneral = (input, decimalPlaces = -1) => {
  if (typeof input !== 'number' || isNaN(input)) {
    throw new Error('Input must be a valid number');
  }

  if (Math.abs(input) < 1e-5) {
    return '-';
  }

  if (!Number.isFinite(input)) {
    return input < 0 ? `(${INFINITY_SYMBOL})` : `${INFINITY_SYMBOL}`;
  }

  let generalValue;

  if (decimalPlaces === -1) {
    if (input < 100) {
      generalValue = input.toFixed(1);
    } else {
      generalValue = input.toFixed(0);
    }
  } else {
    generalValue = input.toFixed(decimalPlaces);
  }

  const formattedValue = `${parseFloat(generalValue).toLocaleString()}`;

  if (input < 0) {
    return `(${formattedValue})`;
  }

  return `${formattedValue}`;
}
