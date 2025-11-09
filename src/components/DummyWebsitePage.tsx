import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Search, Menu, User, Package, Truck, Shield, Check, Award, Zap, HeadphonesIcon, Clock, Users as UsersIcon } from 'lucide-react';
import { Button } from './ui/button';

export function DummyWebsitePage() {
  const [embedCode, setEmbedCode] = useState('');
  const [showEmbedInput, setShowEmbedInput] = useState(true);

  const loadWidget = () => {
    if (!embedCode.trim()) return;

    const existingWidgets = document.querySelectorAll('[id^="live-chat-widget-"]');
    existingWidgets.forEach(widget => widget.remove());

    const existingScripts = document.querySelectorAll('script[data-widget-id]');
    existingScripts.forEach(script => script.remove());

    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = embedCode.trim();
      const scriptTag = tempDiv.querySelector('script');

      if (scriptTag) {
        const newScript = document.createElement('script');

        if (scriptTag.src) {
          newScript.src = scriptTag.src;
        }

        Array.from(scriptTag.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });

        if (scriptTag.textContent) {
          newScript.textContent = scriptTag.textContent;
        }

        document.body.appendChild(newScript);
        setShowEmbedInput(false);

        setTimeout(() => {
          const widgets = document.querySelectorAll('[id^="live-chat-widget-"]');
          if (widgets.length > 0) {
            console.log('Widget loaded successfully');
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error loading widget:', error);
      alert('Failed to load widget. Please check the console for details.');
    }
  };

  useEffect(() => {
    return () => {
      const existingWidgets = document.querySelectorAll('[id^="live-chat-widget-"]');
      existingWidgets.forEach(widget => widget.remove());

      const existingScripts = document.querySelectorAll('script[data-widget-id]');
      existingScripts.forEach(script => script.remove());
    };
  }, []);

  const products = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 199.99,
      oldPrice: 249.99,
      rating: 4.8,
      reviews: 256,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Bestseller',
      description: 'Noise-cancelling technology with 30-hour battery life'
    },
    {
      id: 2,
      name: 'Smart Watch Series 7',
      price: 349.99,
      oldPrice: 399.99,
      rating: 4.9,
      reviews: 512,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'New',
      description: 'Advanced health tracking with GPS and water resistance'
    },
    {
      id: 3,
      name: 'Portable Bluetooth Speaker',
      price: 89.99,
      oldPrice: 129.99,
      rating: 4.6,
      reviews: 189,
      image: 'https://images.pexels.com/photos/1279406/pexels-photo-1279406.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Sale',
      description: '360° sound with 12-hour playtime and waterproof design'
    },
    {
      id: 4,
      name: '4K Action Camera',
      price: 299.99,
      oldPrice: 349.99,
      rating: 4.7,
      reviews: 342,
      image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Hot',
      description: 'Ultra HD video with image stabilization and slow-motion'
    },
    {
      id: 5,
      name: 'Wireless Gaming Mouse',
      price: 79.99,
      oldPrice: 99.99,
      rating: 4.7,
      reviews: 423,
      image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Popular',
      description: 'RGB lighting with programmable buttons and 20,000 DPI'
    },
    {
      id: 6,
      name: 'USB-C Hub 7-in-1',
      price: 49.99,
      oldPrice: 69.99,
      rating: 4.5,
      reviews: 287,
      image: 'https://images.pexels.com/photos/4219861/pexels-photo-4219861.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Trending',
      description: 'Multiple ports including HDMI, USB 3.0, and SD card reader'
    },
    {
      id: 7,
      name: 'Mechanical Keyboard',
      price: 129.99,
      oldPrice: 159.99,
      rating: 4.8,
      reviews: 634,
      image: 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Bestseller',
      description: 'RGB backlit keys with hot-swappable switches'
    },
    {
      id: 8,
      name: 'Webcam 1080p HD',
      price: 69.99,
      oldPrice: 89.99,
      rating: 4.6,
      reviews: 198,
      image: 'https://images.pexels.com/photos/4144294/pexels-photo-4144294.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'New',
      description: 'Auto-focus with noise-reducing microphone'
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-white">
      {showEmbedInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold mb-4">Load Chat Widget</h3>
            <p className="text-gray-600 mb-4">
              Paste your widget embed code below to test it on this e-commerce demo site
            </p>
            <textarea
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              placeholder="<!-- Chat Widget Code -->
<script
  src=&quot;http://localhost:5173/widget-loader.js&quot;
  data-widget-id=&quot;your-widget-id&quot;
  data-language=&quot;english&quot;>
</script>"
              className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm h-48 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowEmbedInput(false)}
              >
                Skip for Now
              </Button>
              <Button
                onClick={loadWidget}
                disabled={!embedCode.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Load Widget
              </Button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b sticky top-0 z-40">
        <div className="bg-blue-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
            <span>Free shipping on orders over $50</span>
            <div className="flex items-center gap-4">
              <span>Track Order</span>
              <span>Support</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TechStore</span>
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-6 h-6 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Heart className="w-6 h-6 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>

        <nav className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-8 py-3 text-sm">
              <button className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600">
                <Menu className="w-4 h-4" />
                Categories
              </button>
              <a href="#" className="text-gray-700 hover:text-blue-600">Electronics</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Audio</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Wearables</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Cameras</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Accessories</a>
              <a href="#" className="text-red-600 font-medium">Deals</a>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=1600')] opacity-10 bg-cover bg-center"></div>
          <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <span className="inline-block bg-blue-500 bg-opacity-50 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  Limited Time Offer
                </span>
                <h1 className="text-6xl font-bold mb-6 leading-tight">
                  Tech That Powers Your Life
                </h1>
                <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                  Discover the latest gadgets and accessories with up to 50% off. Premium quality, unbeatable prices, and free shipping on orders over $50.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold">
                    Shop Now
                  </Button>
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold">
                    View Deals
                  </Button>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>30-Day Returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>2-Year Warranty</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Premium Headphones"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-2xl text-gray-900">5,000+</p>
                      <p className="text-gray-600 text-sm">Happy Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 p-3 rounded-full">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                <p className="text-sm text-gray-600">SSL encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 p-3 rounded-full">
                <HeadphonesIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                <p className="text-sm text-gray-600">Always here to help</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Handpicked tech essentials at unbeatable prices</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {product.badge}
                  </span>
                  <button className="absolute top-3 left-3 p-2 bg-white rounded-full hover:bg-red-50 transition-colors shadow-lg">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                  </button>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity"></div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.oldPrice}
                        </span>
                      </div>
                      <span className="text-xs text-green-600 font-semibold">
                        Save ${(product.oldPrice - product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold">
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg font-semibold">
              View All Products
            </Button>
          </div>
        </section>

        <section className="bg-gradient-to-r from-orange-500 to-red-600 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Limited Time Deals"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="text-white">
                <span className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Flash Sale Ends Soon
                </span>
                <h2 className="text-5xl font-bold mb-6">Deals You Can't Miss</h2>
                <p className="text-xl mb-8 text-orange-100">
                  Limited time offers on top-rated gadgets. Save up to 60% on select items before they're gone!
                </p>
                <div className="flex gap-4 mb-8">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">12</p>
                    <p className="text-sm">Hours</p>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">34</p>
                    <p className="text-sm">Minutes</p>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold">56</p>
                    <p className="text-sm">Seconds</p>
                  </div>
                </div>
                <Button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                  Shop Flash Deals
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TechStore?</h2>
            <p className="text-lg text-gray-600">Join thousands of satisfied customers worldwide</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Premium Quality</h3>
              <p className="text-gray-600">
                All products are tested and verified to meet the highest quality standards. We only sell authentic brand-name products.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your orders delivered within 2-3 business days. Free express shipping on orders over $100.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeadphonesIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Expert Support</h3>
              <p className="text-gray-600">
                Our team of tech experts is available 24/7 to help you with any questions or issues via live chat.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
              <p className="text-lg text-gray-400">Real reviews from real customers</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-8 rounded-xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "Amazing quality and fast shipping! The headphones I ordered exceeded my expectations. Will definitely shop here again."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    SM
                  </div>
                  <div>
                    <p className="text-white font-semibold">Sarah Mitchell</p>
                    <p className="text-gray-400 text-sm">Verified Buyer</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "Best tech store online! Great prices, excellent customer service, and my smartwatch arrived perfectly packaged."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div>
                    <p className="text-white font-semibold">James Davis</p>
                    <p className="text-gray-400 text-sm">Verified Buyer</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "The customer support team was incredibly helpful! They answered all my questions via live chat. Highly recommend!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    EC
                  </div>
                  <div>
                    <p className="text-white font-semibold">Emily Chen</p>
                    <p className="text-gray-400 text-sm">Verified Buyer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Need Help Choosing?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Our customer support team is here to assist you. Click the chat widget in the bottom corner to start a conversation with an expert!
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold">
                Email Us
              </Button>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold">
                Call: 1-800-TECHSTORE
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-xl text-gray-300 mb-8">
              Get exclusive deals, product launches, and tech tips delivered to your inbox
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-4">No spam, unsubscribe anytime</p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About TechStore</h3>
              <p className="text-gray-400 text-sm">
                Your trusted source for quality electronics and tech accessories.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Shop</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#">Electronics</a></li>
                <li><a href="#">Audio</a></li>
                <li><a href="#">Wearables</a></li>
                <li><a href="#">Cameras</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Track Order</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe for exclusive deals
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="px-4 py-2 rounded bg-gray-800 text-white text-sm flex-1"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2024 TechStore. All rights reserved.
          </div>
        </div>
      </footer>

      {!showEmbedInput && (
        <button
          onClick={() => setShowEmbedInput(true)}
          className="fixed bottom-24 left-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 text-sm z-30"
        >
          Change Widget
        </button>
      )}
    </div>
  );
}
