const path = require('path');
const { execSync } = require('child_process');

module.exports = function (ctx) {
    const pathiOS = path.join(ctx.opts.projectRoot, "platforms", "ios");
    console.log("Running pod deintegrate in: ", pathiOS);

    try {
        // Running 'pod deintegrate' to clear any existing integrations
        execSync('pod deintegrate', { cwd: pathiOS, stdio: 'inherit' });
        console.log("✅ pod deintegrate completed successfully.");
    } catch (error) {
        console.error("🚨 ERROR during pod deintegrate: ", error.message);
        throw error; // Consider whether you should continue if deintegrate fails
    }

    console.log("⚠️ Running pod install in: ", pathiOS);

    try {
        // Running 'pod install' with verbose output
        execSync('pod install --verbose', { cwd: pathiOS, stdio: 'inherit' });
        console.log("✅ pod install completed successfully.");
    } catch (error) {
        console.error("🚨 ERROR during pod install: ", error.message);
        throw error; // Stop the build process if pod install fails
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