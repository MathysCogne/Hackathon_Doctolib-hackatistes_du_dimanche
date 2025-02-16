import type { Plugin } from "@elizaos/core";
import { syncDashboardAction } from "./actions/syncDashboard";
import { emergencyDataEvaluator } from "./evaluators/emergencyData";
import { dashboardProvider } from "./providers/dashboard";

/**
 * Plugin de synchronisation des conversations d'urgence avec le dashboard
 * 
 * Ce plugin permet de :
 * - Synchroniser les conversations d'urgence avec le dashboard des call centers
 * - Évaluer les données d'urgence dans les conversations
 * - Fournir un contexte sur l'état du dashboard
 */
export const dashboardSyncPlugin: Plugin = {
    name: "@elizaos/plugin-dashboard-sync",
    description: "Plugin de synchronisation des conversations d'urgence avec le dashboard",
    actions: [syncDashboardAction],
    evaluators: [emergencyDataEvaluator],
    providers: [dashboardProvider]
};

// Export des composants individuels pour une utilisation flexible
export { syncDashboardAction } from "./actions/syncDashboard";
export { emergencyDataEvaluator } from "./evaluators/emergencyData";
export { dashboardProvider } from "./providers/dashboard";

// Export par défaut du plugin
export default dashboardSyncPlugin; 