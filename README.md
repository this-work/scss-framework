# THIS - SCSS Framework
The framework is a toolbox of sass declarations and functions to harmonise the coding. The toolbox contains 
only empty declarations and must be filled or set via a superordinate framework, e.g. the THIS Onion Framework.


#### Requirements
- [Dart Sass](https://github.com/sass) >= 1.80.6
- Recommend: THIS Onion Framework

#### Install

Install the framework via node and NPM in your project.

```bash
npm install @this/scss-framework --save-dev
```

#### Using

To use the framework inlcude the main framework.scss with a @use import in every document you want to use it.

```css
@use '@/node_modules/scss-framework/framework' as *;
```


#### Develop Requirements
- [Dart Sass](https://github.com/sass) >= 1.80.6
- [NodeJS 20](https://nodejs.org/en/)
