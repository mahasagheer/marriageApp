export const parseIncome = (incomeStr) => {
    if (!incomeStr) return null;
    const [min, max] = incomeStr.split('-').map((val) => {
      return parseInt(val.replace(/,/g, '').trim()); // Remove commas and parse integers
    });
    return { min, max };
  };
  export const ParseRange = (rangeStr) => {
    if (!rangeStr) return null;
    const [min, max] = rangeStr.split('-').map(val => parseInt(val.trim()));
    return isNaN(min) || isNaN(max) ? null : { min, max };
  };
  
  
  export  const parseHeight = (heightStr) => {
    if (!heightStr || !heightStr.includes('-')) return null;
  
    const [minStr, maxStr] = heightStr.split('-').map(h => h.trim());
  
    
    const min = toCm(minStr);
    const max = toCm(maxStr);
  
    return (min && max && min <= max) ? { min, max } : null;
  };
 export const toCm = (h) => {
    const match = h.match(/(\d+)'(\d+)/);
    if (!match) return null;
    const feet = parseInt(match[1]);
    const inches = parseInt(match[2]);
    return Math.round(feet * 30.48 + inches * 2.54);
  };

  export const ConvertCmToFeetInches=(cm) =>{
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }
  
  export const FormatIncome=(income)=> {
    return income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  