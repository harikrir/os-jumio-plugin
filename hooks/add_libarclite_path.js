const xcode = require('xcode');
const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    const iosPlatformPath = path.join(context.opts.projectRoot, 'platforms', 'ios');
    const iosProjFolder = fs.readdirSync(iosPlatformPath).filter(file => fs.statSync(path.join(iosPlatformPath, file)).isDirectory() && file.endsWith('.xcodeproj'))[0];
    const projectPath = path.join(iosPlatformPath, iosProjFolder, 'project.pbxproj');

    // Load the project
    const project = xcode.project(projectPath);
    project.parseSync();

    // Determine the dynamic path
    const dynamicPath = path.join(context.opts.projectRoot, 'plugins', 'cordova-plugin-jumio-mobilesdk/src/ios'); ; // "\"$(PROJECT_DIR)/app/plugin/mobile-cordova/src/ios\"";

    Object.keys(project.pbxXCBuildConfigurationSection()).forEach((key) => {
        const buildConfig = project.pbxXCBuildConfigurationSection()[key];
        if (typeof buildConfig === 'object' && buildConfig.buildSettings) {
            const libSearchPaths = buildConfig.buildSettings['LIBRARY_SEARCH_PATHS'] || ['"$(inherited)"'];
            if (!libSearchPaths.includes(dynamicPath)) {
                libSearchPaths.push(dynamicPath);
                buildConfig.buildSettings['LIBRARY_SEARCH_PATHS'] = libSearchPaths;
            }
        }
    });

    // Write the modified project back to disk
    fs.writeFileSync(projectPath, project.writeSync());

    console.log('⭐️ Updated LIBRARY_SEARCH_PATHS in project.pbxproj');
};
