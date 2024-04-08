
# Calpis

Calpis is lightweight, native and fast Gulp alternative. It is **8x faster** than Gulp on NodeJS and **4x faster** than Gulp on Bun.

> **Note:** This project is in early development stage.
> It works only with [Bun](https://bun.sh) to achieve maximum performance.

## Getting started

First, add package `calpis` to your project:

```bash
bun install calpis
```

Then, create `calpis.config.js` in the root of your project:

```js
import { pipeline, read, write, gzip } from 'calpis';

export const html = pipeline(
    // read HTML files inside current working directory by glob
    read(
        { base: 'source' }, // specify a base to replace it on write() calls
        '**/*.html',
    ),
    // write files to build directory
    write('build'),
    // compress the same file — extenstion will be changed to .html.gz
    gzip({
        level: 9,
    }),
    // write compressed files to build directory
    write('build'),
);
```

Run it:

```bash
bunx calpis html
```

## Create your own modules

Let's create a module that will minify HTML files. Create two files: `/modules/html-minify/module.js` with actial module...

```js
import { minify }     from '@minify-html/node';
import { CalpisFile } from 'calpis';

// export your module as default
export default function htmlMinify(options) {
    return new TransformStream({
        transform(calpisFile, controller) {
            const result = minify(
                // get file content as NodeJS Buffer
                calpisFile.get(
                    CalpisFile.TYPE_NODEJS_BUFFER,
                ),
                options,
            );

            // set new content
            calpisFile.set(result);

            controller.enqueue(calpisFile);
        },
    });
}
```

... and `/modules/html-minify/declaration.js` with module declaration:

```js
export function minifyHTML(options) {
    return {
        module: () => import('./module.js'),
        // options for @minify-html/node
        args: [ options ],
    };
}
```

Now use that module in your pipeline:

```js
import { pipeline, read, write, gzip } from 'calpis';
import { htmlMinify } from './modules/html-minify/declaration.js';

export const html = pipeline(
    read(
        { base: 'source' },
        '**/*.ejs',
    ),
    htmlMinify({
        do_not_minify_doctype: true,
        keep_html_and_head_opening_tags: true,
        keep_spaces_between_attributes: true,
        minify_js: true,
        minify_css_level_1: true,
    }),
    write('build'),
    gzip({
        level: 9,
    }),
    write('build'),
);
```

## Why Calpis fast?

### No imports unless needed

In Gulp, you have to import all your modules in `gulpfile.js`, even if task you run does not use them. For example, running CSS tasks will import modules required by JS task.

In Calpis, all modules must have importless declaration — this is why we created two files previously. Calpis will import actual modules with their dependencies only when you run task that uses them. That approach dramatically reduces startup time.

### Native streams

Calpis uses Web Streams API — and core part of Calpis modules is [TransformStream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream). It is native, fast and platform-independent.

### No dependencies

Surprisingly, Calpis does not have any dependencies.

> TODO
> Update this section with actual data

| | `gulp@4.0.2` | `calpis@0.1.0` | Difference |
| --- | --- | --- | --- |
| Packages installed | 336 | 2 | **99% less** |
| `node_modules` size | ≈ 8 433 389 bytes | ≈ 105 589 bytes | **98% smaller** |
| Time to compile EJS, minify HTML and Gzip | 203.6 ms with Bun <br> 376.1 ms with NodeJS | 42.2 ms | **4.83x faster** <br> **8.92x faster** |

### Bun

Calpis uses [Bun](https://bun.sh), which starts [4x faster than NodeJS](https://twitter.com/jarredsumner/status/1499225725492076544) and also provides:

- File I/O that [10x faster than NodeJS](https://bun.sh/docs/api/file-io#benchmarks);
- [glob matcher](https://bun.sh/docs/api/glob) that matches strings [3x faster](https://bun.sh/blog/bun-v1.1#bun-glob) than `fast-glob` and `picomatch` packages;
- faster [gzip compression](https://bun.sh/docs/api/utils#bun-gzipsync).
