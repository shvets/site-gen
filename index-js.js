const Vue = require('vue');
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const pretty = require('pretty');

const { renderToString } = require('@vue/server-renderer');

void async function main() {
  const posts = [
    {
      title: 'My First Blog Post',
      source: './my-first-blog-post.md',
      dest: './my-first-blog-post.html'
    }
  ];

  const inputDir = 'blog'
  const outputDir = 'site'

  fs.mkdir(path.join(__dirname, outputDir),
    { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log('Directory created successfully!');
    });

  const postTemplate = fs.readFileSync(inputDir + '/post-template.html', 'utf8');

  for (const post of posts) {
    let content = fs.readFileSync(inputDir + '/' + post.source, 'utf8');
    content = marked(content);
    const app = Vue.createApp({
      template: postTemplate,
      data: () => ({ ...post, content })
    });
    // Write prettified HTML
    fs.writeFileSync(outputDir + '/' + post.dest, pretty(await renderToString(app)));
    console.log('Wrote', post.dest);
  }

  const listTemplate = fs.readFileSync(inputDir + '/' + 'list-template.html', 'utf8');

  const app = Vue.createApp({
    template: listTemplate,
    data: () => ({ posts })
  });

  // Write prettified HTML
  fs.writeFileSync(outputDir + '/' + 'index.html', pretty(await renderToString(app)));
}();
