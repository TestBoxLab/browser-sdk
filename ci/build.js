const { build } = require('esbuild');
const { dependencies, peerDependencies } = require('../package.json');
const { Generator } = require('npm-dts');

build({
    entryPoints: ["src/index.ts"],
    outdir: 'lib',
    bundle: true,
    external: Object.keys(dependencies || {}).concat(Object.keys(peerDependencies || {}))
});

new Generator({
  entry: 'src/index.ts',
  output: 'lib/index.d.ts',
}).generate()