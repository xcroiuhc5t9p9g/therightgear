export interface FieldSpec {
  key: string;
  label: string;
  section: 'IDENTITY' | 'ENGINE' | 'TRANSMISSION' | 'DIMENSIONS' | 'WEIGHT' | 'PERFORMANCE' | 'PRODUCTION' | 'HISTORY' | 'CONFIGURATION';
  unit?: string;
  description: string;
}

export const ESSENTIAL_FIELDS: FieldSpec[] = [
  // IDENTITY
  { key: 'manufacturer', label: 'Manufacturer', section: 'IDENTITY', description: 'Brand or vehicle maker name' },
  { key: 'model', label: 'Model', section: 'IDENTITY', description: 'Model family designation' },
  { key: 'generation', label: 'Generation Code', section: 'IDENTITY', description: 'Chassis or generation code (e.g. E30)' },
  { key: 'variant', label: 'Variant Name', section: 'IDENTITY', description: 'Commercial variant name (e.g. Sport Evolution)' },
  { key: 'internalCode', label: 'Internal Code', section: 'IDENTITY', description: 'Internal factory development code (e.g. AK05)' },
  { key: 'modelYearFrom', label: 'Model Year From', section: 'IDENTITY', description: 'First production model year' },
  { key: 'modelYearTo', label: 'Model Year To', section: 'IDENTITY', description: 'Final production model year' },
  { key: 'productionStart', label: 'Production Start', section: 'IDENTITY', description: 'Exact production start date or month/year' },
  { key: 'productionEnd', label: 'Production End', section: 'IDENTITY', description: 'Exact production end date or month/year' },

  // ENGINE
  { key: 'engineCode', label: 'Engine Code', section: 'ENGINE', description: 'Specific engine designation (e.g. S14B25)' },
  { key: 'engineFamily', label: 'Engine Family', section: 'ENGINE', description: 'Engine family name (e.g. BMW S14)' },
  { key: 'engineArchitecture', label: 'Engine Architecture', section: 'ENGINE', description: 'Layout (e.g. Inline-4 DOHC 16v)' },
  { key: 'cylinders', label: 'Cylinders', section: 'ENGINE', description: 'Number of cylinders' },
  { key: 'displacementCc', label: 'Displacement', section: 'ENGINE', unit: 'cc', description: 'Engine displacement in cubic centimetres' },
  { key: 'aspiration', label: 'Aspiration', section: 'ENGINE', description: 'Naturally Aspirated / Turbocharged / Supercharged' },
  { key: 'fuelSystem', label: 'Fuel System', section: 'ENGINE', description: 'Fuel injection system (e.g. Bosch ML-Motronic)' },
  { key: 'powerHp', label: 'Power (HP)', section: 'ENGINE', unit: 'hp', description: 'Engine power output in horsepower (DIN/PS)' },
  { key: 'powerKw', label: 'Power (kW)', section: 'ENGINE', unit: 'kW', description: 'Engine power output in kilowatts' },
  { key: 'torqueNm', label: 'Torque', section: 'ENGINE', unit: 'Nm', description: 'Maximum engine torque' },
  { key: 'powerRpm', label: 'Power RPM', section: 'ENGINE', unit: 'rpm', description: 'Engine speed at peak horsepower' },
  { key: 'torqueRpm', label: 'Torque RPM', section: 'ENGINE', unit: 'rpm', description: 'Engine speed at peak torque' },
  { key: 'redlineRpm', label: 'Redline RPM', section: 'ENGINE', unit: 'rpm', description: 'Maximum engine RPM limit' },

  // TRANSMISSION
  { key: 'transmissionType', label: 'Transmission Type', section: 'TRANSMISSION', description: 'Transmission classification (e.g. Manual Dog-leg)' },
  { key: 'gearCount', label: 'Gear Count', section: 'TRANSMISSION', description: 'Number of forward gear ratios' },
  { key: 'drivetrain', label: 'Drivetrain', section: 'TRANSMISSION', description: 'Drive layout (e.g. RWD with LSD 25%)' },

  // DIMENSIONS
  { key: 'lengthMm', label: 'Length', section: 'DIMENSIONS', unit: 'mm', description: 'Overall vehicle length' },
  { key: 'widthMm', label: 'Width', section: 'DIMENSIONS', unit: 'mm', description: 'Overall vehicle width' },
  { key: 'heightMm', label: 'Height', section: 'DIMENSIONS', unit: 'mm', description: 'Overall vehicle height' },
  { key: 'wheelbaseMm', label: 'Wheelbase', section: 'DIMENSIONS', unit: 'mm', description: 'Distance between front and rear axle' },

  // WEIGHT
  { key: 'dryWeightKg', label: 'Dry Weight', section: 'WEIGHT', unit: 'kg', description: 'Vehicle weight without fluids' },
  { key: 'kerbWeightKg', label: 'Kerb Weight', section: 'WEIGHT', unit: 'kg', description: 'Vehicle weight ready to drive with fluids' },

  // PERFORMANCE
  { key: 'topSpeedKph', label: 'Top Speed', section: 'PERFORMANCE', unit: 'km/h', description: 'Maximum speed in km/h' },
  { key: 'acceleration0To100', label: '0–100 km/h', section: 'PERFORMANCE', unit: 's', description: '0-100 km/h acceleration time in seconds' },

  // PRODUCTION
  { key: 'productionTotal', label: 'Total Production', section: 'PRODUCTION', description: 'Exact total units built' },
  { key: 'limitedEdition', label: 'Limited Edition', section: 'PRODUCTION', description: 'Whether vehicle was a limited numbered edition' },
  { key: 'homologationSpecial', label: 'Homologation Special', section: 'PRODUCTION', description: 'Whether built for motorsport classification' },

  // HISTORY
  { key: 'designer', label: 'Lead Designer', section: 'HISTORY', description: 'Chief designer attribution' },
  { key: 'engineer', label: 'Chief Engineer', section: 'HISTORY', description: 'Chief technical engineer attribution' },
  { key: 'factory', label: 'Assembly Factory', section: 'HISTORY', description: 'Manufacturing facility / assembly plant' },
  { key: 'countryOfProduction', label: 'Country of Origin', section: 'HISTORY', description: 'Country where vehicle was manufactured' },
  { key: 'originalPrice', label: 'Original List Price', section: 'HISTORY', description: 'New vehicle retail price when launched' },
  { key: 'originalCurrency', label: 'Original Currency', section: 'HISTORY', description: 'Currency for original retail price (e.g. DEM, EUR)' },

  // CONFIGURATION
  { key: 'knownFactoryColours', label: 'Known Factory Colours', section: 'CONFIGURATION', description: 'Official factory paint options (e.g. Misano Red, Jet Black)' }
];

