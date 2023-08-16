module.exports = {
    apps: [
        {
            name: "backend-kidup",
            exec_mode: "cluster",
            instances: 2,
            script: "./index.js",
        }
    ]
}