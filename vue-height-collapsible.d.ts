import Vue, { PluginFunction, VueConstructor } from 'vue';

declare const VueHeightCollapsible: VueConstructor<Vue> & { install: PluginFunction<any>; };
export default VueHeightCollapsible;
