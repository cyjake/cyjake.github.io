---
title: Make irb Support non-ASCII Characters
layout: post
---

For non-English speaking programmers, it's a bless that we can input some non-ASCII characters
into ruby console directly for mocking data or something similar. But sometimes this might not
work:

```bash
$ rvm install 1.9.3
```

In `irb`, the characters you input might turn out to be something like
`\U+FFD1\U+FFD0\U+FFB5\U+FFD1\U+FFD1`. That's because of your installed ruby is not
compiled with readline support. Thanks to gists like this, the
[solution](https://gist.github.com/1968562) is easy to google:

```bash
$ rvm get latest
$ rvm pkg install readline
$ rvm install 1.9.3 --with-readline-dir=$rvm_path/usr
```

This solution is available on [rvm.io](https://rvm.io/packages/readline/) also.

But yesterday I encountered an issue a little bit different than this.
`irb` did not recognize my inputs at all, not even something like `\U+FFD1`.
After two hours of googling and recompilation, no solution works.
Then I checked the `locale` of my console (a little bit too late, I know):

```bash
$ locale
LANG="C"
LC_COLLATE="C"
LC_CTYPE="C"
LC_MESSAGES="C"
LC_MONETARY="C"
LC_NUMERIC="C"
LC_TIME="C"
LC_ALL=
```

Gotcha! Then I did two things

1. checked my [terminal configuration](http://stackoverflow.com/a/2936107/179691).
   make sure the character encoding is selected to UTF-8 and it will set LANG environment variable
   on startup. If you use iTerm2, check the same.
2. changed my preference, System Preferences -> Language & Text -> Formats.
   The late configuration was China (English), which looks weird. I changed it to United States.

Finally it works.
