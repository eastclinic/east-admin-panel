module.exports = {
    apps: [
        {
            name: 'eastclinic-admin-panel',
            cwd: "/var/www/docker/app",
            exec_mode: 'cluster',
            instances: '2', // Or a number of instances
            script: './main.js',
            error_file: "/var/log/web.err.log",
            args: 'start',
            env_production: {
                "HOST": '0.0.0.0',
                "PORT": 3001,
                "NODE_ENV": "production"
            }
        }
    ]
}