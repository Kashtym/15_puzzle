import replace from "gulp-replace"; //find and replace
import plumber from "gulp-plumber"; //errors handler
import notify from "gulp-notify"; //show errors
import browserSync from "browser-sync"; //local server
import newer from "gulp-newer"; //check updates
import gulpIf from "gulp-if"; //if plugin

// global plugins
export const plugins = {
    replace: replace,
    plumber: plumber,
    notify: notify,
    browserSync: browserSync,
    newer: newer,
    gulpIf: gulpIf,
};
