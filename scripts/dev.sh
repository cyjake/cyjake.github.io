#!/usr/bin/env bash
set -e

export LANG="${LANG:-en_US.UTF-8}"
export LC_ALL="${LC_ALL:-en_US.UTF-8}"
export PATH="/opt/homebrew/opt/ruby@3.3/bin:/opt/homebrew/lib/ruby/gems/3.3.0/bin:$PATH"

exec bundle exec jekyll serve "$@"
