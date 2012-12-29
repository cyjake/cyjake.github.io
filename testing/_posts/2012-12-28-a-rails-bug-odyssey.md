---
title: A Rails Bug Odyssey
caption: Functional Testing with Authlogic and Cancan
layout: post
---

Yesterday one of the adminitrators of [ux.etao.com](http://ux.etao.com), which is a
website developed with Ruby on Rails, reported a bug saying that cannot
change the categorization of some posts. The cause of that bug was obvious.
There are several types of posts, such as Post, Work, Brick and so on.
The category part share the polymophyism. There are PostCategory and BrickCategory.
These two category models both `has_many :posts`.

{% highlight ruby %}
class PostCategory < Category
  has_many :posts, :foreign_key => :category_id
end
{% endhighlight %}

{% highlight ruby %}
class BrickCategory < Category
  has_many :posts, :class_name => 'Brick', :foreign_key => :category_id
end
{% endhighlight %}

BrickCategory should `has_many :bricks`. But to cut long story short, it
`has_many :posts` for brevity in views.

And back to the bug. The cause is that the category should be an instance of
BrickCategory but it appeared to be PostCategory instead. So it was searching
wrong type of `posts'. We can simply run this to rectify data:

{% highlight ruby %}
# c.channel.brick? determines whether or not this category should be BrickCategory
# We can update the type column with #update_column
Category.find_each do |c|
  c.update_column(:type, 'BrickCategory') if c.channel.brick?
end
{% endhighlight %}

Now let's fix the controller that wronged those poor categories at the first place.
First things first, we shall enrich our functional test. The controller is
`app/controllers/categories_controller.rb`. Hence the test file should be
`test/functional/categories_controller_test.rb`.

{% highlight ruby %}
class CategoriesControllerTest < ActionController::TestCase

  test "brick category creation" do
    post :create, :category => {
      :name => '我是个小类目',
      :channel_id => channels(:bricks).id
    }

    ret = JSON.parse @response.body
    assert_not_nil ret['id']

    category = Category.find(ret['id'])
    assert_equal category.channel_id, channels(:bricks).id
    assert category.channel.brick_channel?
    assert_instance_of BrickCategory, category
  end
end
{% endhighlight %}

Let's fire it up:

{% highlight bash %}
$ ruby -Itest test/functional/categories_controller_test.rb
{% endhighlight %}

The first time I run this command, it returned nothing but a line saying that
there was an error. Where is my backtrace? After an hour of googling and frustration,
I [figured out finnaly](http://stackoverflow.com/questions/7633839/turn-on-full-backtrace-in-ruby-on-rails-testcase/9322081#9322081).

It's because of some stupid gem. I curse you `gem 'turn', '0.8.2'`.
Just remove the `0.8.2` part, run `bundle update turn`.

Now the backtrace is back, pun not intended. The `JSON.parse @response.body` failed.
The value of `@response.body` looks like this:

{% highlight html %}
<html><body>You are being <a href="http://test.host/login">redirected</a>.</body></html>
{% endhighlight %}

That's because of cancan. To create some category, one need to login first and
he should be able to perform that action. That said, `can? :create, Category.new   # ==> true`.

This project uses authlogic. In controllers, to login programmaticly,
we just do `UserSession.create(some_user)` then everything is good to go.
But in the test environment things is a little bit complicated than that.
The author of authlogic [documented this](http://rdoc.info/github/binarylogic/authlogic/master/Authlogic/TestCase).

First, include this line at the top of your `test_helper.rb` which should be found
right in the `test` folder.

{% highlight ruby %}
require "authlogic/test_case" # include at the top of test_helper.rb
{% endhighlight %}

Next, we need to `activate_authlogic` in the #setup method.
Put this in your test file, in this case the `test/functional/categories_controller_test.rb`.

{% highlight ruby %}
def setup
  activate_authlogic
end
{% endhighlight %}

Read [the rails guide](http://guides.rubyonrails.org/testing.html#setup-and-teardown)
if you want more about the #setup method in testing.

But to keep things tidy. You can just put this line at the bottom of `test_helper.rb`.

{% highlight ruby %}
setup :activate_authlogic # run before tests are executed
{% endhighlight %}

Then you can login any user defined in the `test/fixtures/users.yml` now:

{% highlight ruby %}
UserSession.create(users(:whomever)) # logs a user in
{% endhighlight %}

There's still a gotcha. Authlogic uses the `persistence_token` attribute of the User model
to login that user. It puts that value into `session[:user_credentials]` and uses that
to fetch the logged in user.

So to make it work. You should fill that column in the users fixture too.

{% highlight yaml %}
john:
  email: john.doe@foobar.com
  roles: admin
  password_salt: <%= salt = Authlogic::Random.hex_token %>
  crypted_password: <%= Authlogic::CryptoProviders::Sha512.encrypt("doe" + salt) %>
  persistence_token: <%= Authlogic::Random.hex_token %>
  perishable_token: <%= Authlogic::Random.friendly_token %>
{% endhighlight %}

The functional test is complete finnaly. But your rails odyssey does not end here.
[Sail](http://www.xiami.com/song/1770323259) on my friend.