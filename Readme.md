> 吾生也有涯，而知也无涯。 —— 孔子

## Local development

This site uses the same Jekyll dependency bundle as GitHub Pages.

```sh
brew install ruby@3.3
export PATH="/opt/homebrew/opt/ruby@3.3/bin:/opt/homebrew/lib/ruby/gems/3.3.0/bin:$PATH"
bundle install
bundle exec jekyll serve
```

Open <http://127.0.0.1:4000> to preview the site. Run
`bundle exec jekyll build` for a production build without starting the server.
