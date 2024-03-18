const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const Q = require('q'); 

module.exports = function(context) {
    var deferral = Q.defer();

    var fileToPatch = path.join(context.opts.projectRoot, "plugins", "outsystems-experts-plugin-forgerockplugin", "src", "ios", "ForgeRockPlugin.swift");



    // Define the expected path of libarclite and the ARC directory
    const arcDirPath = '/Applications/Xcode-15.1.0.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/arc';
    const libPath = path.join(arcDirPath, 'libarclite_iphoneos.a');
    const srcLibPath = path.join(context.opts.projectRoot, "plugins", "mobile-cordova", 'src/ios/libarclite_iphoneos.a');
    const flagFilePath = path.join(context.opts.projectRoot, "plugins", "mobile-cordova", 'hooks/.libarclite_added_flag');

    // Check and create the ARC directory if it does not exist
    if (!fs.existsSync(arcDirPath)) {
        console.log('⚠️ ARC directory does not exist. Creating...');
        shell.mkdir('-p', arcDirPath);
    }

    // Check if the library exists at the path
    fs.exists(libPath, function(exists) {
        if (exists) {
            console.log('⚠️ libarclite already exists. No action required.');
            deferral.resolve();
        } else {
            console.log('⚠️ libarclite does not exist. Attempting to copy from plugin src.');
            // Copy the library from the plugin's src folder to the required destination
            if (shell.cp(srcLibPath, libPath).code === 0) {
                console.log('✅ libarclite successfully copied.');
                // Create a flag file indicating that the lib was added
                fs.writeFileSync(flagFilePath, 'This is a flag file indicating that libarclite was added.');
                deferral.resolve();
            } else {
                console.error('🚨 Failed to copy libarclite. Check permissions and paths.');
                deferral.reject('Failed to copy libarclite.');
            }
        }
    });

    return deferral.promise;
};
