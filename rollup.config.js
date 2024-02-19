import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'src/index.jsx',
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs',
                exports: 'auto'
            },
            {
                file: 'dist/index.es.js',
                format: 'es',
                exports: 'auto'
            }
        ],
        plugins: [
            postcss({
                plugins: [],
                minimize: true,
            }),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
                presets: [["@babel/preset-react", { runtime: "automatic" }],]
            }),
            external(),
            resolve(),
            terser(),
        ]
    }
];