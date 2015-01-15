serve a static, flat file based npm registry
--------------------------------------------

This is a toy project to:

1. serve any flat file copy of the NPM registry (whether you use https://github.com/davglass/registry-static or any other tool to create it)
2. build a flat file NPM registry based on any module already installed in your local machine. If the registry is offline, or not available, you can rebuild it from existing apps, and serve those installed modules from  your local machine.

usage
-----

### 1. Build a flat file NPM registry from a local app

```bash
npm install -g npm-mirror
cd path/to/app/node_modules/
create-npm-registry
```

You can run that command in multiple `node_modules` folders to add more modules to your local flat NPM registry.

### 2. Create a mirror of the NPM registry

This step is completely optional, and can be skipped.

```bash
npm install -g registry-static
registry-static -d my.registry.com -o /full/path/to/registry
```

_note: this step might take a while depending of your bandwidth, and it requires around 150GB of free space in your hard drive._

### 3. Serve from local host

Edit your `/etc/hosts` to add a new entry:

```
127.0.0.1 my.registry.com
```

Then run the cli command:

```bash
serve-npm-registry /full/path/to/registry
```

Keep in mind that the argument with the path to registry (e.g.: `/full/path/to/registry`) is optional. If not provided, only the flat registry created with `create-npm-registry` will be used without a fallback registry.

### 4. Install NPM packages

In the example below, it shows how to install a package called `express` from a custom NPM registry.

```
npm install express --registry http://my.registry.com/ --verbose
```

troubleshooting
---------------

If the `serve-npm-registry` command fails, use sudo, this is due to the fact that the registry it running in port `80`, which requires special privileges in Mac OSX.
