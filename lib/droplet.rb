class Droplet
  include Droplet::Commands
  
  # title of the website
  attr_accessor :title
  
  # domain name for the website (domain.com, no www)
  attr_accessor :domain
  
  # content delivery network, google or amazon
  attr_accessor :cdn
  
  # filename version of title
  attr_accessor :name
  
  def build
    old_dir = Dir.pwd
    Dir.chdir "tmp/project"
    
    # base
    create_project
    
    # github
    create_github_project
    push_to_github
    
    # heroku
    create_heroku_project
    push_to_heroku
    create_custom_domain_name
    
    Dir.chdir old_dir
  end
  
  def zip
    zip_project
  end
  
  def download(downloader)
    downloader.send_file t.path, :type => 'application/zip', :disposition => 'attachment', :filename => "zip-javascript.zip"
  end
  
  def destroy
    destroy_project
  end
  
  def analyze
    create_google_analytics
    add_analytics_key
  end
  
  def administer
    create_google_apps
    create_google_analytics
  end
  
  def verify
    complete_google_apps
    verify_google_apps
  end
  
end