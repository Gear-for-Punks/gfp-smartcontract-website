import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Resources from "./pages/Resources";

Vue.use(Router);

export default new Router({
    // Make sure the server can handle the history mode
    // If not, set it to hash (or delete the mode)
    // More info here: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
    mode: "history",
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/stats",
            name: "stats",
            component: Stats
        },
        {
            path: "/resources",
            name: "resources",
            component: Resources
        }
    ],
    linkActiveClass: "active"
});