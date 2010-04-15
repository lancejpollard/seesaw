# http://neothemes.com/rofolio-demo/?cat=7
# http://blacksteel.x10hosting.com/contact.html
require 'rubygems'
require 'haml'
require 'sinatra'
require 'broadway'

set :public, "public"
set :views, "views"

get "/" do
  haml :index
end

post "/see" do
  puts params.inspect
  if params["input"]
    RedCloth.new(params["input"]).to_html
  else
    ""
  end
end