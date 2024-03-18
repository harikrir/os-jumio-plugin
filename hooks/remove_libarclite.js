const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

module.exports = function(context) {
    var deferral = context.requireCordovaModule('q').defer();

    // Define the path of libarclite and the flag file
    const libPath = '/Applications/Xcode-15.1.0.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/arc/libarclite_iphoneos.a';
    const flagFilePath = path.join(context.opts.projectRoot, "plugins", "mobile-cordova", 'hooks/.libarclite_added_flag');

    // Check if the flag file exists, indicating the lib was added by our hook
    fs.exists(flagFilePath, function(flagExists) {
        if (flagExists) {
            console.log('⚠️ Flag file found. Removing libarclite...');
            if (shell.rm(libPath).code === 0) {
                console.log('✅ libarclite successfully removed.');
                // Also remove the flag file
                fs.unlinkSync(flagFilePath);
                deferral.resolve();
            } else {
                console.error('🚨 Failed to remove libarclite. Manual removal might be necessary.');
                deferral.reject('Failed to remove libarclite.');
            }
        } else {
            console.log('⚠️ No flag file found. No removal action required.');
            deferral.resolve();
        }
    });

    return deferral.promise;
};
