const { series, src, dest, watch } = require("gulp");
const nunjucksRender = require("gulp-nunjucks-render");
const purgecss = require("gulp-purgecss");
const browserSync = require("browser-sync");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const cache = require("gulp-cache");
const data = require("gulp-data"); // This plugin calls the JSON data file.
const fs = require("fs"); // Using for the JSON parsing...
let albums = null;

// Nunjucks HTML templating engine
function nunjucks(done) {
	return src("src/pages/**/*.njk")
		.pipe(
			data(
				(albums = function () {
					return JSON.parse(fs.readFileSync("src/assets/data/db-albums.json"));
				})
			)
		)
		.pipe(nunjucksRender({ path: ["src/templates"] }))
		.pipe(dest("public"));
	done();
}

// Sass compiler
function sassify(done) {
	return src("src/assets/sass/**/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: "expanded" }))
		.on("error", function swallowError(error) {
			console.log(error.toString());
			this.emit("end");
		})
		.pipe(sourcemaps.write())
		.pipe(dest("public/css"))
		.pipe(browserSync.reload({ stream: true }));
	done();
}

// Move JS to public
function js(done) {
	return src("src/assets/js/*.js")
		.pipe(dest("public/js"))
		.pipe(browserSync.reload({ stream: true }));
}

function browser_sync(done) {
	browserSync.init({
		watch: true,
		server: { baseDir: "public" },
		open: false,
		port: 5000,
	});
	done();
}

function distFonts() {
	return src("public/fonts/**/*.+(woff|woff2)").pipe(dest("dist/fonts"));
}

function distHtml() {
	return src("public/**/*.html").pipe(dest("dist"));
}

function distJS() {
	return src("public/js/**/*.js").pipe(dest("dist/js"));
}

function distImages() {
	return src("public/images/**/*.+(png|jpg|gif|svg)").pipe(dest("dist/images"));
}

function distCss() {
	return src("public/css/**/*.css")
		// .pipe(
		// 	purgecss({
		// 		content: ["public/**/*.html"],
		// 	})
		// )
		.pipe(dest("dist/css/"));
}

// Deletes the dist folder
function clean_dist() {
	return del("./dist");
}

// Cleans the cache
function clear_cache(done) {
	return cache.clearAll(done);
}

function watch_files(done) {
	watch("src/**/*.njk", nunjucks);
	watch("src/**/*.json", nunjucks);
	watch("src/**/*.scss", sassify);
	watch("src/**/*.js", js);
	watch("src/**/*.html", browserSync.reload);
	done();
}

exports.start = series(
	clear_cache,
	browser_sync,
	sassify,
	js,
	nunjucks,
	watch_files
);
exports.build = series(clear_cache, sassify, js, nunjucks);
exports.dist = series(
	clean_dist,
	sassify,
	distFonts,
	distCss,
	distJS,
	distImages,
	distHtml
);
