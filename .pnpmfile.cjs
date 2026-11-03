const typescript6 = "npm:@typescript/typescript6@^6.0.2"
const needsCompilerApi = new Set(["tsup", "@angular/compiler-cli", "@angular/build", "@analogjs/vite-plugin-angular"])

module.exports = {
  hooks: {
    readPackage(pkg) {
      if (needsCompilerApi.has(pkg.name)) {
        delete pkg.peerDependencies?.typescript
        delete pkg.peerDependenciesMeta?.typescript
        pkg.dependencies = { ...pkg.dependencies, typescript: typescript6 }
      }
      return pkg
    },
  },
}
