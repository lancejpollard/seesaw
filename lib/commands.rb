module Droplet::Commands
  
  COMMANDS = %w(
    accept_terms
    create_project
    create_github_project
    create_heroku_project
    push_to_github
    push_to_heroku
    create_custom_domain_name
    create_google_apps
    complete_google_apps
    verify_google_apps
  )
  
  def accept_terms
    
  end
  
  def create_project(name)
    puts %x[git init].inspect
    %x[emergent generate droplet #{name}]
    %x[git add . && git commit -a -m "first commit"]
    %x[git remote add origin]
  end
  
  def create_github_project
    %x[gh create]
  end
  
  def create_heroku_project(name)
    %x[heroku create #{name}]
  end
  
  def push_to_github
    %x[git push origin master]
  end

  def push_to_heroku
    %x[git push heroku master]
  end

  def create_custom_domain_name(domain)
    %x[heroku addons:add custom_domains]
    %x[heroku domains:add #{domain}]
  end

  def create_google_apps
    Googletastic::Apps.create
  end
  
  def complete_google_apps
    Googletastic::Apps.verify
  end

  def verify_google_apps
    # write verification code and push to heroku
  end
  
  def create_google_analytics
    Googletastic::Analytics.create
  end
  
  def add_analytics_key(key)
    YAML.dump("_config.yml", {:analytics => key})
  end
  
  def create_google_app_engine
    %x[appcfg.py update tmp/app.yml]
  end
  
  def zip_project
    # create temp zipfile
    @tempfile = Tempfile.new("droplet-tempfile-#{Time.now}-#{rand(10000)}")

    # zip contents
    Zip::ZipOutputStream.open(@tempfile.path) do |zipfile|
      paths = Dir["#{path}/**/**"] + Dir["#{path}/.git/**/**"]
      paths.each do |file|
        next if File.directory?(file)
        zipfile.put_next_entry(file)
        zipfile.print IO.read(file)
      end
    end
    
    @tempfile
  end
  
  def destroy_project(path)
    FileUtils.remove_entry_secure(path)
    @tempfile.close
  end
  
  class << self
    def include?(command)
      COMMANDS.include?(command)
    end
  end
end