const path = require('path');
const fs = require('fs');

module.exports = function (ctx) {

    console.log("Started merging pod files to add the post_install script");
    var rootdir = ctx.opts.projectRoot;
    var projectPodfilePath = path.join(rootdir, "platforms", "ios", "Podfile");
    var pluginPodfilePath = path.join(ctx.opts.plugin.dir, "src", "ios", "Podfile");

    var projectPodfile = fs.readFileSync(projectPodfilePath,"utf-8");

    var pluginPodfile = fs.readFileSync(pluginPodfilePath,"utf-8");

    projectPodfile = projectPodfile +"\n"+ pluginPodfile;

    fs.writeFileSync(projectPodfilePath,projectPodfile);

}