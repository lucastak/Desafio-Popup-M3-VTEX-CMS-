const gulp = require("gulp"),
	gulpif = require("gulp-if"),
	del = require("del"),
	connect = require("gulp-connect"),
	sourcemaps = require("gulp-sourcemaps"),
	autoprefixer = require("gulp-autoprefixer"),
	sass = require('gulp-sass')(require('sass')),
	imagemin = require("gulp-imagemin"),
	rename = require("gulp-rename"),
	apiMocker = require("connect-api-mocker"),
	sprity = require("sprity"),
	crypto = require("crypto"),
	glob = require("glob"),
	path = require("path"),
	inlinesource = require("gulp-inline-source");

const VtexEmulation = require("./dev/VtexEmulation.js");
const webpack = require("webpack");
const pacote = require("./package.json");

const isProduction = process.env.NODE_ENV === "production";

const paths = {
	styles: {
		src: "src/arquivos/sass/*.{scss,css,sass}",
		lib: "src/arquivos/sass/lib",
		watch: "src/arquivos/sass/**/*.scss",
	},
	scripts: {
		watch: "src/arquivos/js/**/*.js",
	},
	sprites: {
		src: "src/arquivos/sprite/**/*.{png,jpg}",
	},
	img: {
		src: "src/arquivos/img/**/*.{png,gif,jpg}",
		watch: "src/arquivos/img/**/*.{png,gif,jpg}",
	},
	fonts: {
		src: "src/arquivos/fonts/**.*",
	},
	html: {
		watch: "src/**/*.html",
		template: "src/template-pagina/",
		subTemplate: "src/template-pagina/sub-templates/",
		controlesVtex: "dev/controles-vtex/",
		controlesCustomizados: "src/controles-customizados/",
		prateleiras: "src/template-prateleira/",
	},
	output: "dist",
	outputStatic: "dist/arquivos",
	outputStaticCheckout: "dist/files",
	tmp: ".temp",
};

function clean() {
	return del([paths.output, paths.tmp]);
}

function styles() {
	return gulp
		.src(paths.styles.src)
		.pipe(gulpif(!isProduction, sourcemaps.init()))
		.pipe(
			sass({
				outputStyle: "compressed",
			}).on("error", sass.logError)
		)
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(
			rename({
				prefix: pacote.shopName + "--",
				extname: ".css",
			})
		)
		.pipe(gulpif(!isProduction, sourcemaps.write()))
		.pipe(gulp.dest(paths.outputStatic))
		.pipe(connect.reload());
}

function scripts() {
	let webpackConfig;

	switch (process.env.NODE_ENV) {
		case "production":
			webpackConfig = require("./webpack/webpack.prod.js");
			break;
		case "local":
			webpackConfig = require("./webpack/webpack.local.js");
			break;
		case "localfast":
			webpackConfig = require("./webpack/webpack.localfast.js");
			break;
		case "devfast":
			webpackConfig = require("./webpack/webpack.devfast.js");
			break;

		default:
			webpackConfig = require("./webpack/webpack.dev.js");
			break;
	}

	return new Promise((resolve) =>
		webpack(webpackConfig, (err, stats) => {
			if (err) console.log("Webpack", err);

			console.log(
				stats.toString({
					all: false,
					modules: true,
					maxModules: 0,
					errors: true,
					warnings: true,
					// our additional options
					moduleTrace: true,
					errorDetails: true,
					colors: true,
					chunks: true,
				})
			);

			resolve();
			connect.reload();
		})
	);
}

