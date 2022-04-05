import "regenerator-runtime/runtime.js";
import "proxy-polyfill/proxy.min.js";
import "lazysizes";
import "lazysizes/plugins/noscript/ls.noscript";
import "slick-carousel";
import app from "./app/app";

window.lazySizesConfig = {
	addClasses: true,
};

app.start();
