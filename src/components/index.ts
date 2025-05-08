/**
 * This file helps Vite understand component relationships and optimize bundling
 * without requiring manual configuration for each component.
 */

// Re-export area components
import * as Areas from './areas';
export { Areas };

// Export sensor components with renamed EmptyState
import { EmptyState as SensorsEmptyState } from './sensors';
import * as Sensors from './sensors';
export { SensorsEmptyState };
export { Sensors };

// Export organization components with renamed EmptyState
import { EmptyState as OrganizationsEmptyState } from './organizations';
import * as Organizations from './organizations';
export { OrganizationsEmptyState };
export { Organizations };

// These would be added as you create barrel files for other modules
// export * from './devices'; 