var preset2015 = require('babel-preset-es2015');
var presetstage3 = require('babel-preset-stage-3');
var react = require('babel-preset-react');
var antdImport = require('babel-plugin-import');

fis.set('project.files', '/index.html'); // 按需编译。
// 改用 npm 方案，而不是用 fis-components
fis.unhook('components');
// 采用 commonjs 模块化方案。
fis.hook('commonjs', {
    baseUrl: './src',
    extList: ['.js', '.jsx', '.less', '.css']
});
fis.hook('node_modules');
// 设置成是模块化 js
fis.match('/{node_modules,src}/**.{js,jsx}', {
    isMod: true,
    useSameNameRequire: true
});

fis.match('{/src/**.js,*.jsx}', {
    parser: fis.plugin('babel-6.x', {
        presets: [
            react,
            preset2015,
            presetstage3
        ],
        plugins: [
            [antdImport, {
                "libraryName": "antd",
                "style": true
            }]
        ]
    }),
    isMod: true,
    useSameNameRequire: true,
    rExt: '.js'
});


fis.match('*.less', {
    parser: fis.plugin('less-2.x'),
    rExt: '.css',
    isMod: true
});
fis.match('::package', {
    postpackager: fis.plugin('loader')
});




fis.match('*.{js,jsx}', {
    preprocessor: fis.plugin('js-require-css')
});


// 请用 fis3 release production 来启用。
fis.media('prod')
    .match('(**/*.*)', {
        release: '/www/$1'
    })
    .match('src/(**.*)', {
        release: '/www/dist/$1'
    })
    .match('node_modules/(**.*)', {
        release: '/www/widget/$1'
    })
    // 对 js 做 uglify 压缩。
    .match('*.{js,jsx}', {
        optimizer: fis.plugin('uglify-js'),
        useHash: true
    })
    .match('*.{css,less}', {
        optimizer: fis.plugin('clean-css'),
        useHash: true
    })
    .match('::package', {
        // 更多用法请参考： https://github.com/fex-team/fis3-packager-deps-pack
        packager: fis.plugin('deps-pack', {
            'pkg/third.js': [
                'src/index.jsx:deps',
                '!src/**',
                '!node_modules/{antd,lodash,q}/**'
            ],
            'pkg/common.js': [
                'src/index.jsx:deps',
                '!src/**',
                'node_modules/{antd,lodash,q}/**'
            ],
            'pkg/index.js': [
                'src/index.jsx:deps',
                'src/index.jsx'
            ],
            'pkg/allStyle.css': [
                'src/index.jsx:deps',
                'src/index.jsx:asyncs',
                'src/index.jsx'
            ]
        })
    });