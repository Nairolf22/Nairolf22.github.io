module CityPageGenerator
  class CityPage < Jekyll::Page
    def initialize(site, base, city)
      @site = site
      @base = base
      dir_name = Utils.slugify(city) # Macht aus "Mönchengladbach" -> "moenchengladbach"
      @dir = File.join('city', dir_name)
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'city_hub.html')
      
      # Hier übergeben wir die Stadt an das Layout
      self.data['city'] = city
      
      # SEO Titel setzen
      self.data['title'] = "Escape Rooms in #{city} - Testberichte & Erfahrungen"
    end
  end

  class CityPageGenerator < Jekyll::Generator
    safe true

    def generate(site)
      if site.layouts.key? 'city_hub'
        # Alle Städte sammeln
        cities = site.collections['reviews'].docs.map { |doc| doc.data.dig('location', 'city') }.compact.uniq

        # Für jede Stadt eine Seite bauen
        cities.each do |city|
          site.pages << CityPage.new(site, site.source, city)
        end
      end
    end
  end
  
  # Hilfsfunktion für saubere URLs (Umlaute etc.)
  module Utils
    def self.slugify(text)
      text.to_s.downcase.strip.gsub(' ', '-').gsub(/[äöüß]/) do |match|
        case match
        when 'ä' then 'ae'
        when 'ö' then 'oe'
        when 'ü' then 'ue'
        when 'ß' then 'ss'
        end
      end.gsub(/[^a-z0-9\-]/, '')
    end
  end
end
