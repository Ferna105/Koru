require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "koru-video-trim"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/Ferna105/Koru"
  s.license      = "MIT"
  s.authors      = { "Koru" => "fernamariscotti@gmail.com" }

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :path => "." }
  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.frameworks   = "AVFoundation", "CoreMedia"

  s.dependency "React-Core"
end
