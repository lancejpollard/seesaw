# http://neothemes.com/rofolio-demo/?cat=7
# http://blacksteel.x10hosting.com/contact.html
require 'rubygems'
require 'haml'
require "RedCloth"
begin
  require "bluecloth"
  require "clothred"
rescue Exception => e
  puts "Heroku can't load get #{e.to_s}"
end
require 'haml/exec'
require 'haml/html'
require 'sinatra'
require 'broadway'
require "rest_client"

set :public, "public"
set :views, "views"

APPLICATION_DOMAIN = "meetseesaw.com"

configure :production do
  before do
    if request.env['HTTP_HOST'] != APPLICATION_DOMAIN
      redirect APPLICATION_DOMAIN
    end
  end
end

get "/" do
  haml :index
end

get "/lessons/:lesson" do
  if params["lesson"] == "textile"
    IO.read("public/posts/textile-intro.textile")
  elsif params["lesson"] == "markdown"
    IO.read("public/posts/markdown-intro.textile")
  else
    ""
  end
end

def minify(input, type)
  options = {
    :compresstext => input,
    :type => type.upcase
  }
  response = RestClient.post "http://refresh-sf.com/yui/", options
  html = Nokogiri::HTML(response.to_s)
  minified = html.xpath("//textarea[@class='output']").first.text
  stats = html.xpath("//dl[@class='stats']").first
  stats_hash = {}
  keys = stats.xpath("dt")
  values = stats.xpath("dd")
  keys.each_with_index do |child, index|
    stats_hash[child.text] = values[index].text
  end
  minified
end

# there are no beautifiers for ruby! using javascript for now
def beautify(input, type)
  input
end

post "/see" do
  if input = params["input"]
    output_format = params["output_format"]
    case params["input_format"]
    when "html"
      case output_format
      when "html"
        input
      when "textile"
        ClothRed.new(input).to_textile
      when "markdown"
        input # no html -> markdown converter
      when "haml"
        output = Haml::HTML.new(input).render
      end
    when "textile"
      case output_format
      when "html"
        RedCloth.new(input).to_html
      when "textile"
        input
      when "markdown"
        input # no html -> markdown converter
      when "haml"
        output = RedCloth.new(input).to_html
        output = Haml::HTML.new(output).render
      end
    when "markdown"
      case output_format
      when "html"
        BlueCloth.new(input).to_html
      when "textile"
        output = BlueCloth.new(input).to_html
        output = ClothRed.new(output).to_textile
      when "markdown"
        input
      when "haml"
        output = BlueCloth.new(input).to_html
        output = Haml::HTML.new(output).render
      end
    when "haml"
      case output_format
      when "html"
        Haml::Engine.new(input).render
      when "textile"
        output = Haml::Engine.new(input).render
        output = ClothRed.new(output).to_textile
      when "markdown"
        input # no markdown!
      when "haml"
        input
      end
    when "css"
      case output_format
      when "minified"
        minify(input, "css")
      when "beautified"
        beautify(input, "css")
      end
    when "js"
      case output_format
      when "minified"
        minify(input, "js")
      when "beautified"
        beautify(input, "js")
      end
    end
  else
    ""
  end
end