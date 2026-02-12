/**
 * This file helps Vite understand component relationships and optimize bundling
 * without requiring manual configuration for each component.
 */

// Re-export area components
import * as Areas from './areas';
export { Areas };

import * as Sensors from './sensors';
export { Sensors };

import * as Organizations from './organizations';
export { Organizations };

// These would be added as you create barrel files for other modules
// export * from './devices'; 