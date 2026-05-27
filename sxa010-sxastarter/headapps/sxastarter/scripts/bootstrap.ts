/*
  BOOTSTRAPPING
  The bootstrap process runs before build, and generates JS that needs to be
  included into the build - specifically, plugins, the global config module,
  and the component name to component mapping.
*/

/*
   PLUGINS GENERATION
*/
import './generate-plugins';

/*
  Legacy temp config generation has been removed for Content SDK flow.
  Runtime config is sourced from sitecore.config.ts.
*/

/*
  COMPONENT BUILDER GENERATION
*/
import './generate-component-builder';

/*
  META DATA GENERATION
*/
import './generate-metadata';