function sprites(done) {
	glob(paths.sprites.src, function (er, files) {
		const hash = crypto
			.createHash("md5")
			.update(files.join(""))
			.digest("hex");

		sprity.create(
			{
				engine: "sprity-jimp",
				src: paths.sprites.src,
				style: "./_sprite.scss",
				margin: 5,
				prefix: "sprite",
				processor: "css", // make sure you have installed sprity-sass
				cssPath: "/arquivos/",
				out: ".temp",
				name: pacote.shopName + "-sprite-" + hash,
				dimension: [
					{ ratio: 1, dpi: 72 },
					{ ratio: 2, dpi: 192 },
				],
				cachebuster: false,
			},
			() => {
				gulp.src(".temp/*")
					.pipe(
						gulpif(
							"*.png",
							gulp.dest("dist/arquivos/"),
							gulp.dest("src/arquivos/sass/lib")
						)
					)
					.pipe(connect.reload());
				done();
			}
		);
	});
}

function img() {
	let dest = paths.outputStatic;

	if (!(process.env.NODE_ENV === "local")) {
		dest = dest + "/img";
	}

	return gulp
		.src(paths.img.src)
		.pipe(gulpif(isProduction, imagemin()))
		.pipe(gulp.dest(paths.outputStatic))
		.pipe(connect.reload());
}

function html() {
	// config folders
	VtexEmulation.folders({
		template: paths.html.template,
		subTemplate: paths.html.subTemplate,
		controlesVtex: paths.html.controlesVtex,
		controleCustomizado: paths.html.controlesCustomizados,
		prateleira: paths.html.prateleiras,
	});

	VtexEmulation.startEngine();

	return gulp
		.src(VtexEmulation.folders().template + "*.html")
		.pipe(VtexEmulation.process())
		.pipe(
			inlinesource({
				compress: true,
				rootpath: path.resolve("src/arquivos"),
			})
		)
		.pipe(gulp.dest(paths.output))
		.pipe(connect.reload());
}

function htmlProd() {
	return gulp
		.src([
			paths.html.prateleiras + "**/*.html",
			paths.html.template + "**/*.html",
		])
		.pipe(
			inlinesource({
				compress: true,
				rootpath: path.resolve("src/arquivos"),
			})
		)
		.pipe(gulp.dest(paths.output));
}

function customFonts() {
	return gulp
		.src(paths.fonts.src)
		.pipe(
			rename((path) => ({
				dirname: "",
				basename: path.basename,
				extname: path.extname + ".css",
			}))
		)
		.pipe(gulp.dest(paths.outputStatic))
		.pipe(connect.reload());
}

function watch() {
	devServer();
	gulp.watch(paths.scripts.watch, { ignoreInitial: false }, scripts);
	gulp.watch(paths.sprites.src, { ignoreInitial: false }, sprites);
	gulp.watch(paths.styles.watch, { ignoreInitial: false }, styles);
	gulp.watch(paths.img.watch, { ignoreInitial: false }, img);
	gulp.watch(paths.html.watch, { ignoreInitial: false }, html);
	gulp.watch(paths.fonts.src, { ignoreInitial: false }, customFonts);
}

function devServer() {
	connect.server({
		root: paths.output,
		livereload: true,
		port: 3000,
		middleware: function (_connect, options) {
			console.log(_connect);
			var middlewares = [];

			// Api get user profile
			middlewares.push(
				apiMocker(
					"/no-cache/profileSystem/getProfile",
					"dev/api/usuario/"
				)
			);

			//api masterData
			middlewares.push(
				apiMocker(
					"/" + pacote.shopName + "/dataentities/",
					"dev/api/masterdata"
				)
			);

			//api masterData
			middlewares.push(
				apiMocker(
					"/api/catalog_system/pub/products/search/",
					"dev/api/produtos/"
				)
			);

			return middlewares;
		},
	});
}

const build = gulp.series(
	clean,
	gulp.parallel(
		htmlProd,
		gulp.series(sprites, customFonts, styles),
		scripts,
		img
	)
);

exports.build = build;
exports.clean = clean;
exports.scripts = scripts;
exports.styles = styles;
exports.img = img;
exports.html = html;
exports.devServer = devServer;
exports.watch = gulp.series(build, watch);
exports.sprites = sprites;
