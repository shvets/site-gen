import {createApp} from 'vue'
import fs from 'fs'
import path from 'path'
import marked from 'marked'

import pretty from 'pretty'

import { renderToString } from '@vue/server-renderer'

void async function main() {
  const posts = [
    {
      title: 'My First Blog Post',
      source: './my-first-blog-post.md',
      dest: './my-first-blog-post.html'
    }
  ]

  const inputDir = 'blog'
  const outputDir = 'site'

  fs.mkdir(path.join(__dirname, outputDir),
    { recursive: true }, (err) => {
      if (err) {
        return console.error(err)
      }
      console.log('Directory created successfully!')
    })

  const postTemplate = fs.readFileSync(inputDir + '/post-template.html', 'utf8')

  for (const post of posts) {
    let content = fs.readFileSync(inputDir + '/' + post.source, 'utf8')
    content = marked(content)
    const app = createApp({
      template: postTemplate,
      data: () => ({ ...post, content })
    })
    // Write prettified HTML
    fs.writeFileSync(outputDir + '/' + post.dest, pretty(await renderToString(app)))
    console.log('Wrote', post.dest)
  }

  const listTemplate = fs.readFileSync(inputDir + '/' + 'list-template.html', 'utf8')

  const app = createApp({
    template: listTemplate,
    data: () => ({ posts })
  })

  // Write prettified HTML
  fs.writeFileSync(outputDir + '/' + 'index.html', pretty(await renderToString(app)))
}()
