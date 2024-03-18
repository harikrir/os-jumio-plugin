const fs = require('fs');
const path = require('path');
const xcode = require('xcode');

module.exports = function(context) {
    const projectRoot = context.opts.projectRoot;
    const iosPlatformPath = path.join(projectRoot, 'platforms', 'ios');
    const iosProjFolder = fs.readdirSync(iosPlatformPath).find(file => fs.statSync(path.join(iosPlatformPath, file)).isDirectory() && file.endsWith('.xcodeproj'));
    const projectPath = path.join(iosPlatformPath, iosProjFolder, 'project.pbxproj');
    const libPath = `"${path.join(context.opts.plugin.dir, 'src/ios/libarclite_iphoneos.a')}"`;

    if (!fs.existsSync(projectPath)) {
        throw new Error('🚨 Unable to find Xcode project file, skipping libarclite linking.');
    }

    const project = xcode.project(projectPath);
    project.parseSync();

    const buildConfigurations = project.pbxXCBuildConfigurationSection();
    for (const key in buildConfigurations) {
        const configuration = buildConfigurations[key];
        if (typeof configuration === 'object' && configuration.buildSettings) {
            let linkerFlags = configuration.buildSettings['OTHER_LDFLAGS'];
            if (!Array.isArray(linkerFlags)) {
                linkerFlags = linkerFlags ? [linkerFlags] : ['$(inherited)'];
            }
            // Check and append flags if not already present
            const forceLoadFlag = '-force_load';
            if (!linkerFlags.includes(forceLoadFlag)) {
                linkerFlags.push(forceLoadFlag);
            }
            if (!linkerFlags.includes(libPath)) {
                linkerFlags.push(libPath);
            }
            configuration.buildSettings['OTHER_LDFLAGS'] = linkerFlags;
        }
    }

    fs.writeFileSync(projectPath, project.writeSync());
    console.log('✅ Successfully added libarclite linker flag to the Xcode project.');
};
