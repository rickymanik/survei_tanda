Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "localhost:5173", "127.0.0.1:5173", "localhost:3000", "127.0.0.1:3000"

    resource "*",
      headers: :any,
      methods: [:get, :post, :patch, :put, :delete, :options]
  end
end
