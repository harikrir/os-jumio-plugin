// hooks/after_platform_add/modify_xcode_settings.js

module.exports = function (context) {
    if (context.opts.cordova.platforms.includes('ios')) {
        const fs = require('fs');
        const path = require('path');
        const xcode = require('xcode');

        const iosPlatformPath = path.join('platforms', 'ios');
        const projectFiles = fs.readdirSync(iosPlatformPath).filter(file => file.endsWith('.xcodeproj'));
        const COMMENT_KEY = /_comment$/;
        
        if (projectFiles.length === 0) {
            console.error('No Xcode project found in the "platforms/ios" directory.');
            return;
        }

        const projectName = projectFiles[0].replace('.xcodeproj', '');
        const projectPath = path.join(iosPlatformPath, `${projectName}.xcodeproj/project.pbxproj`);

        const xcodeProject = xcode.project(projectPath);
        console.log("projectPath", projectPath);
        xcodeProject.parse(function (error) {
            if (error) {
                console.error('Failed to parse Xcode project:', error);
                return;
            }
            
            /*xcodeProject.AddBuildProperty('BUILD_LIBRARY_FOR_DISTRIBUTION', 'YES', 'Debug');
            xcodeProject.AddBuildProperty('BUILD_LIBRARY_FOR_DISTRIBUTION', 'YES', 'Release');*/


            let buildConfigs = xcodeProject.pbxXCBuildConfigurationSection();

            for (configName in buildConfigs) {
                if (!COMMENT_KEY.test(configName)) {
                    buildConfig = buildConfigs[configName];
                    if (xcodeProject.getBuildProperty('BUILD_LIBRARY_FOR_DISTRIBUTION', buildConfig.name) !== "YES") {
                        xcodeProject.updateBuildProperty('BUILD_LIBRARY_FOR_DISTRIBUTION', "YES", buildConfig.name);
                    }
                }
            }
      
            // Modify build settings here
            // For example, set BUILD_LIBRARY_FOR_DISTRIBUTION to YES
            // Get build settings for Debug configuration
            /*console.log("xcodeProject.pbxXCBuildConfigurationSection()[xcodeProject.getTarget('Debug')]", xcodeProject.pbxXCBuildConfigurationSection()[xcodeProject.getTarget('Debug')])
            const debugBuildSettings = xcodeProject.pbxXCBuildConfigurationSection()[xcodeProject.getTarget('Debug')].buildSettings;

            // Get build settings for Release configuration
            const releaseBuildSettings = xcodeProject.pbxXCBuildConfigurationSection()[xcodeProject.getTarget('Release')].buildSettings;

            // Modify the BUILD_LIBRARY_FOR_DISTRIBUTION flag
            debugBuildSettings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES';
            releaseBuildSettings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES';*/

            fs.writeFileSync(projectPath, xcodeProject.writeSync());
            console.log('Xcode project modified successfully.');
        });
    }
};