export const ESSENTIAL_FIELD_KEYS = ESSENTIAL_FIELDS.map(f => f.key);

/**
 * Normalization helper function
 */
export function normalizeValueAndUnit(fieldName: string, rawValue: string): { normalizedValue: string; unit?: string } {
  if (!rawValue || rawValue.trim() === '') {
    return { normalizedValue: '' };
  }

  const trimmed = rawValue.trim();
  const spec = ESSENTIAL_FIELDS.find(f => f.key === fieldName);
  const defaultUnit = spec?.unit;

  // Power HP / PS / CV conversion
  if (fieldName === 'powerHp') {
    const numMatch = trimmed.match(/(\d+([\.,]\d+)?)/);
    if (numMatch) {
      const val = parseFloat(numMatch[1].replace(',', '.'));
      return { normalizedValue: String(Math.round(val)), unit: 'hp' };
    }
  }

  // Power kW
  if (fieldName === 'powerKw') {
    const numMatch = trimmed.match(/(\d+([\.,]\d+)?)/);
    if (numMatch) {
      const val = parseFloat(numMatch[1].replace(',', '.'));
      return { normalizedValue: String(Math.round(val)), unit: 'kW' };
    }
  }

  // Displacement cc / L
  if (fieldName === 'displacementCc') {
    if (trimmed.toLowerCase().includes('l') || trimmed.includes('.')) {
      const litMatch = trimmed.match(/(\d+[\.,]\d+)/);
      if (litMatch) {
        const litres = parseFloat(litMatch[1].replace(',', '.'));
        if (litres < 10) {
          const cc = Math.round(litres * 1000);
          return { normalizedValue: String(cc), unit: 'cc' };
        }
      }
    }
    const numMatch = trimmed.match(/(\d{4,5}|\d{3,4})/);
    if (numMatch) {
      return { normalizedValue: numMatch[1], unit: 'cc' };
    }
  }

  // Torque Nm
  if (fieldName === 'torqueNm') {
    const numMatch = trimmed.match(/(\d+([\.,]\d+)?)/);
    if (numMatch) {
      return { normalizedValue: String(Math.round(parseFloat(numMatch[1].replace(',', '.')))), unit: 'Nm' };
    }
  }

  // Weights kg
  if (fieldName === 'dryWeightKg' || fieldName === 'kerbWeightKg') {
    const numMatch = trimmed.match(/(\d{3,4})/);
    if (numMatch) {
      return { normalizedValue: numMatch[1], unit: 'kg' };
    }
  }

  // Dimensions mm
  if (fieldName === 'lengthMm' || fieldName === 'widthMm' || fieldName === 'heightMm' || fieldName === 'wheelbaseMm') {
    const numMatch = trimmed.match(/(\d{3,4})/);
    if (numMatch) {
      return { normalizedValue: numMatch[1], unit: 'mm' };
    }
  }

  // Speed km/h
  if (fieldName === 'topSpeedKph') {
    const numMatch = trimmed.match(/(\d{2,3})/);
    if (numMatch) {
      return { normalizedValue: numMatch[1], unit: 'km/h' };
    }
  }

  // Acceleration 0-100 s
  if (fieldName === 'acceleration0To100') {
    const numMatch = trimmed.match(/(\d+[\.,]\d+|\d+)/);
    if (numMatch) {
      const val = parseFloat(numMatch[1].replace(',', '.'));
      return { normalizedValue: val.toFixed(1), unit: 's' };
    }
  }

  // Numbers (productionTotal, modelYearFrom, etc.)
  if (fieldName === 'productionTotal' || fieldName === 'modelYearFrom' || fieldName === 'modelYearTo' || fieldName === 'cylinders' || fieldName === 'gearCount' || fieldName === 'powerRpm' || fieldName === 'torqueRpm' || fieldName === 'redlineRpm') {
    const numMatch = trimmed.match(/(\d+)/);
    if (numMatch) {
      return { normalizedValue: numMatch[1] };
    }
  }

  // Booleans
  if (fieldName === 'limitedEdition' || fieldName === 'homologationSpecial') {
    const lower = trimmed.toLowerCase();
    if (lower === 'true' || lower === 'yes' || lower === '1' || lower.includes('si') || lower.includes('si')) {
      return { normalizedValue: 'true' };
    }
    if (lower === 'false' || lower === 'no' || lower === '0') {
      return { normalizedValue: 'false' };
    }
  }

  // String equivalences (e.g. engineArchitecture, designer)
  let normStr = trimmed;
  if (fieldName === 'engineArchitecture') {
    normStr = normStr.replace(/16-valve/i, '16v').replace(/16 valve/i, '16v');
  }
  if (fieldName === 'designer' || fieldName === 'engineer') {
    normStr = normStr.replace(/ & /g, ' / ').replace(/ and /g, ' / ');
  }

  return { normalizedValue: normStr, unit: defaultUnit };
}
