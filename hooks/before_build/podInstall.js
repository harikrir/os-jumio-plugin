const path = require('path');
const { execSync } = require('child_process');

module.exports = function (ctx) {
    const pathiOS = path.join(ctx.opts.projectRoot, "platforms", "ios");
    
    try {
        const result = execSync('pod install', { cwd: pathiOS, stdio: 'inherit' });
        console.log("✅ Pod install process finished.");
    } catch (error) {
        console.error("🚨 ERROR during pod install: ", error);
        // Consider whether you should throw the error to stop the build process
        throw error;
    }
};

/*const path = require('path');
var child_process = require('child_process');

module.exports = function (ctx) {
    var pathiOS = path.join(ctx.opts.projectRoot,"platforms","ios");
    
    var child = child_process.execSync('pod install', {cwd:pathiOS});
    console.log("Process finished.");
    if(child.error) {
        console.log("ERROR: ",child.error);
    }
}*/