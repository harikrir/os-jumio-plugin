const fs = require('fs');
const path = require('path');
const xcode = require('xcode');

module.exports = function(context) {
    const projectRoot = context.opts.projectRoot;
    const iosPlatformPath = path.join(projectRoot, 'platforms', 'ios');
    const iosProjFolder = fs.readdirSync(iosPlatformPath).find(file => fs.statSync(path.join(iosPlatformPath, file)).isDirectory() && file.endsWith('.xcodeproj'));
    const projectPath = path.join(iosPlatformPath, iosProjFolder, 'project.pbxproj');
    const libPath = path.join(context.opts.projectRoot, 'plugins', 'cordova-plugin-jumio-mobilesdk/src/ios/libarclite_iphoneos.a');

    if (!fs.existsSync(projectPath)) {
        throw new Error('🚨 Unable to find Xcode project file, skipping libarclite linking.');
    }

    const project = xcode.project(projectPath);
    project.parseSync();

    const buildConfigurations = project.pbxXCBuildConfigurationSection();
    Object.keys(buildConfigurations).forEach(key => {
        const configuration = buildConfigurations[key];
        if (typeof configuration === 'object' && configuration.buildSettings) {
            const linkerFlags = configuration.buildSettings['OTHER_LDFLAGS'] || ['$(inherited)'];
            // Add the linker flag if it's not already present
            if (!linkerFlags.includes('-force_load') && !linkerFlags.includes('libarclite_iphoneos.a')) {
                linkerFlags.push('-force_load');
                linkerFlags.push(libPath);
                configuration.buildSettings['OTHER_LDFLAGS'] = linkerFlags;
            }
        }
    });

    fs.writeFileSync(projectPath, project.writeSync());
    console.log('✅ Successfully added libarclite linker flag to the Xcode project.');
};
