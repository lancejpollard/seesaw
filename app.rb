# http://neothemes.com/rofolio-demo/?cat=7
# http://blacksteel.x10hosting.com/contact.html
require 'rubygems'
require 'sinatra'
require 'haml'
require "RedCloth"
require "BlueCloth"
require "ClothRed"
require 'haml/exec'
require 'haml/html'
require 'broadway'

set :public, "public"
set :views, "views"

get "/" do
  haml :index
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
    end
  else
    ""
  end
end