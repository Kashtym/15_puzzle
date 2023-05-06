"use strict";
// import

//import gulp
import gulp from "gulp";

//import path
import { path } from "./gulp/config/path.js";

//import global plugins
import { plugins } from "./gulp/config/plugins.js";

// create global variable with path and gulp
global.app = {
    isBuild: process.argv.includes("--build"),
    isDev: !process.argv.includes("--build"),
    path: path,
    gulp: gulp,
    plugins: plugins,
};

//import tasks
import { copy } from "./gulp/tasks/copy.js";
import { del } from "./gulp/tasks/del.js";
import { html } from "./gulp/tasks/html.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { server } from "./gulp/tasks/server.js";

//create watcher
function watching() {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
}

//main task
const mainTasks = gulp.parallel(copy, html, scss, js);

//create task dev, build
const dev = gulp.series(del, mainTasks, gulp.parallel(watching, server));
const build = gulp.series(del, mainTasks);

gulp.task("dev", dev);
gulp.task("build", build);

//default task
gulp.task("default", dev);
